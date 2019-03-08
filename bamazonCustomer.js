//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonCustom.js - Displays all of the items available for sale. 
//                    Prompts user for what items to buy.
//                    Updates inventory and prodcut sales as purchases are made.
//

// Load DotEnv library
require("dotenv").config();

// Load inquirer npm package
var inquirer = require("inquirer");

// Load sprintf-js library
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

// Load Bamazon SQL library
var bamazonSQL = require("./bamazonSQL.js");

// Array to hold items available to purchase
var itemChoices = [];

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

// Function to purchase item
var updateItem = (item_ID, totalCost, totalSales, newQuantity) => {
  bamazonSQL.updateItem(item_ID, totalCost, totalSales, newQuantity, updateItemResponse);
}

// Function to display purchase results
function updateItemResponse(totalCost, err) {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
        
        // Prompt user to continue shopping
        promptUserToContinueShopping();
        return;
    } 

    // Purchase was successful
    console.log("\nCongratulations!!! Your purchase was successful.");
    console.log("The total price is $" + totalCost);
    console.log("We hope you will be very happy with your new product.");
    console.log("Thank you for shopping Bamazon.\n");
        
    // Prompt user to continue shopping
    promptUserToContinueShopping();
};

// Function to get item quantity
var getItemQuantity = (item_Id, quantityNeeded) => {
    bamazonSQL.getItemQuantity(item_Id, quantityNeeded, getItemQuantityResponse);
}

// Function to check item quantity
var getItemQuantityResponse = (item_Id, quantityNeeded, res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
        
        // Prompt user to continue shopping
        promptUserToContinueShopping();
        return;
    }

    // Check if current inventory will fill the user's request
    if (quantityNeeded > parseInt(res[0].stock_quantity)) {
        console.log("\nWe are sorry, their are not enough items at this time to fill your request.\n");

        // Prompt user to continue shopping
        promptUserToContinueShopping();
    } else {
        // Purchase item
        updateItem(item_Id,
        (parseFloat(res[0].price) * quantityNeeded),
        (parseFloat(res[0].product_sales + (parseFloat(res[0].price) * quantityNeeded))), 
        (parseInt(res[0].stock_quantity - quantityNeeded)));
    }
}

// Function to get all items for sale
var getItemsForSale = () => {
  bamazonSQL.getItemsForSale(getItemsForSaleResponse);
}

// Function save all items for sale
var getItemsForSaleResponse = (res, err) => {

    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
        
        // Prompt user to continue shopping
        promptUserToContinueShopping();
        return;
    }

    // Create list of all products for sale
    console.log("\r");
    itemChoices = [];
    for (var i = 0; i < res.length; i++) {
        var status = (parseInt(res[i].stock_quantity) > 0) ? "In Stock" : "Out of Stock**";
        itemChoices.push(sprintf('%-3d %-50s %-10.2f %s', res[i].item_id, res[i].product_name, res[i].price, status));
    }

    // Prompt user to purchase items
    promptUserToPurchaseItems(itemChoices);
};

// Function to prompt user to continue shopping
var promptUserToContinueShopping = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: "Would you like to continue shopping?"
        }
    ]).then((answers) => {

        // Check if user wants to continue shopping
        if (answers.confirm) {
            //console.clear();
            getItemsForSale();
        }
        else {
            console.log("\nGoodbye!!! Please come back and shop with us again soon.");
            
            // Disconnect from MySql
            bamazonSQL.disconnect(); 
        }
    });
};

// Function to prompt user to purchase an item
var promptUserToPurchaseItems = (itemChoices) => {

    // Display welcome message
    console.log("Welcome to Bamazon!!!\n");

    inquirer.prompt([
        {
            type: 'list',
            name: 'item',
            message: "What item id would you like to purchase?",
            choices: itemChoices
        },
        {
            type: 'input',
            name: 'quantity',
            message: "How many would you like to purchase?",
            validate: function(value) {
                return checkIfNumericValue(value);
            },
            filter: Number
        }
    ]).then((answers) => {

        // Get the item_id
        var item_id = answers.item.substring(0, answers.item.indexOf(" "));

        // Purchase the item
        // First get current item quantity
        getItemQuantity(item_id, parseInt(answers.quantity));
    });
};

// Connect to MySql database
bamazonSQL.connect(connectResponse);

// Connect response function
function connectResponse(err) {

    // Check for error
    if (err) { 
        console.log("Error: Connection to " + process.env.MYSQL_HOSTNAME + " port " + process.env.MYSQL_PORT + " failed. Error code=" + err.code);
        return;
    }

    // Get the items for sale
    getItemsForSale();
};
