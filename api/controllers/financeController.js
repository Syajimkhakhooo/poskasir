const db = require('../config/database');

// Get all finances
exports.getAllFinances = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM finances ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
};

// Create finance
exports.createFinance = async (req, res, next) => {
    try {
        const { type, category, amount, description } = req.body;
        const result = await db.query(
            'INSERT INTO finances (type, category, amount, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, category, amount, description]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

// Update finance
exports.updateFinance = async (req, res, next) => {
    try {
        const { type, category, amount, description } = req.body;
        const result = await db.query(
            'UPDATE finances SET type = $1, category = $2, amount = $3, description = $4 WHERE id = $5 RETURNING *',
            [type, category, amount, description, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Finance not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

// Delete finance
exports.deleteFinance = async (req, res, next) => {
    try {
        const result = await db.query('DELETE FROM finances WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Finance not found' });
        }

        res.json({ success: true, message: 'Finance deleted successfully' });
    } catch (error) {
        next(error);
    }
};
