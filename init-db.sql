-- RestoSmartQR Database Initialization Script
-- This script creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id VARCHAR REFERENCES categories(id),
    image_url TEXT,
    available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR REFERENCES products(id) NOT NULL UNIQUE,
    quantity INTEGER DEFAULT 0 NOT NULL,
    min_quantity INTEGER DEFAULT 10 NOT NULL,
    unit TEXT DEFAULT 'unidades' NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document_type TEXT,
    document_number TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    position TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id VARCHAR REFERENCES staff(id) NOT NULL,
    day_of_week INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id VARCHAR REFERENCES staff(id) NOT NULL,
    date TIMESTAMP NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    status TEXT NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number INTEGER NOT NULL,
    customer_id VARCHAR REFERENCES customers(id),
    status TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' NOT NULL,
    is_kiosk BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR REFERENCES orders(id) NOT NULL,
    product_id VARCHAR REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    order_id VARCHAR REFERENCES orders(id),
    date TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR REFERENCES orders(id) NOT NULL UNIQUE,
    invoice_number TEXT NOT NULL UNIQUE,
    cufe TEXT NOT NULL,
    qr_code TEXT,
    status TEXT DEFAULT 'generada' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_schedules_staff_id ON schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Insert a default admin user (password should be hashed in production)
-- This is just a placeholder, the actual password hashing should be done by the application
INSERT INTO users (username, password) 
VALUES ('admin', 'change_this_password')
ON CONFLICT (username) DO NOTHING;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Database initialized successfully!';
END $$;
