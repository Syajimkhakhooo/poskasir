const db = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
};

// Get product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

// Create product
exports.createProduct = async (req, res, next) => {
    try {
        const { name, sku, price, stock, minStock, category, description } = req.body;
        const result = await db.query(
            'INSERT INTO products (name, sku, price, stock, min_stock, category, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, sku || null, price, stock || 0, minStock || 10, category || null, description || null]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        const { name, sku, price, stock, minStock, category, description } = req.body;
        const result = await db.query(
            'UPDATE products SET name = $1, sku = $2, price = $3, stock = $4, min_stock = $5, category = $6, description = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
            [name, sku || null, price, stock, minStock || 10, category || null, description || null, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
