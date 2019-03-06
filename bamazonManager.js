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

// Load DotEnv library
require("dotenv").config();

// Load Console table library
var cTable = require('console.table');

// Load inquirer npm package
var inquirer = require("inquirer");

// Load sprintf-js library
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

// Load Bamazon SQL library
var bamazonSQL = require("./bamazonSQL.js");

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

// Current product inventory list
var currentInventory = [];

// Function to get all items for sale
var getItemsForSale = () => {
    bamazonSQL.getItemsForSale(displayItemsForSale);
}

// Display all items for sale
var displayItemsForSale = (res) => {
            
    // Display product list
    console.table(res); 

    // Prompt manager for more work
    promptManager();
};

// Function to get all items which have an inventory less than 5
var getLowInventoryItems = () => {
    bamazonSQL.getLowInventoryItems(displayLowInventoryItems);
}

// Display low inventory items
var displayLowInventoryItems = (res) => {
        
    // Log low inventory results
    if (res.length > 0 )            
        console.table(res); 
    else
        console.log("No items have an inventory level less than 5.");
    console.log("\r");

    // Prompt manager for more work
    promptManager();
};

// Function to get all items which have an inventory less than 5
var getInventorylist = () => {
    bamazonSQL.getInventoryList(buildInventoryList);
}

// Function to build inventory list
var buildInventoryList = (res) => {

    // Set current product inventory list
    currentInventory = res;

    // Create choices to update inventory
    choices = [];
    for (var i = 0; i < res.length; i++)
      choices.push(sprintf('%-3d %-50s Quantity: %d', res[i].item_id, res[i].product_name, res[i].stock_quantity));

    // Prompt manager for new inventory count            
    promptForNewInventoryCount(choices);
};

// Function to update a products inventory
var updateProductInventory = (item_ID, newQuantity) => {
    bamazonSQL.updateProductInventory(item_ID, newQuantity, displayProductInventoryResult);
}

// Function to display updated inventory result
var displayProductInventoryResult = (res) => {
    
    // Update successful
    //console.log("\nItem id: " + item_ID + " inventory has been successfully updated to " + newQuantity + ".\n");
    console.log("\nInventory has been successfully updated.\n");

    // Prompt manager for more work
    promptManager();
}

//////////////////////////////////////////////////////////////////////////

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

// Function to view all products for inventory
var viewAllProductsForInventory = () => {
    var query = connection.query("select item_id, product_name, stock_quantity from products",
        function(err, res) {
            var itemDetail = "";
            if (err) throw err;

            // Create choices to update inventory
            choices = [];
            for (var i = 0; i < res.length; i++)
              choices.push(sprintf('%-3d %-50s Quantity: %d', res[i].item_id, res[i].product_name, res[i].stock_quantity));

            // Prompt manager for new inventory count            
            promptForNewInventoryCount(choices);
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
var promptForNewInventoryCount = (choices) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'item',
            message: "What item id would you like to update?",
            choices : choices
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

        // Get the item_id
        var item_id = answers.item.substring(0, answers.item.indexOf(" "));

        // Update inventory count
        updateProductInventory(item_id, answers.newCount);
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
                getItemsForSale();
                break;
            case "View low inventory items.":
                viewLowInventory();
                break;
            case "Add to item inventory.":
                getInventorylist();
                break;
            case "Add new product.":
                promptForNewProduct();
                break;
            case "EXIT":            
                console.log("\r");
                console.log("Goodbye... Come back soon!!!");

                // Disconnect from MySql
                bamazonSQL.disconnect(); 
                return;
            default:
                promptManager();
        }
  });
};

// Display startup message
console.log("Welcome to Bamazon!!!\n");

// Connect to MySql database
bamazonSQL.connect(promptManager); 

/*
// Connect to MySql database
connection.connect(function(err) {
    // Check for error
    if (err) throw(err);

    // Prompt Manager with questions
    promptManager();
});
*/

