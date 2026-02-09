-- Simple Database Schema for Personal Finance Tracker

-- Create Database
CREATE DATABASE finance_tracker;
USE finance_tracker;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Income Table
CREATE TABLE income (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Budget Table
CREATE TABLE budgets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data
INSERT INTO users (name, email, password) VALUES 
('Demo User', 'demo@example.com', 'password123');
