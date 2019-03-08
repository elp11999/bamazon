//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonManager.js - Manager View of the Bamzon storefront 
//                     This application will allow a manager to:
//                       * View all products for sale
//                       * View low inventory (A product's inventory count < 5)
//                       * Add to inventory (Update inventory count for a product)
//                       * Add a new product to an existing department
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

// Function to check for a numeric value
var checkIfNumericValue = (value) => {

    var inputValue = parseFloat(value);

    var valid = !isNaN(inputValue);
    if (!valid)
        return 'Please enter a number.';
    if (inputValue <= 0) 
        return 'Please enter a number greater than 0.';
    return true;
};

// Function to get all items for sale
var getItemsForSale = () => {
    bamazonSQL.getItemsForSale(getItemsForSaleResponse);
}

// Display all items for sale
var getItemsForSaleResponse = (res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptManager();
        return;
    } 
            
    // Display product list
    console.table(res); 

    // Prompt manager for more work
    promptManager();
};

// Function to get all items which have an inventory less than 5
var getLowInventoryItems = () => {
    bamazonSQL.getLowInventoryItems(getLowInventoryItemsResponse);
}

// Display low inventory items
var getLowInventoryItemsResponse = (res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptManager();
        return;
    } 
        
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
    bamazonSQL.getInventoryList(getInventorylistResponse);
}

// Function to build inventory list
var getInventorylistResponse = (res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptManager();
        return;
    } 

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
    bamazonSQL.updateProductInventory(item_ID, newQuantity, updateProductInventoryResponse);
}

// Function to display updated inventory result
var updateProductInventoryResponse = (res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptManager();
        return;
    } 
    
    // Update successful
    console.log("\nInventory has been successfully updated.\n");

    // Prompt manager for more work
    promptManager();
}

// Function to get all departments
var getDepartmentlist = () => {
    bamazonSQL.getDepartmentList(getDepartmentlistResponse);
}

// Function to create department list
var getDepartmentlistResponse = (res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptManager();
        return;
    } 

    // Create department choices
    choices = [];
    for (var i = 0; i < res.length; i++)
        choices.push(sprintf('%-50s', res[i].department_name));

    // Prompt Manager to create a new product            
    promptForNewProduct(choices);
};

// Function to add a new product
var addNewProduct = (productInfo) => {
    bamazonSQL.addNewProduct(productInfo, addNewProductResult);
}

// Function to display add product result
var addNewProductResult = (productInfo, res, err) => {
    
    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptManager();
        return;
    } 

    // Update successful
    console.log("\nNew item " + productInfo.product_name + " has been successfully added.\n");

    // Prompt manager for more work
    promptManager();
}

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
              return checkIfNumericValue(value);
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
var promptForNewProduct = (choices) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'department_name',
            message: "What is the department name?",
            choices : choices
        },
        {
            type: 'input',
            name: 'product_name',
            message: "What is the product name?",
            validate: function(value) {
                var valid = (value.length > 0);
                return valid || "Please enter a value";
            }
        },
        {
            type: 'input',
            name: 'price',
            message: "What is the price?",
            validate: function(value) {
                return checkIfNumericValue(value);
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: "What is the inventory count?",
            validate: function(value) {
                return checkIfNumericValue(value);
            },
            filter: Number
        }
    ]).then((answers) => {

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

                // Get all items for for sale
                getItemsForSale();
                break;
            case "View low inventory items.":

                // Get low inventory items
                getLowInventoryItems();
                break;
            case "Add to item inventory.":

                // Increase inventory level
                // First get the inventory list
                getInventorylist();
                break;
            case "Add new product.":

                // Add a new product
                // First get list of all departments
                getDepartmentlist();
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
bamazonSQL.connect(connectResponse);

// Connect response function
function connectResponse(err) {

    // Check for error
    if (err) { 
        console.log("Error: Connection to " + process.env.MYSQL_HOSTNAME + " port " + process.env.MYSQL_PORT + " failed. Error code=" + err.code);
        return;
    }

    // Prompt Manager for work to do
    promptManager();
}; 