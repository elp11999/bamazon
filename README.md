# Bamazon Store
Amazon-like storefront NodeJS application using MySQL

* The Project consists of 3 Node JS applications:
  * bamazonCustomer.js
    * This application is the customer interface which allows them to:
      * Purchase items from the Bamazon store.
  * bamazonManager.js
    * This application is the manager interface which allows them to:
      * View all products for sale.
      * View low inventory products.
      * Increase inventory levels.
      * Add a new product.
  * bamazonSupervisor.js
    * This application is the supervisor interface which allows them to:
      * View sales by department.
      * Create a new department.
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
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/CustomerView1.png)
     * Purchase and item:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/CustomerView2.png)
     * Purchase an out of stock item:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/CustomerView3.png)

* Example of running the bamazonManager application:
  * Command line: node bamazonManager.js
     * Initial screen at startup:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView1.png)
     * View all products for sale:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView2.png)
     * View products with an inventory total less than 5:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView3.png)
     * Add items to the inventory of a product: 
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView4.png)
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView5.png)
     * Display all items for sale to check the new inventory level for item_id 3
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView6.png)
     * Add a new product:
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView7.png)
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView8.png)
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView9.png)
     * Display all items for sale to check the new item for sale (Item_id: 13):
       ![ScreenShot](https://raw.github.com/elp11999/bamazon/master/images/ManagerView10.png)

* If you decide to clone this repository and check it out, please follow these installation instructions:
  * Make sure you have NodeJS installed.
    * https://nodejs.org/en/download/
  * Run npm install to setup the dependecies.
  * Install MySql.
  * Import the database schema file schema.sql to the MySql database.
  * Create file .env and enter the MySql database configuration:
    * MYSQL_HOSTNAME={host-name}
    * MYSQL_USER={user-name}
    * MYSQL_PASSWORD={password}

* If you have any questions about the project, please contact me at mhenderson557@yahoo.com
* Enjoy :) 

      

