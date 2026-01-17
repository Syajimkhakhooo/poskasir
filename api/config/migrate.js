const db = require('./database');

async function runMigration() {
    try {
        console.log('🔄 Running database migration...');

        // Add new columns to products table
        await db.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100)');
        console.log('✅ Added sku column');

        await db.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 10');
        console.log('✅ Added min_stock column');

        await db.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT');
        console.log('✅ Added description column');

        // Update existing products to have default min_stock if NULL
        await db.query('UPDATE products SET min_stock = 10 WHERE min_stock IS NULL');
        console.log('✅ Updated existing products with default min_stock');

        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
