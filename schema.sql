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
    values ("LG HD Smart 40-Inch OLED TV",                     "Electronics",      8999.85,  599.99,  10),
           ("Sceptre 24 inches 720p LED TV",                   "Electronics",      3999.50,  79.99,    1),
           ("Sony 55-Inch 4K Ultra HD Smart BRAVIA OLED TV",   "Electronics",      51749.85, 3449.99, 20),
           ("Samsung QN65Q6FN FLAT 65” QLED 4K",               "Electronics",      55199.88, 4599.99,  4),
           ("CLARKS Men's Desert Trek Moccasin Shoes",         "Clothing",         16992.40, 147.76,  50),
           ("ECCO Men's Track 25 Premium Low Oxford Shoes",    "Clothing",         28738.50, 249.95,  40),
           ("Crocs Women's Classic Clog Shoes",                "Clothing",         18118.25, 157.55,  15),
           ("UGG Women's Shaye Rain Boot",                     "Clothing",         19767.10, 91.94,    3),
           ("Makita XT337T LXT Cordless 3-Pc. Combo Kit ",     "Home Improvement", 58176.20, 505.88,  15),
           ("Bosch Fixed Base Router 2.5 Horsepower",          "Home Improvement", 42997.85, 199.99,  10),
           ("Bosch Power Tools Tablesaw 4100-10",              "Home Improvement", 28346.85, 89.99,    8),
           ("BLACK+DECKER LDX120C 20V MAX Lithium Ion Drill",  "Home Improvement", 86248.85, 749.99,   4);
 
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
    values ("Electronics",      30000),
           ("Clothing",         20000),
           ("Home Improvement", 10000)