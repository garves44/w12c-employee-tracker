// DEPENDENCIES IMPORTED INTO APP
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

require("dotenv").config();
const dbconfig = require("./../config/dbconfig");

var employee = {
  displayAllManager: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    let managerArray = [];
    connection.query(
      `select concat(e2.first_name, ' ', e2.last_name) as manager from employee as e join employee as e2 on e.manager_id = e2.id ;`,
      function (err, res) {
        // add to managerArray
        for (i = 0; i < res.length; i++) {
          managerArray.push(res[i].manager);
        }
        inquirer
          .prompt({
            name: "manager",
            type: "list",
            message: "Choose a manager!",
            choices: managerArray,
          })
          .then((answer) => {
            console.log(answer);
            const query = `      
  select
      e.id as ID
      , e.first_name as 'First Name'
      , e.last_name as 'Last Name'
      , role.title as Title
      , department.name as Department
      , role.salary as Salary
      , concat(m.first_name, ' ' , m.last_name) as Manager
  from
      employee e
  left join employee m on
      e.manager_id = m.id
  inner join role on
      e.role_id = role.id
  inner join department on
      role.department_id = department.id
  where
      e.first_name = substring_index('${answer.manager}', ' ', 1)
      and e.last_name = substring_index('${answer.manager}', ' ', -1)
  order by
      ID asc;`;
            connection.query(query, (err, res) => {
              if (err) throw err;

              //display results via console.table
              console.table(res);
              //return to menu
              callback();
              connection.end();
            });
          });
      },
    );
  },

  updateManager: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    //creating variables
    let employeeArray = [];

    //connect via promiseSQL
    connection.query(
      `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`,
    );

    for (i = 0; i < employees.length; i++) {
      employeeArray.push(employees[i].Employee);
    }

    then((employees) => {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select employee to change.",
            choices: employeeArray,
          },
          {
            name: "manager",
            type: "list",
            message: "Select the manager of Employee.",
            choices: employeeArray,
          },
        ])
        .then((answer) => {
          //creating variables
          let employeeId;
          let managerId;

          for (i = 0; i < employees.length; i++) {
            if (answer.manager == employees[i].Employee) {
              managerId = employees[i].id;
            }
          }

          for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employeeId = employees[i].id;
            }
          }

          //update employer with Manager ID
          connection.query(
            `UPDATE employee SET manager_id = ${managerId} WHERE id = ${employeeId};`,
            (err, res) => {
              if (err) throw err;

              console.log(
                `${answer.employee} manager changed to ${answer.manager}...`,
              );
              //return to menu
              callback();
              connection.end();
            },
          );
        });
    });
  },

  deleteEmployee: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    //creating usable variables
    let employeeArray = [];

    //connection via promiseSQL
    mysql
      .createConnection(connectSettings)
      .then((conn) => {
        return conn.query(
          `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS employee FROM employee ORDER BY Employee ASC;`,
        );
      })
      .then((employees) => {
        for (i = 0; i < employees.length; i++) {
          employeeArray.push(employees[i].employee);
        }

        inquirer
          .prompt([
            {
              name: "employee",
              type: "list",
              message: "What employee would you like to delete?",
              choices: employeeArray,
            },
            {
              name: "decision",
              type: "confirm",
              message: "Are you sure(CONFIRM DELETE)?",
              default: false,
            },
          ])
          .then((answer) => {
            if (answer.decision) {
              let employeeId;

              for (i = 0; employees.length; i++) {
                if (answer.employee == employees[i].employee) {
                  employeeId = employees[i].id;
                }
              }

              //delete selected employee
              connection.query(
                `DELETE FROM employee WHERE id = ${employeeId};`,
                (err, res) => {
                  if (err) throw err;

                  console.log(`Deleting ${answer.employee}...`);
                  //return to menu
                  callback();
                  connection.end();
                },
              );
            }
          });
      });
  },
};

module.exports = employee;
