//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonManager.js - Manager View of the Bamzon storefront 
//                     This application will allow a manager to:
//                       * View all Products for Sale
//                       * View Low Inventory (A product invventory count < 5)
//                       * Add to Inventory (Update inventory count for a product)
//                       * Add New Product to inventory
//

// Load Console table library
var cTable = require('console.table');

// Load inquirer npm package
var inquirer = require("inquirer");

// Load MySql library
var mySql = require("mysql");

// Create MySql connection object
var connection = mySql.createConnection(
    {
        host     : 'localhost',
        user     : 'root',
        password : 'elp1elp1',
        database : 'bamazon'
    }
);

// Function to view all products
var viewAllProducts = () => {
    var query = connection.query("select * from products",
        function(err, res) {
            var itemDetail = "";
            if (err) throw err;
            console.log("\r");
            
            // Log product list
            console.table(res); 

            // Prompt manager for more work
            promptManager();
        }
    );
};

// Function to view all products
var viewLowInventory = () => {
    var query = connection.query(
      "select * from products where stock_quantity < 5",
      function(err, res) {
        if (err) throw err;
        console.log("\r");
        
        // Log low inventory results
        if (res.length > 0 )            
            console.table(res); 
        else
            console.log("No items have an inventory level less than 5.")
        console.log("\r");

        // Prompt manager for more work
        promptManager();
      }
    );

};

// Update database inventory information
var UpdateInventory = (item_ID, newQuantity) => {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuantity
            },
            {
                item_id: item_ID
            }
        ],
        function(err, res) {
            if (err) throw err;

            // Update successful
            console.log("\nItem id: " + item_ID + " inventory has been successfully updated to " + newQuantity + ".\n");

            // Prompt manager for more work
            promptManager();
        }
    );
};

// Function to add to inventory
var addToInventory = (item_ID, newQuantity) => {

    // Get current count for the item
    var query = connection.query(
        "select stock_quantity from products WHERE ?",
        {
            item_id: item_ID
        },
        function(err, res) {
          var newCount = 0;
          if (err) throw err;
          //console.log(res);

          // Calculate new inventory count
          newCount = parseInt(newQuantity) + res[0].stock_quantity;

          // Update inventory
          UpdateInventory(item_ID, newCount);
        }
      );
};

// Function to add a new product
var addNewProduct = (itemInfo) => {
    console.log(itemInfo);

    // Create new product
    var query = connection.query(
        "insert into products (product_name, department_name, price, stock_quantity) values(?, ?, ?, ?) ",
        [
            itemInfo.product_name, 
            itemInfo.department_name, 
            itemInfo.price, 
            itemInfo.stock_quantity
        ],
        function(err, res) {
            var newCount = 0;
            if (err) throw err;
            //console.log(res);

            // Update successful
            console.log("\nNew item " + itemInfo.product_name + " has been successfully added.\n");

            // Prompt manager for more work
            promptManager();
        }
      );

};

// Function to prompt manager for new inventory update
var promptForNewInventoryCount = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_ID',
            message: "What item id would you like to update?",
            validate: function(value) {
              inputValue = parseFloat(value);
              var valid = !isNaN(inputValue);
              if (!valid)
                return 'Please enter a number.';
              if (inputValue <= 0) 
                return 'Please enter a number greater than 0.';
              return true;
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'newCount',
            message: "How much to add to the inventory count?",
            validate: function(value) {
              inputValue = parseFloat(value);
              var valid = !isNaN(inputValue);
              if (!valid)
                return 'Please enter a number.';
              if (inputValue <= 0) 
                return 'Please enter a number greater than 0.';
              return true;
            },
            filter: Number
        }
    ]).then((answers) => {
        //console.log(answers);

        // Add to inventory count
        addToInventory(answers.item_ID, answers.newCount);
    });
};

// Function to prompt manager for a new product
var promptForNewProduct = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: "What is the product name?"
        },
        {
            type: 'input',
            name: 'department_name',
            message: "What is the department name?"
        },
        {
            type: 'input',
            name: 'price',
            message: "What is the price?",
            validate: function(value) {
              inputValue = parseFloat(value);
              var valid = !isNaN(inputValue);
              if (!valid)
                return 'Please enter a number.';
              if (inputValue <= 0) 
                return 'Please enter a number greater than 0.';
              return true;
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: "What is the inventory count?",
            validate: function(value) {
              inputValue = parseFloat(value);
              var valid = !isNaN(inputValue);
              if (!valid)
                return 'Please enter a number.';
              if (inputValue <= 0) 
                return 'Please enter a number greater than 0.';
              return true;
            },
            filter: Number
        }
    ]).then((answers) => {
        //console.log(answers);
        // Add new product
        addNewProduct(answers);
    });
};

// Prompt Manager for work to do
function promptManager() {    
    inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Choose your selection.',
        choices: ['View products for sale.', 'View low inventory items.', 'Add to item inventory.', 'Add new product.', 'EXIT'],
    }]).then((answers) => {
        switch (answers.action) {
            case "View products for sale.":
                viewAllProducts();
                break;
            case "View low inventory items.":
                viewLowInventory();
                break;
            case "Add to item inventory.":
                promptForNewInventoryCount();
                break;
            case "Add new product.":
                promptForNewProduct();
                break;
            case "EXIT":            
                console.log("\r");
                console.log("Goodbye... Come back soon!!!");
                connection.end();
                return;
            default:
                promptManager();
        }
  });
};

// Display startup message
console.log("Welcome to Bamazon!!!\n");

// Connect to MySql database
connection.connect(function(err) {
    // Check for error
    if (err) throw(err);

    // Prompt Manager with questions
    promptManager();
});

/*
select department_name from products;

use bamazon;
select department_name
from departments
inner join
products
on departments.department_name = products.department_name;

select distinct top5000.artist
    from top5000
    inner join top3000
        on top5000.year = top3000.year;

*/

