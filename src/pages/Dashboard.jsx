import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { DollarSign, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const Dashboard = () => {
    const { transactions, products, finances } = useData();

    // Calculate statistics
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    const balance = totalIncome - totalExpense + totalSales;
    const lowStockProducts = products.filter(p => p.stock < (p.minStock || 10));

    const stats = [
        {
            title: 'Total Penjualan',
            value: formatCurrency(totalSales),
            icon: DollarSign,
            color: 'bg-green-500',
            textColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Total Pengeluaran',
            value: formatCurrency(totalExpense),
            icon: TrendingDown,
            color: 'bg-red-500',
            textColor: 'text-red-600 dark:text-red-400',
        },
        {
            title: 'Saldo',
            value: formatCurrency(balance),
            icon: TrendingUp,
            color: 'bg-blue-500',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Total Produk',
            value: products.length,
            icon: Package,
            color: 'bg-purple-500',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Ringkasan bisnis Anda
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className={`text-2xl font-bold ${stat.textColor}`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>
                ))}
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
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                {lowStockProducts.length} produk memiliki stok rendah
                            </p>
                            <div className="space-y-2">
                                {lowStockProducts.slice(0, 5).map((product) => (
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

            {/* Recent Transactions */}
            <Card title="Transaksi Terbaru">
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Belum ada transaksi
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        No. Transaksi
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tanggal
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Items
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(-5).reverse().map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            #{transaction.id.slice(-6)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDateTime(transaction.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {transaction.items.length} item
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white text-right">
                                            {formatCurrency(transaction.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
