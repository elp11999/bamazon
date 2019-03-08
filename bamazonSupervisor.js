//
// Project Bamazon
// Amazon-like storefront NodeJS application using MySQL.
//
// bamazonSupervisor.js - Supervisor View of the Bamzon storefront 
//                        This application will allow a supervisor to:
//                          * View sales by department
//                          * Create a new department
//

// Load DotEnv library
require("dotenv").config();

// Load Console table library
var cTable = require('console.table');

// Load inquirer npm package
var inquirer = require("inquirer");

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

// Function to get sales by department
var getSalesByDepartment = () => {
    bamazonSQL.getSalesByDepartment(getSalesByDepartmentResponse);
}

// Function to display sales by department
var getSalesByDepartmentResponse = (res, err) => {
    
    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptSupervisor();
        return;
    } 
      
    // Display department sales
    console.log("\r")  
    console.table(res); 

    // Prompt manager for more work
    promptSupervisor();

}

// Function to add new department
var addNewDepartment = (departmentInfo) => {
    bamazonSQL.addNewDepartment(departmentInfo, addNewDepartmentResponse);
}

// Function to display sales by department
var addNewDepartmentResponse = (departmentInfo, err) => {
    
    // Check for error
    if (err)  {
        console.log("\nSQL Error: " + err.sqlMessage + ". Error code=" + err.code  + "\n");
    
        // Prompt manager for more work
        promptSupervisor();
        return;
    } 

    // Update successful
    console.log("\nNew department " + departmentInfo.department_name + " has been successfully added.\n");

    // Prompt manager for more work
    promptSupervisor();

}

// Function to prompt supervisor for a new deparment
var promptForNewDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: "What is the department name?",
            validate: function(value) {
                var valid = (value.length > 0);
                return valid || "Please enter a value";
            }
        },
        {
            type: 'input',
            name: 'over_head_costs',
            message: "What is the overhead cost?",
            validate: function(value) {
                return checkIfNumericValue(value);
            },
            filter: Number
        }
    ]).then((answers) => {

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
                getSalesByDepartment();
                break;
            case "Create a new department.":
                promptForNewDepartment();
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

// Connect to MySql databasepromptSupervisor
bamazonSQL.connect(connectResponse); 

// Connect response function
function connectResponse(err) {

    // Check for error
    if (err) { 
        console.log("Error: Connection to " + process.env.MYSQL_HOSTNAME + " port " + process.env.MYSQL_PORT + " failed. Error code=" + err.code);
        return;
    }

    // Prompt Supervisor for work to do
    promptSupervisor();
}; 