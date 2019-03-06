//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonSQL.js - MySql functions for the Bamazon application 
//

// Load DotEnv library
require("dotenv").config();

// Load MySql library
var mySql = require("mysql");

// Create MySql connection object
var connection = mySql.createConnection(
    {
        host     : process.env.MYSQL_HOSTNAME,
        user     : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : 'bamazon'
    }
);

// Bamazon SQL Object
var bamazonSQL = {

    // Function to connect to the MySql Database
    connect : function(cb) {

        // Connect to MySql database
        connection.connect(function(err) {

            // Check for error
            if (err) throw(err);

            // Run the callback function
            cb();
        });
    },

    // Function to disconnect from the MySql Database
    disconnect : function() {

        // Disconnect from the MySql database        
        connection.end();
    },

    // Function to get items for sale
    getItemsForSale : function(cb) {
        var query = connection.query("select item_id, product_name, price, stock_quantity from products",
            function(err, res) {

                // Check for error
                if (err) throw(err);
    
                // Run the callback function
                cb(res);
            }
        );
    },
    
    // Function to get the item quantity
    getItemQuantity : function(item_Id, quantityNeeded, cb) {
        var query = connection.query(
          "select price, product_sales, stock_quantity from products WHERE ?",
          [
            {
                item_id: item_Id
            }
          ],
          function(err, res) {

            // Check for error
            if (err) {
                 throw(err);
            }

            // Run the callback function
            cb(item_Id, quantityNeeded, res);
          }
        );
    },
    
    // Function to update an item
    updateItem : function(item_ID, totalCost, totalSales, newQuantity, cb) {
        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
                product_sales: totalSales,
                stock_quantity: newQuantity
            },
            {
                item_id: item_ID
            }
          ],
          function(err, res) {

            // Check for error
            if (err) {
                 throw(err);
            }

            // Run the callback function
            cb(totalCost);
          }
        );
    },
    
    // Function to get the item quantity
    getLowInventoryItems : function(cb) {
        var query = connection.query(          
          "select * from products where stock_quantity < 5",
          function(err, res) {

            // Check for error
            if (err) {
                 throw(err);
            }

            // Run the callback function
            cb(res);
          }
        );
    },
    
    // Function to get the current inventory list
    getInventoryList : function(cb) {
        var query = connection.query(          
          "select item_id, product_name, stock_quantity from products",
          function(err, res) {

            // Check for error
            if (err) {
                 throw(err);
            }

            // Run the callback function
            cb(res);
          }
        );
    },
    
    // Function to update a products inventory
    updateProductInventory : function(item_ID, newQuantity, cb) {

        var sqlQuery = "UPDATE products as p,                      \
        (                                                          \
            SELECT item_id, stock_quantity as sq                   \
            FROM products                                          \
            WHERE item_id = ?                                      \
        ) as t                                                     \
        SET stock_quantity = sq + ? WHERE t.item_id = p.item_id;"

        var query = connection.query(sqlQuery,
          [
            item_ID, 
            newQuantity
          ],
          function(err, res) {

            // Check for error
            if (err) {
                 throw(err);
            }

            // Run the callback function
            cb(res);
          }
        );
    }

};

// Export Bamazon SQL Object
module.exports = bamazonSQL;

/*
UPDATE products as t, 
(
    SELECT item_id, stock_quantity as sq
    FROM products 
    WHERE item_id = '1'
) as temp
SET stock_quantity = sq + '5' WHERE temp.item_id = t.item_id;
*/