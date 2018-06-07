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
        "View all products",
        "View low QOH products",
        "Add inventory",
        "Add new product"
        ]
    })

    .then(function(answer) {
      switch (answer.action) {
      case "Display products":
        displayProducts();
        break;

      case "View low QOH products":
        lowQOH();
        break;

        case "Add inventory":
        addInv();
        break;

        case "Add new product":
        addProd();
        break; 
      }
    });
}

function displayProducts() {
    
        var query = "SELECT products.item_id, products.product_name, departments.department_name, products.price, products.stock_quantity FROM products JOIN departments ON (products.department_id = departments.department_id) ";
    
      connection.query(query, function(error, response) {
        if (error) throw error;

        for (var i = 0; i < response.length; i++) {

          console.log("Product ID: " + response[i].item_id + " || Product Name: " + response[i].product_name + " || Department: " + response[i].department_name + " || Price: " + response[i].price + " || Current Quantity: " + response[i].stock_quantity );
        }
        runMenu(response);
      });  
}

function lowQOH() {
    
        var query = "SELECT products.item_id, products.product_name, departments.department_name, products.price, products.stock_quantity FROM products JOIN departments ON (products.department_id = departments.department_id) Where products.stock_qunatity < 10 ";
    
      connection.query(query, function(error, response) {
        if (error) throw error;

        for (var i = 0; i < response.length; i++) {

          console.log("Product ID: " + response[i].item_id + " || Product Name: " + response[i].product_name + " || Department: " + response[i].department_name + " || Price: " + response[i].price + " || Current Quantity: " + response[i].stock_quantity );
        }
        runMenu(response);
      });
}

function addInv(results) {
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
        message: "Enter additional stock units: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {

        var stockItem;

        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id == answer.id) {
            stockItem = results[i];
          }
        }

        if(answer.qnty < 0) {

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: (stockItem.stock_quantity + answer.qnty)
              },
              {
                item_id: answer.id
              }
            ],
            function(error) {
              if (error) throw error;
              console.log("Your new QOH is: " +  stockItem.stock_quantity) ;
              
              runMenu();
            }
          );
        }
        else {

          console.log("You cannot add inventory at this time, we are doing a cycle count.");
          runMenu();
        }
    
      });
    
    }

    function addProd() {
        
        inquirer
          .prompt([
            {
              name: "product_name",
              type: "input",
              message: "Product Name"
            },
            {
              name: "department_id",
              type: "input",
              message: "Input department number (1=Grooming 2=Tack, 3=Cloths, 4=Treatment, 5=Accessory"
            },
            {
                name: "price",
                type: "input",
                message: "Input the selling price of the product (dd.cc)",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false; }
              },

              {
                name: "QOH",
                type: "input",
                message: "Input the starting quantity on hand (xx.xx)",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
              }
             }
            
          ])
          .then(function(answer) {
            
            connection.query(
              "INSERT INTO productss SET ?",
              {
                product_name: answer.product_name,
                department_id: answer.department_id,
                price: answer.price,
                stock_quantity: answer.QOH
              },
              function(err) {
                if (err) throw err;

                runMenu();
              }
            );
          });
      }   


