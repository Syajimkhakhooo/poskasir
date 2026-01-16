import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Save } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        storeName: '',
        receiptFooter: '',
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Pengaturan
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Kelola pengaturan aplikasi dan struk
                </p>
            </div>

            <Card title="Pengaturan Struk">
                <div className="space-y-4">
                    <Input
                        label="Nama Toko"
                        placeholder="Contoh: Toko Saya"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catatan Footer Struk
                        </label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows="4"
                            placeholder="Contoh: Jam Buka: 08.00 - 20.00&#10;Terima pesanan online&#10;WhatsApp: 08123456789"
                            value={settings.receiptFooter}
                            onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Catatan ini akan muncul di struk, di bawah total pembayaran sebelum ucapan terima kasih
                        </p>
                    </div>

                    {saved && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">
                            ✓ Pengaturan berhasil disimpan!
                        </div>
                    )}

                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="w-full sm:w-auto"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Pengaturan
                    </Button>
                </div>
            </Card>

            <Card title="Preview Struk">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            STRUK PEMBAYARAN
                        </h3>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                            {settings.storeName || 'Nama Toko'}
                        </p>
                    </div>

                    <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                TOTAL:
                            </span>
                            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                Rp 100.000
                            </span>
                        </div>
                    </div>

                    {settings.receiptFooter && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line text-center">
                                {settings.receiptFooter}
                            </p>
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-4">
                        <p>Terima kasih atas kunjungan Anda!</p>
                        <p className="mt-1">Barang yang sudah dibeli tidak dapat dikembalikan</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
