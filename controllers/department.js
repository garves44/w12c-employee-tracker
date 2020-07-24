// DEPENDENCIES IMPORTED INTO APP
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

require("dotenv").config();
const dbconfig = require("./../config/dbconfig");

var department = {
  displayAllDept: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    let departmentArray = [];
    connection.query(`SELECT name FROM department`, function (err, res) {
      //add to departmentArray
      for (i = 0; i < res.length; i++) {
        departmentArray.push(res[i].name);
      }

      //user selects department
      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Choose a department to search.",
          choices: departmentArray,
        })
        .then((answer) => {
          const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC;`;
          connection.query(query, (err, res) => {
            if (err) throw err;

            //display results via console.table
            console.table(res);
            //return to menu
            callback();
            connection.end();
          });
        });
    });
  },

  addDepartment: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    inquirer
      .prompt({
        name: "department",
        type: "input",
        message: "Enter a name for the new Department",
      })
      .then((answer) => {
        connection.query(
          `INSERT INTO department (name)
                VALUES ('${answer.department}');`,
          (err, res) => {
            if (err) throw err;
            console.log(`Adding ${answer.department}...`);
            //return to menu
            callback();
            connection.end();
          },
        );
      });
  },

  deleteDepartment: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    // creating usable array
    let departmentArray = [];

    //connection via promiseSQL
    mysql
      .createConnection(connectSettings)
      .then((conn) => {
        return conn.query(`SELECT id, name FROM department;`);
      })
      .then((dept) => {
        for (i = 0; i < dept.length; i++) {
          departmentArray.push(dept[i].name);
        }

        inquirer
          .prompt([
            {
              name: "delete",
              type: "confirm",
              message:
                "WARNING --- Deleting a department will remove all roles and employees within the department. Do you wish to continue?",
              default: false,
            },
          ])
          .then((answer) => {
            if (!answer.delete) {
              //return to menu
              callback();
              connection.end();
            }
          })
          .then(() => {
            inquirer
              .prompt([
                {
                  name: "department",
                  type: "list",
                  message: "Select a department to delete.",
                  choices: departmentArray,
                },
                {
                  name: "confirmDelete",
                  type: "input",
                  message: "Enter the department name you want to delete.",
                },
              ])
              .then((answer) => {
                if (answer.confirmDelete === answer.department) {
                  let departmentId;
                  for (i = 0; i < dept.length; i++) {
                    if (answer.department == dept[i].name) {
                      departmentId = dept[i].id;
                    }
                  }

                  //delete department
                  connection.query(
                    `DELETE FROM department WHERE id = ${departmentId};`,
                    (err, res) => {
                      if (err) throw err;

                      console.log(`${answer.department} is being deleted..`);
                      //return to menu
                      callback();
                      connection.end();
                    },
                  );
                }
              });
          });
      });
  },
};

module.exports = department;
