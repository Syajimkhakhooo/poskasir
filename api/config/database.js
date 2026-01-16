const { Pool } = require('pg');
require('dotenv').config();

// Support both connection string (Supabase) and individual params (local)
const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'kasir_pos',
            port: process.env.DB_PORT || 5432,
        }
);

// Test connection
pool.query('SELECT NOW()')
    .then(() => {
        console.log('✅ PostgreSQL connected successfully');
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

module.exports = pool;
