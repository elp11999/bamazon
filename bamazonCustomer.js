//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonCustom.js - Displays all of the items available for sale. 
//                    Prompts user for what items to buy.
//                    Updates inventory as purchases are made.
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

// Update items inventory
function updateItem(item_ID, totalCost, totalSales, newQuantity) {
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
        if (err) throw err;

        // Purchase was successful
        console.log("\nCongratulations!!! Your purchase was successful.");
        console.log("The total price is $" + totalCost);
        console.log("We hope you will be very happy with your new product.");
        console.log("Thank you for shopping Bamazon.\n");
           
        // Prompt user to continue shopping
        promptUserToContinueShopping();
      }
    );
};

// Function to purchase item
var purchaseItem = (item_Id, quantity) => {
    var query = connection.query(
      "select * from products WHERE ?",
      [
        {
            item_id: item_Id
        }
      ],
      function(err, res) {
        if (err) throw err;
        //console.log(res);

        // Check if current inventory will fill the user's request
        if (quantity > parseInt(res[0].stock_quantity)) {
            console.log("\nWe are sorry, their are not enough items at this time to fill your request.\n");
            
            // Prompt user to continue shopping
            promptUserToContinueShopping();
        } else {
            // Update item with new quantity and product sales
            updateItem(item_Id,
                      (parseFloat(res[0].price) * quantity),
                      (parseFloat(res[0].product_sales + (parseFloat(res[0].price) * quantity))), 
                      (parseInt(res[0].stock_quantity - quantity)));
        }
      }
    );
}

// Function display all item in the store for sale
var displayItemsForSale = () => {
    var query = connection.query("select item_id, product_name, price from products",
        function(err, res) {
            var itemDetail = "";
            if (err) throw err;
            console.log("\n---"); 
            console.log("--- Below are the Bamazon items for sale");
            console.log("---"); 
            console.table(res); 
            console.log("\r");

            // Prompt user to purchase items
            promptUserToPurchaseItems();
        }
    );
};

// Function to prompt user to continue shopping
var promptUserToContinueShopping = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: "Would you like to contine shopping?"
        }
    ]).then((answers) => {
        //console.log(answers);

        // Check if user wants to continue shopping
        if (answers.confirm) {
            console.clear();
            displayItemsForSale();
        }
        else {
            console.log("\nGoodbye!!! Please come back and shop with us again soon.");
            connection.end();
        }

    });
};

// Function to prompt user to purchase an item
var promptUserToPurchaseItems = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_ID',
            message: "What item id would you like to purchase?",
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
        purchaseItem(answers.item_ID, parseInt(answers.quantity));
    });
};

// Start application
console.log("Welcome to Bamazon!!!");

// Display all items for sale
displayItemsForSale();