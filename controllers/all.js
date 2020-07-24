const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

require("dotenv").config();
const dbconfig = require("./../config/dbconfig");

var all = {
  displayAll: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    //display all employees
    let query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC;`;
    //query connection
    connection.query(query, function (err, res) {
      if (err) throw err;

      //display results via console.table
      console.table(res);

      //return to menu
      callback();
    });

    connection.end();
  },
};

module.exports = all;
