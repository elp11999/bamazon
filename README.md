# Bamazon Store
Amazon-like storefront NodeJS application using MySQL

* This project is a NodeJS based application. The Project consists of 3 Node JS applications:
  * bamazonCustomer.js
    * This application is the customer interface which allows them to purchase items from the Bamazon store.
  * bamazonManager.js
    * This application is the manager interface which allows them to:
      * View all products for sale
      * View low inventory products
      * Increase inventory levels
      * Add a new product
  * bamazonSupervisor.js
    * This application is the supervisor interface which allows them to:
      * View sales by department
      * Create a new department
* This project was a perfect way for me to get introduced to NodeJS using MySql.
* This project uses the following NPM packages:
  * MySql
  * DotEnv
  * Console Table
  * Inquirer
  * Sprintf

* Example of running the bamazonCustomer application:
  * Command line: node bamazonCustomer.js
     * Initial screen at startup:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/CusomerView1.png)
     * Purchase and item:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/CusomerView2.png)
     * Purchase an out of stock item:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/CusomerView3.png)

* If you decide to clone this repository and check it out, please follow these instructions:
  * Make sure you have NodeJS installed.
    * https://nodejs.org/en/download/
  * Run npm install to setup the dependecies.
  * Instaall MySql.
  * Import the database schema file schema.sql to the MySql database.
  * Create file .env and enter the MySql database configuration:
    * MYSQL_HOSTNAME={host-name}
    * MYSQL_USER={user-name}
    * MYSQL_PASSWORD={password}

* If you have any questions about the project, please contact me at mhenderson557@yahoo.com
* Enjoy :) 

