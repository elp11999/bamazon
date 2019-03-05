//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonCustom.js - Displays all of the items available for sale. 
//                    Prompts user for what items to buy.
//                    Updates inventory as purchases are made.
//

// Load inquirer npm package
var inquirer = require("inquirer");

// Load sprintf-js library
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

// Load Bamazon SQL library
var bamazonSQL = require("./bamazonSQL.js");

// Array to hold items available to purchase
var itemChoices = [];

// Function to purchase item
var purchaseItem = (item_ID, totalCost, totalSales, newQuantity) => {
  bamazonSQL.updateItem(item_ID, totalCost, totalSales, newQuantity, displayPurchaseResults);
}

// Function to display purchase results
function displayPurchaseResults(totalCost) {

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
  bamazonSQL.getItemQuantity(item_Id, quantityNeeded, checkItemQuantity);
}

// Function to check item quantity
var checkItemQuantity = (item_Id, quantityNeeded, res) => {

  // Check if current inventory will fill the user's request
  if (quantityNeeded > parseInt(res[0].stock_quantity)) {
      console.log("\nWe are sorry, their are not enough items at this time to fill your request.\n");
      
      // Prompt user to continue shopping
      promptUserToContinueShopping();
  } else {
      // Purchase item
      purchaseItem(item_Id,
         (parseFloat(res[0].price) * quantityNeeded),
         (parseFloat(res[0].product_sales + (parseFloat(res[0].price) * quantityNeeded))), 
         (parseInt(res[0].stock_quantity - quantityNeeded)));
  }
}

// Function to get all items for sale
var getItemsForSale = () => {
  bamazonSQL.getItemsForSale(saveItemsForSale);
}

// Function save all items for sale
var saveItemsForSale = (res) => {

    // Create list of all products for sale
    console.log("\r");
    itemChoices = [];
    for (var i = 0; i < res.length; i++) {
      if (parseInt(res[i].stock_quantity) > 0) 
        itemChoices.push(sprintf('%-3d %-50s %.2f', res[i].item_id, res[i].product_name, res[i].price));
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
            console.clear();
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

        // Get the item_id
        var item_id = answers.item.substring(0, answers.item.indexOf(" "));

        // Get item quantity
        getItemQuantity(item_id, parseInt(answers.quantity));
    });
};

// Connect to MySql database
bamazonSQL.connect(getItemsForSale); 
