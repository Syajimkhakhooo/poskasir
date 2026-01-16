import { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { ClipboardList, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

const StockOpname = () => {
    const { products, stockOpnames, addStockOpname } = useData();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        actualStock: '',
        reason: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.productId || formData.actualStock === '') {
            alert('Mohon lengkapi semua field!');
            return;
        }

        const product = products.find(p => p.id === formData.productId);
        if (!product) {
            alert('Produk tidak ditemukan!');
            return;
        }

        const actualStock = parseInt(formData.actualStock);
        const difference = actualStock - product.stock;

        const opnameData = {
            productId: formData.productId,
            productName: product.name,
            systemStock: product.stock,
            actualStock: actualStock,
            difference: difference,
            reason: formData.reason,
        };

        addStockOpname(opnameData);

        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            actualStock: '',
            reason: '',
        });
    };

    const selectedProduct = products.find(p => p.id === formData.productId);
    const difference = selectedProduct && formData.actualStock !== ''
        ? parseInt(formData.actualStock) - selectedProduct.stock
        : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Stock Opname
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Penyesuaian dan audit stok barang
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Total Penyesuaian
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stockOpnames.length}
                            </p>
                        </div>
                        <ClipboardList className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Penambahan Stok
                            </p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {stockOpnames.filter(o => o.difference > 0).length}
                            </p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Pengurangan Stok
                            </p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                {stockOpnames.filter(o => o.difference < 0).length}
                            </p>
                        </div>
                        <TrendingDown className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                </Card>
            </div>

            {/* Add Opname Button */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Riwayat Stock Opname
                    </h3>
                    <Button
                        variant="primary"
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Penyesuaian
                    </Button>
                </div>

                {stockOpnames.length === 0 ? (
                    <div className="text-center py-12">
                        <ClipboardList className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Belum ada riwayat stock opname
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Penyesuaian Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tanggal
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Produk
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Stok Sistem
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Stok Aktual
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Selisih
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Alasan
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockOpnames.slice().reverse().map((opname) => (
                                    <tr
                                        key={opname.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDateTime(opname.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {opname.productName}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                                            {opname.systemStock}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center font-semibold text-gray-900 dark:text-white">
                                            {opname.actualStock}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${opname.difference > 0
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : opname.difference < 0
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {opname.difference > 0 ? '+' : ''}{opname.difference}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {opname.reason || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add Opname Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title="Tambah Stock Opname"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Pilih Produk *
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            required
                        >
                            <option value="">-- Pilih Produk --</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} (Stok: {product.stock})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProduct && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-900 dark:text-blue-300">
                                        Stok Sistem Saat Ini: {selectedProduct.stock}
                                    </p>
                                    <p className="text-blue-700 dark:text-blue-400 mt-1">
                                        Masukkan jumlah stok aktual hasil penghitungan fisik
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Input
                        type="number"
                        label="Stok Aktual (Hasil Hitung Fisik) *"
                        placeholder="Masukkan jumlah stok aktual"
                        value={formData.actualStock}
                        onChange={(e) => setFormData({ ...formData, actualStock: e.target.value })}
                        required
                    />

                    {selectedProduct && formData.actualStock !== '' && (
                        <div className={`p-4 rounded-lg ${difference > 0
                                ? 'bg-green-50 dark:bg-green-900/20'
                                : difference < 0
                                    ? 'bg-red-50 dark:bg-red-900/20'
                                    : 'bg-gray-50 dark:bg-gray-700'
                            }`}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Selisih:
                                </span>
                                <span className={`text-lg font-bold ${difference > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : difference < 0
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {difference > 0 ? '+' : ''}{difference}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {difference > 0
                                    ? 'Stok akan bertambah'
                                    : difference < 0
                                        ? 'Stok akan berkurang'
                                        : 'Tidak ada perubahan stok'}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Alasan Penyesuaian
                        </label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows="3"
                            placeholder="Contoh: Barang rusak, kehilangan, kesalahan input, dll"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                        >
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1">
                            Simpan Penyesuaian
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StockOpname;
