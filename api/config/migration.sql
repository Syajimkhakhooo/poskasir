-- Migration script to add missing columns to products table
-- Run this if you already have an existing database

-- Add new columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 10;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing products to have default min_stock if NULL
UPDATE products SET min_stock = 10 WHERE min_stock IS NULL;
