
function lowQOH() {
    
        var query = "SELECT products.item_id, products.product_name, departments.department_name, products.price, products.stock_quantity FROM products JOIN departments ON (products.department_id = departments.department_id) Where products.stock_quantity < 10 ";
    
      connection.query(query, function(error, response) {
        if (error) throw error;

        for (var i = 0; i < response.length; i++) {

          console.log("Product ID: " + response[i].item_id + " || Product Name: " + response[i].product_name + " || Department: " + response[i].department_name + " || Price: " + response[i].price + " || Current Quantity: " + response[i].stock_quantity );
        }
        addInv()
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
              "INSERT INTO products SET ?",
              [
              {
                product_name: answer.product_name,
                department_id: answer.department_id,
                price: answer.price,
                stock_quantity: answer.QOH
              }
              ],
              function(error) {
                if (error) throw error;
                console.log("Error Occurred, Try Again");
                runMenu();
              }
           );
         }

           ) }
