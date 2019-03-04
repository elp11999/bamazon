--
-- Drop database bamazon
--
drop database if exists bamazon;

--
-- Create database bamazon
--
create database bamazon;

--
-- Set bamazon as current database
--
use bamazon;

--
-- Create products table
--
create table products (
    item_id int primary key not null auto_increment,
    product_name varchar(50) not null,    
    product_sales decimal(10,2) default 0,
    department_name varchar(32) not null,
    price decimal(10,2),
    stock_quantity int
);

--
-- Insert data into the products table
--
insert into products (product_name, department_name, product_sales, price, stock_quantity)
    values ("LG HD Smart 40-Inch OLED TV",                     "Electronics", 0, 599.99,  5),
           ("Sceptre 24 inches 720p LED TV",                   "Electronics", 0, 79.00,   1),
           ("Sony 55-Inch 4K Ultra HD Smart BRAVIA OLED TV",   "Electronics", 0, 3449.99, 3),
           ("Samsung QN65Q6FN FLAT 65” QLED 4K",               "Electronics", 0, 4599.99, 4),
           ("Lenovo Chromebook Convertible Laptop, 11.6-Inch", "Electronics", 0, 119.00,  1),
           ("Dell 2018 Inspiron 13 7000 2-in-1 13.3 Laptop",   "Electronics", 0, 595.98,  6),
           ("Apple MacBook Air 13-Inch, 1.8GHz",               "Electronics", 0, 799.99,  1),
           ("CYBERPOWER PC Gamer Xtreme VR GXiVd",             "Electronics", 0, 879.00,  3),
           ("Apple iPhone 6 Plus",                             "Electronics", 0, 209.99,  5),
           ("Jitterbug Flip Phone - Red",                      "Electronics", 0, 19.99,   7),
           ("Apple iPhone 8 (64GB) - Silver",                  "Electronics", 0, 599.99,  5),
           ("Samsung Galaxy Note 9 6.4” Screen",               "Electronics", 0, 749.99,  4);
 
--
-- Create departments table
--
create table departments (
    department_id int primary key not null auto_increment,
    department_name varchar(32) not null,
    over_head_costs  decimal(10,2)
);

--
-- Insert data into the departments table
--
insert into departments (department_name, over_head_costs)
    values ("Electronics",  30000),
           ("Clothing",     20000),
           ("Toys & Games", 10000)