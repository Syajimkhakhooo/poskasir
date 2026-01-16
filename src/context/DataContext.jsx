import { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { transactionService } from '../services/transactionService';
import { financeService } from '../services/financeService';
import { stockOpnameService } from '../services/stockOpnameService';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [finances, setFinances] = useState([]);
    const [stockOpnames, setStockOpnames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load all data from API
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [productsData, transactionsData, financesData, stockOpnamesData] = await Promise.all([
                productService.getAll(),
                transactionService.getAll(),
                financeService.getAll(),
                stockOpnameService.getAll(),
            ]);

            setProducts(productsData);
            setTransactions(transactionsData);
            setFinances(financesData);
            setStockOpnames(stockOpnamesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Product functions
    const addProduct = async (product) => {
        try {
            const newProduct = await productService.create(product);
            setProducts(prev => [newProduct, ...prev]);
            return newProduct;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            const updatedProduct = await productService.update(id, updates);
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productService.delete(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    };

    // Transaction functions
    const addTransaction = async (transaction) => {
        try {
            const newTransaction = await transactionService.create(transaction);
            setTransactions(prev => [newTransaction, ...prev]);

            // Reload products to get updated stock
            const updatedProducts = await productService.getAll();
            setProducts(updatedProducts);

            return newTransaction;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    };

    // Finance functions
    const addFinance = async (finance) => {
        try {
            const newFinance = await financeService.create(finance);
            setFinances(prev => [newFinance, ...prev]);
            return newFinance;
        } catch (error) {
            console.error('Error adding finance:', error);
            throw error;
        }
    };

    const updateFinance = async (id, updates) => {
        try {
            const updatedFinance = await financeService.update(id, updates);
            setFinances(prev => prev.map(f => f.id === id ? updatedFinance : f));
            return updatedFinance;
        } catch (error) {
            console.error('Error updating finance:', error);
            throw error;
        }
    };

    const deleteFinance = async (id) => {
        try {
            await financeService.delete(id);
            setFinances(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting finance:', error);
            throw error;
        }
    };

    // Stock Opname functions
    const addStockOpname = async (opname) => {
        try {
            const newOpname = await stockOpnameService.create(opname);
            setStockOpnames(prev => [newOpname, ...prev]);

            // Reload products to get updated stock
            const updatedProducts = await productService.getAll();
            setProducts(updatedProducts);

            return newOpname;
        } catch (error) {
            console.error('Error adding stock opname:', error);
            throw error;
        }
    };

    const value = {
        products,
        transactions,
        finances,
        stockOpnames,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addTransaction,
        addFinance,
        updateFinance,
        deleteFinance,
        addStockOpname,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
