import { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import ReceiptModal from '../components/ReceiptModal';
import { Plus, Minus, Trash2, ShoppingCart, Receipt, Search } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const Transactions = () => {
    const { products, addTransaction, transactions } = useData();
    const [cart, setCart] = useState([]);
    const [payment, setPayment] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    // Filter products by search
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add to cart
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                description: product.description || '', // Include description
            }]);
        }
    };


    // Update quantity
    const updateQuantity = (productId, change) => {
        setCart(cart.map(item => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + change;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        }));
    };

    // Remove from cart
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Process transaction
    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        const paymentAmount = parseFloat(payment) || 0;

        if (paymentAmount < total) {
            alert('Pembayaran kurang!');
            return;
        }

        const transaction = {
            items: cart,
            total,
            payment: paymentAmount,
        };

        const newTransaction = addTransaction(transaction);

        // Show receipt
        setSelectedReceipt(newTransaction);
        setShowReceipt(true);

        // Reset
        setCart([]);
        setPayment('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Transaksi Penjualan
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Kelola transaksi penjualan Anda
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <Card title="Pilih Produk">
                        <div className="mb-4">
                            <Input
                                placeholder="Cari produk..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Belum ada produk. Tambahkan produk di menu Stok Barang.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {product.name}
                                            </h4>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                Stok: {product.stock}
                                            </span>
                                        </div>
                                        {product.sku && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                SKU: {product.sku}
                                            </p>
                                        )}
                                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                            {formatCurrency(product.price)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Cart & Checkout */}
                <div className="space-y-4">
                    <Card title="Keranjang">
                        {cart.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Keranjang kosong
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {item.name}
                                                </span>
                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, -1)}
                                                        className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, 1)}
                                                        className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Total:
                                        </span>
                                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>

                                    <Input
                                        type="number"
                                        label="Pembayaran"
                                        placeholder="Masukkan jumlah bayar"
                                        value={payment}
                                        onChange={(e) => setPayment(e.target.value)}
                                    />

                                    {payment && parseFloat(payment) >= total && (
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-700 dark:text-gray-300">Kembali:</span>
                                                <span className="font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(parseFloat(payment) - total)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        variant="success"
                                        className="w-full"
                                        onClick={handleCheckout}
                                    >
                                        <Receipt className="w-4 h-4 mr-2" />
                                        Proses Transaksi
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </div>

            {/* Transaction History */}
            <Card title="Riwayat Transaksi">
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
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice().reverse().map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            #{transaction.id.slice(-8)}
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
                                        <td className="py-3 px-4 text-center">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedReceipt(transaction);
                                                    setShowReceipt(true);
                                                }}
                                            >
                                                <Receipt className="w-4 h-4 mr-1" />
                                                Cetak Struk
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Receipt Modal */}
            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                transaction={selectedReceipt}
            />
        </div>
    );
};

export default Transactions;
