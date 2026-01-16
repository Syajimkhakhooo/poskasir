import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import PrintAnimation from './PrintAnimation';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { generateReceiptPDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import { Printer, Download } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, transaction }) => {
    const { currentUser } = useAuth();
    const [isPrinting, setIsPrinting] = useState(false);
    const [settings, setSettings] = useState({ storeName: '', receiptFooter: '' });

    useEffect(() => {
        // Load settings
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    if (!transaction) return null;

    const handlePrint = async () => {
        setIsPrinting(true);

        // Show animation for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate PDF
        generateReceiptPDF(transaction, settings.storeName || currentUser.name, settings.receiptFooter);

        setIsPrinting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Struk Pembayaran" size="md">
            {isPrinting ? (
                <PrintAnimation />
            ) : (
                <>
                    {/* Receipt Preview */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        {/* Header */}
                        <div className="text-center mb-6 pb-4 border-b-2 border-gray-300 dark:border-gray-600">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                STRUK PEMBAYARAN
                            </h2>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                {settings.storeName || currentUser.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {formatDateTime(transaction.createdAt)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                No: {transaction.id}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="mb-6">
                            <div className="space-y-3">
                                {transaction.items.map((item, index) => (
                                    <div key={index} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                        {/* Item name */}
                                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {item.name}
                                        </div>

                                        {/* Description if available */}
                                        {item.description && (
                                            <div className="text-xs italic text-gray-600 dark:text-gray-400 mb-2 ml-2">
                                                {item.description}
                                            </div>
                                        )}

                                        {/* Price details */}
                                        <div className="flex justify-between items-center text-sm ml-2">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    TOTAL:
                                </span>
                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {formatCurrency(transaction.total)}
                                </span>
                            </div>

                            {transaction.payment && (
                                <>
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Bayar:</span>
                                        <span>{formatCurrency(transaction.payment)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Kembali:</span>
                                        <span>{formatCurrency(transaction.payment - transaction.total)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Custom Footer from Settings */}
                        {settings.receiptFooter && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line text-center">
                                    {settings.receiptFooter}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-4">
                            <p>Terima kasih atas kunjungan Anda!</p>
                            <p className="mt-1">Barang yang sudah dibeli tidak dapat dikembalikan</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Tutup
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={handlePrint}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ReceiptModal;
