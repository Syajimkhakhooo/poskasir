const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/products');
const transactionRoutes = require('./routes/transactions');
const financeRoutes = require('./routes/finances');
const stockOpnameRoutes = require('./routes/stockOpnames');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Kasir POS API is running!' });
});

app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/stock-opnames', stockOpnameRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
