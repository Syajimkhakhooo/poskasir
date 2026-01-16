import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [finances, setFinances] = useState([]);
    const [stockOpnames, setStockOpnames] = useState([]);

    // Load user-specific data
    useEffect(() => {
        if (currentUser) {
            const userDataKey = `userData_${currentUser.id}`;
            const savedData = localStorage.getItem(userDataKey);

            if (savedData) {
                const data = JSON.parse(savedData);
                setProducts(data.products || []);
                setTransactions(data.transactions || []);
                setFinances(data.finances || []);
                setStockOpnames(data.stockOpnames || []);
            } else {
                // Initialize with empty data
                setProducts([]);
                setTransactions([]);
                setFinances([]);
                setStockOpnames([]);
            }
        }
    }, [currentUser]);

    // Save data whenever it changes
    useEffect(() => {
        if (currentUser) {
            const userDataKey = `userData_${currentUser.id}`;
            const data = {
                products,
                transactions,
                finances,
                stockOpnames,
            };
            localStorage.setItem(userDataKey, JSON.stringify(data));
        }
    }, [products, transactions, finances, stockOpnames, currentUser]);

    // Product functions
    const addProduct = (product) => {
        const newProduct = {
            id: Date.now().toString(),
            ...product,
            createdAt: new Date().toISOString(),
        };
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    };

    const updateProduct = (id, updates) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    // Transaction functions
    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now().toString(),
            ...transaction,
            createdAt: new Date().toISOString(),
        };
        setTransactions(prev => [...prev, newTransaction]);

        // Update product stock
        transaction.items.forEach(item => {
            updateProduct(item.productId, {
                stock: products.find(p => p.id === item.productId).stock - item.quantity
            });
        });

        return newTransaction;
    };

    // Finance functions
    const addFinance = (finance) => {
        const newFinance = {
            id: Date.now().toString(),
            ...finance,
            createdAt: new Date().toISOString(),
        };
        setFinances(prev => [...prev, newFinance]);
        return newFinance;
    };

    const updateFinance = (id, updates) => {
        setFinances(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteFinance = (id) => {
        setFinances(prev => prev.filter(f => f.id !== id));
    };

    // Stock Opname functions
    const addStockOpname = (opname) => {
        const newOpname = {
            id: Date.now().toString(),
            ...opname,
            createdAt: new Date().toISOString(),
        };
        setStockOpnames(prev => [...prev, newOpname]);

        // Update product stock
        updateProduct(opname.productId, { stock: opname.actualStock });

        return newOpname;
    };

    const value = {
        products,
        transactions,
        finances,
        stockOpnames,
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
