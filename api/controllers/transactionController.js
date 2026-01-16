const db = require('../config/database');

// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT 
                t.*,
                json_agg(
                    json_build_object(
                        'id', ti.id,
                        'productId', ti.product_id,
                        'productName', ti.product_name,
                        'quantity', ti.quantity,
                        'price', ti.price,
                        'subtotal', ti.subtotal
                    )
                ) as items
            FROM transactions t
            LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
            GROUP BY t.id
            ORDER BY t.created_at DESC
        `);

        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
};

// Create transaction
exports.createTransaction = async (req, res, next) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const { items, total, paymentMethod } = req.body;

        // Insert transaction
        const transactionResult = await client.query(
            'INSERT INTO transactions (total, payment_method) VALUES ($1, $2) RETURNING id',
            [total, paymentMethod]
        );

        const transactionId = transactionResult.rows[0].id;

        // Insert transaction items and update stock
        for (const item of items) {
            await client.query(
                'INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
                [transactionId, item.productId, item.productName, item.quantity, item.price, item.subtotal]
            );

            // Update product stock
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.productId]
            );
        }

        await client.query('COMMIT');

        // Get the created transaction with items
        const newTransaction = await db.query(`
            SELECT 
                t.*,
                json_agg(
                    json_build_object(
                        'id', ti.id,
                        'productId', ti.product_id,
                        'productName', ti.product_name,
                        'quantity', ti.quantity,
                        'price', ti.price,
                        'subtotal', ti.subtotal
                    )
                ) as items
            FROM transactions t
            LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
            WHERE t.id = $1
            GROUP BY t.id
        `, [transactionId]);

        res.status(201).json({ success: true, data: newTransaction.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};
