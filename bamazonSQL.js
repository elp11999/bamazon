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

        // SQL query to get items for sale
        var sqlQuery = "select item_id,         \
                               product_name,    \
                               price,           \
                               department_name, \
                               stock_quantity   \
                          from products";

        var query = connection.query(sqlQuery,
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

        // SQL query to get the item quantity
        var sqlQuery = "select price,         \
                               product_sales, \
                               stock_quantity \
                          from products WHERE ?";

        var query = connection.query(sqlQuery,
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

        // SQL query to update and sales item
        var sqlQuery = "UPDATE products SET ? WHERE ?";

        var query = connection.query(sqlQuery,
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

        // SQL query to get low inventory items
        var sqlQuery = "select * from products \
                           where stock_quantity < 5";

        var query = connection.query(sqlQuery,
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

        // SQL query to get current inventory list
        var sqlQuery =  "select item_id,       \
                                product_name,  \
                                stock_quantity \
                            from products";

        var query = connection.query(sqlQuery,
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
    },
    
    // Function to get the current department list
    getDepartmentList : function(cb) {

        // SQL query to get all departments
        var sqlQuery = "select department_name from departments";

        var query = connection.query(sqlQuery,
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

    // Function to add a new product
    addNewProduct : function(productInfo, cb) {

      // SQL to add a new product
      var sqlQuery = "insert into products          \
                                  (product_name,    \
                                   department_name, \
                                   price,           \
                                   stock_quantity)  \
                          values(?, ?, ?, ?)";

      // Create new product
      var query = connection.query(sqlQuery,
          [
              productInfo.product_name, 
              productInfo.department_name, 
              productInfo.price, 
              productInfo.stock_quantity
          ],
          function(err, res) {

              // Check for error
              if (err) throw err;
      
              // Run the callback function
              cb(productInfo, res);
          }
        );
    },

    // Function to get sales by departement
    getSalesByDepartment : function(cb) {

      // Create SQL query to get the sales information
      var sqlQuery = "select departments.department_id,   \
                             departments.department_name, \
                             departments.over_head_costs, \
                          sum(products.product_sales) as product_sales, \
                          (sum(products.product_sales) - departments.over_head_costs) as total_profit \
                      from departments       \
                          left join products \
                              on departments.department_name = products.department_name \
                          group by departments.department_id;"
  
      // Get sales by department

      // Get sales information for all departments
      var query = connection.query(sqlQuery,
        function(err, res) {

          // Check for error
          if (err) throw err;

          // Run the callback function
          cb(res);
        }
      );
    },

    // Function to add new departement
    addNewDepartment : function(departmentInfo, cb) {

      // SQL query to add new department
      var sqlQuery = "insert into departments       \
                                  (department_name, \
                                  over_head_costs)  \
                        values(?, ?)";

      // Create new product
      var query = connection.query(sqlQuery,
          [
            departmentInfo.department_name, 
            departmentInfo.over_head_costs
          ],
          function(err, res) {

            // Check for error
            if (err) throw err;
  
            // Run the callback function
            cb(departmentInfo);
          }
        );
    },
  };

// Export Bamazon SQL Object
module.exports = bamazonSQL;