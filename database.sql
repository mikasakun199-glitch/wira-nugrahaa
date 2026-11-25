CREATE DATABASE IF NOT EXISTS dapur_mas_bayu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dapur_mas_bayu;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(25) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT UNSIGNED NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(25) NOT NULL,
  delivery_method ENUM('pickup', 'delivery') NOT NULL DEFAULT 'pickup',
  status ENUM('received', 'processing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'received',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT INTO orders (order_number, customer_name, customer_phone, delivery_method, status, total)
VALUES ('DMB-12345', 'Pelanggan Dapur Mas Bayu', '0800000000', 'pickup', 'processing', 0);
INSERT INTO order_items (order_id, product_name, price, quantity, subtotal)
SELECT id, 'Contoh pesanan', 0, 1, 0 FROM orders WHERE order_number = 'DMB-12345';
