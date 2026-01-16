import { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Package, Search, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Inventory = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        minStock: '10',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.stock) {
            alert('Mohon lengkapi field yang wajib diisi!');
            return;
        }

        const data = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            minStock: parseInt(formData.minStock) || 10,
        };

        if (editingId) {
            updateProduct(editingId, data);
        } else {
            addProduct(data);
        }

        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            price: '',
            stock: '',
            minStock: '10',
            description: '',
        });
        setEditingId(null);
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            sku: product.sku || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            minStock: (product.minStock || 10).toString(),
            description: product.description || '',
        });
        setEditingId(product.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            deleteProduct(id);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockProducts = products.filter(p => p.stock < (p.minStock || 10));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Stok Barang
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Kelola inventori produk Anda
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Total Produk
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {products.length}
                            </p>
                        </div>
                        <Package className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Total Stok
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {products.reduce((sum, p) => sum + p.stock, 0)}
                            </p>
                        </div>
                        <Package className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Stok Rendah
                            </p>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {lowStockProducts.length}
                            </p>
                        </div>
                        <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </Card>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <Card className="border-l-4 border-yellow-500">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Peringatan Stok Rendah
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                                    >
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </span>
                                        <span className="text-sm text-yellow-700 dark:text-yellow-400">
                                            Stok: {product.stock}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Product List */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="w-full sm:w-64">
                        <Input
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Produk
                    </Button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Belum ada produk
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Produk Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Nama Produk
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        SKU
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Harga
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Stok
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {product.name}
                                                </p>
                                                {product.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {product.sku || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white text-right">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {product.stock < (product.minStock || 10) ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    Rendah
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingId ? 'Edit Produk' : 'Tambah Produk'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nama Produk *"
                        placeholder="Masukkan nama produk"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Input
                        label="SKU (Kode Produk)"
                        placeholder="Contoh: PRD-001"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Harga *"
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />

                        <Input
                            type="number"
                            label="Stok Awal *"
                            placeholder="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        type="number"
                        label="Stok Minimum"
                        placeholder="10"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows="3"
                            placeholder="Deskripsi produk (opsional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                            {editingId ? 'Update' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
