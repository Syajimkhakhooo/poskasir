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
                productService.getAll().catch(err => { console.error('Products error:', err); return []; }),
                transactionService.getAll().catch(err => { console.error('Transactions error:', err); return []; }),
                financeService.getAll().catch(err => { console.error('Finances error:', err); return []; }),
                stockOpnameService.getAll().catch(err => { console.error('Stock opnames error:', err); return []; }),
            ]);

            setProducts(Array.isArray(productsData) ? productsData : []);
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            setFinances(Array.isArray(financesData) ? financesData : []);
            setStockOpnames(Array.isArray(stockOpnamesData) ? stockOpnamesData : []);
        } catch (error) {
            console.error('Error loading data:', error);
            // Set empty arrays as fallback
            setProducts([]);
            setTransactions([]);
            setFinances([]);
            setStockOpnames([]);
        } finally {
            setLoading(false);
        }
    };

    // Product functions
    const addProduct = async (product) => {
        try {
            const newProduct = await productService.create(product);
            setProducts([...products, newProduct]);
            return newProduct;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            const updated = await productService.update(id, updates);
            setProducts(products.map(p => p.id === id ? updated : p));
            return updated;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    };

    // Transaction functions
    const addTransaction = async (transaction) => {
        try {
            const newTransaction = await transactionService.create(transaction);
            setTransactions([newTransaction, ...transactions]);
            // Reload products to get updated stock
            await loadAllData();
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
            setFinances([newFinance, ...finances]);
            return newFinance;
        } catch (error) {
            console.error('Error adding finance:', error);
            throw error;
        }
    };

    const updateFinance = async (id, updates) => {
        try {
            const updated = await financeService.update(id, updates);
            setFinances(finances.map(f => f.id === id ? updated : f));
            return updated;
        } catch (error) {
            console.error('Error updating finance:', error);
            throw error;
        }
    };

    const deleteFinance = async (id) => {
        try {
            await financeService.delete(id);
            setFinances(finances.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting finance:', error);
            throw error;
        }
    };

    // Stock Opname functions
    const addStockOpname = async (opname) => {
        try {
            const newOpname = await stockOpnameService.create(opname);
            setStockOpnames([newOpname, ...stockOpnames]);
            // Reload products to get updated stock
            await loadAllData();
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
        refreshData: loadAllData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
