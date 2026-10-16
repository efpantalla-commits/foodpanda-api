CREATE DATABASE FoodPandaDB;
USE FoodPandaDB;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role ENUM('Customer', 'Vendor', 'Rider', 'Admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    restaurant_name VARCHAR(150) NOT NULL,
    cuisine_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
        ON DELETE CASCADE
);

CREATE TABLE MenuItems (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
        ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
        ON DELETE CASCADE
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM(
        'Pending', 'Preparing', 'Out for Delivery',
        'Delivered', 'Cancelled'
    ) DEFAULT 'Pending',
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
        ON DELETE CASCADE
);

CREATE TABLE OrderItems (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES MenuItems(item_id)
        ON DELETE CASCADE
);

CREATE TABLE Deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    rider_id INT NOT NULL,
    delivery_status ENUM(
        'Assigned', 'Picked Up', 'Delivered'
    ) DEFAULT 'Assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM(
        'Cash on Delivery', 'Credit Card', 'GCash', 'PayPal'
    ) NOT NULL,
    payment_status ENUM(
        'Pending', 'Completed', 'Failed', 'Refunded'
    ) DEFAULT 'Pending',
    transaction_reference VARCHAR(100) UNIQUE,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE
);