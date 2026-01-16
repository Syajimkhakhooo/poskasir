const db = require('../config/database');

// Get all stock opnames
exports.getAllStockOpnames = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM stock_opnames ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
};

// Create stock opname
exports.createStockOpname = async (req, res, next) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const { productId, productName, systemStock, actualStock, notes } = req.body;
        const difference = actualStock - systemStock;

        // Insert stock opname record
        const result = await client.query(
            'INSERT INTO stock_opnames (product_id, product_name, system_stock, actual_stock, difference, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [productId, productName, systemStock, actualStock, difference, notes]
        );

        // Update product stock to actual stock
        await client.query(
            'UPDATE products SET stock = $1 WHERE id = $2',
            [actualStock, productId]
        );

        await client.query('COMMIT');

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};
