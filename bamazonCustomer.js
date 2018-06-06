var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "R00tR00t",
  database: "bamazon"
});

connection.connect(function(error) {
  if (error) throw error;
  runMenu();
});

function runMenu() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "How may we assist you today?",
      choices: [
        "Display products",
        "Buy product"
        ]
    })

    .then(function(answer) {
      switch (answer.action) {
      case "Display products":
        displayProducts();
        break;

      case "Buy product":
        buyProduct();
        break;

      }
    });
}

function displayProducts() {
    inquirer
    .then (function(answer){

        var query = "SELECT products.item_id, products.product_name, departments.department_name, products.price, products.stock_quantity FROM products JOIN departments ON (products.department_id = departments.department_id) ";
    
      connection.query(query, function(error, response) {
        if (error) throw error;

        for (var i = 0; i < response.length; i++) {

          console.log("Product ID: " + response[i].item_id + " || Product Name: " + response[i].product_name + " || Department: " + response[i].department_name + " || Price: " + response[i].price + " || Current Quantity: " + response[i].stock_quantity );
        }
        buyProduct();
      });
  
});
}


function buyProduct() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Enter product ID: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "qnty",
        type: "input",
        message: "Enter desired quantity: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
        var prodQnty;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id === answer.id) {
            prodQnty = results[i];
          }
        }

        if (prodQnty.qnty < parseInt(answer.stock_quantity)) {

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: (stock_quantity - prodQnty.qnty)
              },
              {
                item_id: prodQnty.id
              }
            ],
            function(error) {
              if (error) throw error;
              console.log("Your order total is: " + (prodQnty * answer.price) );
              console.log("Your Order Is Complete");
              console.log("We appreacite your order and hope you enjoy your product. Please vist us again soon.");
              
              runMenu();
            }
          );
        }
        else {

          console.log("Our sincere apologies. We do not have enough stock at this time to fulfill your request. Please select a smaller order quantity.");
          runMenu();
        }
    
      });
    
    }


