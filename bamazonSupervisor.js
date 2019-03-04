//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonSupervisor.js - Supervisor View of the Bamzon storefront 
//                        This application will allow a supervisor to:
//                          * View sales by department
//                          * Create a new department
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

// Function to view sales by department
var viewSalesByDepartement = () => {
    var query = connection.query("select departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) as product_sales, (sum(products.product_sales) - departments.over_head_costs) as total_profit from departments left join products on departments.department_name = products.department_name group by departments.department_id;",
        function(err, res) {
            var itemDetail = "";
            if (err) throw err;
            console.log("\r");
            
            // Log product list
            console.table(res); 

            // Prompt manager for more work
            promptSupervisor();
        }
    );
};

// Function to add a new department
var addNewDepartment = (itemInfo) => {

    // Create new product
    var query = connection.query(
        "insert into departments (department_name, over_head_costs) values(?, ?) ",
        [
            itemInfo.department_name, 
            itemInfo.over_head_costs
        ],
        function(err, res) {
            var newCount = 0;
            if (err) throw err;
            //console.log(res);

            // Update successful
            console.log("\nNew deparmtment " + itemInfo.department_name + " has been successfully added.\n");

            // Prompt manager for more work
            promptSupervisor();
        }
      );

};

// Function to prompt supervisor for a new deparment
var promptForNewDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: "What is the department name?"
        },
        {
            type: 'input',
            name: 'over_head_costs',
            message: "What is the overhead cost?",
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
        addNewDepartment(answers);
    });
};

// Prompt Supervisor for work to do
function promptSupervisor() {    
    inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Choose your selection.',
        choices: ['View sales by department.', 'Create a new department.', 'EXIT'],
    }]).then((answers) => {
        switch (answers.action) {
            case "View sales by department.":
                viewSalesByDepartement();
                break;
            case "Create a new department.":
                promptForNewDepartment();
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

    // Prompt Supeervisor with questions
    promptSupervisor();
});

