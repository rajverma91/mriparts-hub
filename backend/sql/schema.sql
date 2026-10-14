CREATE DATABASE IF NOT EXISTS mriparts_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mriparts_hub;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('buyer','seller','admin') DEFAULT 'buyer',
  company VARCHAR(180) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  country VARCHAR(80) DEFAULT NULL,
  is_verified TINYINT(1) DEFAULT 0,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  parent_id INT DEFAULT NULL
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE
);

-- Listings
CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) DEFAULT 0,
  currency VARCHAR(8) DEFAULT 'USD',
  condition_type ENUM('new','used','refurbished') DEFAULT 'used',
  category_id INT,
  brand_id INT,
  model VARCHAR(180),
  year INT,
  country VARCHAR(80),
  city VARCHAR(80),
  image_url VARCHAR(500),
  status ENUM('pending','active','rejected','sold') DEFAULT 'pending',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_category (category_id),
  INDEX idx_brand (brand_id)
);

-- Seed categories
INSERT IGNORE INTO categories (name, slug) VALUES
('MRI Machines','mri-machines'),
('CT Scanners','ct-scanners'),
('Ultrasound Machines','ultrasound-machines'),
('X-Ray Systems','x-ray-systems'),
('Anesthesia Ventilators','anesthesia-ventilators'),
('Mammography Machines','mammography-machines'),
('Ophthalmic Microscopes','ophthalmic-microscopes'),
('Blood Gas Analyzers','blood-gas-analyzers'),
('MRI Coils','mri-coils'),
('MRI Parts & Accessories','mri-parts-accessories');

-- Seed brands
INSERT IGNORE INTO brands (name) VALUES
('GE Healthcare'),('Siemens Healthineers'),('Philips'),('Canon Medical'),
('Toshiba'),('Hitachi'),('Samsung Medison'),('Mindray'),('Fujifilm');

-- Seed admin (password: admin123) -> change immediately
INSERT IGNORE INTO users (name, email, password_hash, role, is_verified)
VALUES ('Admin','admin@mripartshub.com',
'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
'admin',1);