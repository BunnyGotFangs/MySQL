-- creation of the database
-- ensuring that if the DB exisit that first we clear the environment
drop database if exists bamazon;

-- initialization of the DB
create database bamazon;


-- use the DB, in order to create table structures
use bamazon;

-- creation of the departments table
create table departments (
department_id INT (5) auto_increment not null,
department_name varchar(250) not null,
over_head_costs decimal(10,2) null,
primary key(department_id)
);


 -- creation fo the products table, using ID from deperatment
create table products (
item_id INT (5) auto_increment not null,
product_name varchar(250) not null,
department_id INT not null,
price decimal(10,2) null,
stock_quantity decimal(10,2) null,
primary key(item_id)
);


-- insert into departments if needed
use bamazon;
insert into departments (department_name, over_head_costs) values ("Grooming", 50.00);

-- insert into products if needed
use bamazon;
INSERT INTO `bamazon`.`products` (`item_id`, `product_name`, `department_id`, `price`, `stock_quantity`) VALUES ('101', 'Stickers', '5', '4.95', '45')	1366: Incorrect integer value: '' for column 'item_id' at row 1	
