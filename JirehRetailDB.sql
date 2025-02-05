-- Create database
CREATE DATABASE IF NOT EXISTS jireh_retail_db;
USE jireh_db;
SET GLOBAL event_scheduler = ON;

-- Modify USER table to include owner role
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_id INT NOT NULL,
    location_id INT,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('manager', 'admin', 'sales', 'warehouse') NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Update BUSINESS table to refer to user table for owners
CREATE TABLE business (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- Referencing user as owner
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create PLAN table
CREATE TABLE plan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(100) NOT NULL,
    name_am VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10, 2) CHECK (monthly_price >= 0),
    yearly_price DECIMAL(10, 2) CHECK (yearly_price >= 0),
    duration INT NOT NULL CHECK (duration > 0),
    description_en TEXT,
    description_am TEXT,
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create FEATURE table
CREATE TABLE feature (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_am VARCHAR(255) NOT NULL,
    included BOOLEAN DEFAULT false,
    FOREIGN KEY (plan_id) REFERENCES plan(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

-- Create SUBSCRIPTION table
CREATE TABLE subscription (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    subscription_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'INACTIVE',
    last_payment_date DATETIME,
    next_billing_date DATETIME NOT NULL,
    retry_count INT DEFAULT 0,
    last_retry_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business(id),
    FOREIGN KEY (plan_id) REFERENCES plan(id)
);

-- Create LOCATION table
CREATE TABLE location (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business(id)
);

-- Create EXPENSE table
CREATE TABLE expense (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_id INT NOT NULL,
    location_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    payment_method ENUM('Cash', 'Telebirr', 'Bank Transfer', 'Credit') NOT NULL,
    receipt_number VARCHAR(50),             
    recurring_frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly'), 
    recurring_end_date DATE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES business(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES user(id)
);

-- Create CATEGORY table
CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create ITEM table
CREATE TABLE item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    last_inventory_update DATETIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create ORDER table
CREATE TABLE `order` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_id INT NOT NULL,
    location_id INT NOT NULL,
    user_id INT NOT NULL,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    
    -- Customer information
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    
    -- Order status and timing
    order_date DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    
    -- Financial information
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment information
    payment_status ENUM('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('Cash', 'Telebirr', 'Bank Transfer', 'Credit') NOT NULL DEFAULT 'Cash',
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    remaining_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (business_id) REFERENCES business(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create ORDER items table
CREATE TABLE order_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    category_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES `order`(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE db_version (
    version VARCHAR(50),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- For expense analysis and reporting
CREATE INDEX idx_expense_date_amount ON expense(expense_date, amount);
CREATE INDEX idx_recurring_frequency ON expense(recurring_frequency);
CREATE INDEX idx_expense_lookup ON expense(business_id, location_id, expense_date);

-- Authentication & User Management Indices
CREATE INDEX idx_user_auth ON user(email, password_hash);  -- For login queries
CREATE INDEX idx_user_location_role ON user(location_id, user_role);  -- For role-based location access
CREATE INDEX idx_user_business_status ON user(business_id, is_active);  -- For active users per business

-- business Management Indices
CREATE INDEX idx_business_owner ON business(owner_id, is_active);  -- For owner's business lookup
CREATE INDEX idx_business_admin ON business(admin_id, is_active);  -- For admin's business management

-- Location Management Indices
CREATE INDEX idx_location_business ON location(business_id, is_active);  -- For business's locations
CREATE INDEX idx_location_status ON location(is_active, business_id);  -- For active locations lookup

-- Employee Management Indices
CREATE INDEX idx_employee_lookup ON employee(business_id, location_id, is_active);  -- For employee filtering
CREATE INDEX idx_employee_contact ON employee(phone, email);  -- For contact lookups

-- Category & Item Management Indices
CREATE INDEX idx_category_location ON category(location_id, is_active);  -- For location's categories
CREATE INDEX idx_item_inventory ON item(category_id, quantity);  -- For inventory management

-- Add index on plan_id for better performance
CREATE INDEX idx_plan_id ON feature(plan_id);

-- Order Management Indices
CREATE INDEX idx_order_lookup ON `order`(
    business_id, 
    location_id, 
    status,
    order_date
);  -- For order filtering and reporting

CREATE INDEX idx_order_payment ON `order`(
    payment_status,
    payment_method,
    total_amount
);  -- For payment tracking

CREATE INDEX idx_order_customer ON `order`(
    customer_phone,
    customer_email
);  -- For customer order history

CREATE INDEX idx_order_number_search ON `order`(
    order_number,
    status,
    payment_status
);  -- For order number searches

-- Subscription Management Indices
CREATE INDEX idx_subscription_tracking ON subscription(
    business_id,
    payment_status,
    end_date
);  -- For subscription status tracking

-- Create stored procedure to reset expired subscriptions
DELIMITER //
CREATE PROCEDURE reset_expired_subscriptions()
BEGIN
    UPDATE subscription
    SET subscription_status = 'INACTIVE',
        payment_status = 'EXPIRED'
    WHERE end_date < CURRENT_DATE()
      AND subscription_status != 'INACTIVE';
END //
DELIMITER ;

-- Create event scheduler to run the reset procedure daily
DELIMITER //
CREATE EVENT subscription_reset_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    CALL reset_expired_subscriptions();
END //
DELIMITER ;