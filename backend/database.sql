CREATE DATABASE IF NOT EXISTS xorvia_db;
USE xorvia_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    whatsapp VARCHAR(20),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    employee_code VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('admin', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, phone, address, whatsapp, status, employee_code, email, password_hash, role)
VALUES ('Admin User', '+1234567890', '123 Admin St', '+1234567890', 'Active', 'EMP000', 'admin@xorvia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO users (name, phone, address, whatsapp, status, employee_code, email, password_hash, role) VALUES
('John Doe', '+1234567890', '123 Main St', '+1234567890', 'Active', 'EMP001', 'john@xorvia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee'),
('Jane Smith', '+0987654321', '456 Oak Ave', '+0987654321', 'Active', 'EMP002', 'jane@xorvia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee');