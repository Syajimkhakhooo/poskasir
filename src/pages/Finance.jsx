import { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2, DollarSign } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const Finance = () => {
    const { finances, addFinance, updateFinance, deleteFinance, transactions } = useData();
    const [activeTab, setActiveTab] = useState('income'); // income or expense
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'income',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    // Calculate totals
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    const balance = totalSales + totalIncome - totalExpense;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.category) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        const data = {
            ...formData,
            amount: parseFloat(formData.amount),
        };

        if (editingId) {
            updateFinance(editingId, data);
        } else {
            addFinance(data);
        }

        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            type: 'income',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
        setEditingId(null);
    };

    const handleEdit = (finance) => {
        setFormData({
            type: finance.type,
            amount: finance.amount.toString(),
            category: finance.category,
            description: finance.description || '',
            date: finance.date || new Date().toISOString().split('T')[0],
        });
        setEditingId(finance.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            deleteFinance(id);
        }
    };

    const openAddModal = (type) => {
        resetForm();
        setFormData(prev => ({ ...prev, type }));
        setShowModal(true);
    };

    const filteredFinances = finances.filter(f => f.type === activeTab);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Keuangan
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Kelola pemasukan dan pengeluaran
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm mb-1">Total Penjualan</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-green-200" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Pemasukan Lain</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-blue-200" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm mb-1">Total Pengeluaran</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                        </div>
                        <TrendingDown className="w-10 h-10 text-red-200" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm mb-1">Saldo</p>
                            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-purple-200" />
                    </div>
                </Card>
            </div>

            {/* Tabs and Records */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex space-x-2">
                        <Button
                            variant={activeTab === 'income' ? 'primary' : 'secondary'}
                            onClick={() => setActiveTab('income')}
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Pemasukan
                        </Button>
                        <Button
                            variant={activeTab === 'expense' ? 'primary' : 'secondary'}
                            onClick={() => setActiveTab('expense')}
                        >
                            <TrendingDown className="w-4 h-4 mr-2" />
                            Pengeluaran
                        </Button>
                    </div>

                    <Button
                        variant="success"
                        onClick={() => openAddModal(activeTab)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah {activeTab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </Button>
                </div>

                {filteredFinances.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Belum ada data {activeTab === 'income' ? 'pemasukan' : 'pengeluaran'}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tanggal
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Kategori
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Keterangan
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Jumlah
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFinances.slice().reverse().map((finance) => (
                                    <tr
                                        key={finance.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDateTime(finance.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            {finance.category}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {finance.description || '-'}
                                        </td>
                                        <td className={`py-3 px-4 text-sm font-semibold text-right ${finance.type === 'income'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {finance.type === 'income' ? '+' : '-'} {formatCurrency(finance.amount)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(finance)}
                                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(finance.id)}
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
                title={editingId ? 'Edit Data' : `Tambah ${formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="number"
                        label="Jumlah"
                        placeholder="Masukkan jumlah"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />

                    <Input
                        label="Kategori"
                        placeholder="Contoh: Gaji, Sewa, Listrik, dll"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Keterangan
                        </label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            rows="3"
                            placeholder="Keterangan tambahan (opsional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <Input
                        type="date"
                        label="Tanggal"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />

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

export default Finance;
