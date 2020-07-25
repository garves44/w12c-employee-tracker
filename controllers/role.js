// DEPENDENCIES IMPORTED INTO APP
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

require("dotenv").config();
const dbconfig = require("./../config/dbconfig");

var role = {
    displayAllRoles: (callback = () => {}) => {
      var connection = mysql.createConnection(dbconfig);

      let roleArray = [];
      connection.query(`SELECT title FROM role`, function (err, res) {
        for (i = 0; i < res.length; i++) {
          roleArray.push(res[i].title);
        }

        //user selects role
        inquirer
          .prompt({
            name: "role",
            type: "list",
            message: "Choose a role to search.",
            choices: roleArray,
          })
          .then((answer) => {
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC;`;
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

    addEmployee: async (callback = () => {}) => {
      var connection = mysql.createConnection(dbconfig);

      let roleArray = [];
      let managerArray = [];
      //all roles and managers as a promise
      const allResults = await Promise.all([
        connection
        .promise()
        .query(`SELECT id, title FROM role ORDER BY title ASC;`)
        .then(([rows, fields]) => {
          return rows;
        }),
        connection
        .promise()
        .query(
          `SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`,
        )
        .then(([rows, fields]) => {
          return rows;
        }),
      ]);

      console.log(allResults);
      //roles into roleArray
      for (i = 0; i < allResults[0].length; i++) {
        roleArray.push(allResults[0][i].title);
      }
      //mangers into mangerArray
      for (i = 0; i < allResults[1].length; i++) {
        managerArray.push(allResults[1][i].Employee);
      }

      console.log(roleArray);
      console.log(managerArray);
      inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "Enter first name of employee",
            validate: (input) => {
              if (input === "") {
                console.log(`Enter a name.`);
                return false;
              }
              return true;
            },
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter last name of employee",
            validate: (input) => {
              if (input === "") {
                console.log(`Enter a name.`);
                return false;
              }
              return true;
            },
          },
          {
            name: "role",
            type: "list",
            message: "What is the role of the new employee?",
            choices: roleArray,
          },
          {
            name: "manager",
            type: "list",
            message: "who is the manager of the new employee?",
            choices: managerArray,
          },
        ])
        .then((answer) => {
          let roleId = null;
          let managerId = null;

          //id for role
          for (i = 0; i < allResults[0].length; i++) {
            if (answer.role == allResults[0][i].title) {
              roleId = allResults[0][i].id;
            }
          }
          //id for manager
          for (i = 0; i < allResults[1].length; i++) {
            if (answer.manager == allResults[1][i].Employee) {
              managerId = allResults[1][i].id;
            }
          }

          //Adding employee
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ("${answer.firstName}", "${answer.lastName}", ${roleId}, ${managerId});`,
            (err, res) => {
              if (err) return err;

              // Confirm employee has been added
              console.log(
                `\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `,
              );
              //return to menu
              callback();
              connection.end();
            },
          );
        });
    },

    addRole: async (callback = () => {}) => {
      var connection = mysql.createConnection(dbconfig);

      let deptArray = [];
      const allResults = await Promise.all([
        connection
        .promise()
        .query(`Select id, name FROM department ORDER BY name ASC;`)
        .then(([rows, fields]) => {
          return rows;
        })
      ])

      //add to department Array
      for (i = 0; i < allResults[0].length; i++) {
        deptArray.push(allResults[0][i].name);
      }
      
    inquirer
      .prompt([{
          name: "role",
          type: "input",
          message: "Enter role title.",
        },
        {
          name: "salary",
          type: "number",
          message: "Enter a number for salary.",
        },
        {
          name: "dept",
          type: "list",
          message: "Department: ",
          choices: deptArray,
        },
      ])
      .then((answer) => {
        // Create usable variable
        let deptId = null;

        for (i = 0; i < allResults[0].length; i++) {
          if (answer.dept == allResults[0][i].name) {
            deptId = allResults[0][i].id;
          }
        }

        //add role to table
        connection.query(
          `INSERT INTO role (title, salary, department_id)
              VALUES ('${answer.role}', ${answer.salary}, ${deptId});`,
          (err, res) => {
            if (err) throw err;
            console.log(`adding ${answer.role}!`);
            //return to menu
            callback();
            connection.end();
          },
        );
      });
  },

updateRole: async (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    let records = await Promise.all([
      connection
      .promise()
      .query(`SELECT id, title FROM role ORDER BY title ASC;`)
      .then(([rows, fields]) => {
        return rows;
      }),
      connection
      .promise()
      .query(
        `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`,
      )
      .then(([rows, fields]) => {
        return rows;
      }),
    ]);

    //Create usable variables
    let roleArray = [];
    let employeeArray = [];

    //update roles array
    for (i = 0; i < records[0].length; i++) {
      roleArray.push(records[0][i].title);
    }

    //update employee array
    for (i = 0; i < records[1].length; i++) {
      employeeArray.push(records[1][i].Employee);
    }

    await inquirer
      .prompt([{
          name: "employee",
          type: "list",
          message: "Select an employee.",
          choices: employeeArray,
        },
        {
          name: "role",
          type: "list",
          message: "what is the new role?",
          choices: roleArray,
        },
      ])
      .then((answer) => {
        //creating variables
        let roleId;
        let employeeId;

        for (i = 0; i < records[0].length; i++) {
          if (answer.role == records[0][i].title) {
            roleId = records[0][i].id;
          }
        }

        for (i = 0; i < records[1].length; i++) {
          if (answer.employee == records[1][i].Employee) {
            employeeId = records[1][i].id;
          }
        }

        //updating employee role
        connection.query(
          `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`,
          (err, res) => {
            if (err) throw err;

            console.log(`${answer.employee} role update to ${answer.role}...`);
            //return to menu
            callback();
            connection.end();
          },
        );
      });
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
        .prompt([{
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

  deleteRole: (callback = () => {}) => {
    var connection = mysql.createConnection(dbconfig);

    //create role array
    let roleArray = [];

    mysql
      .createConnection(connectSettings)
      .then((conn) => {
        return conn.query(`SELECT id, title FROM role`);
      })
      .then((roles) => {
        for (i = 0; i < roles.length; i++) {
          roleArray.push(roles[i].title);
        }

        inquirer
          .prompt([{
            name: "delete",
            type: "confirm",
            message: "WARNING--- Deleting a role will remove all employees within the role. Would you like to continue?",
            default: false,
          }, ])
          .then((answer) => {
            if (!answer.delete) {
              //return to menu
              callback();
            }
          })
          .then(() => {
            inquirer
              .prompt([{
                  name: "role",
                  type: "list",
                  message: "Which role would you like to delete?",
                  choices: roleArray,
                },
                {
                  name: "confirmDelete",
                  type: "input",
                  message: "Enter the name of the role you want to delete!",
                },
              ])
              .then((answer) => {
                if (answer.confirmDelete === answer.role) {
                  let roleId;

                  for (i = 0; i < roles.length; i++) {
                    roleId = roles[i].id;
                  }

                  //remove role
                  connection.query(
                    `DELETE FROM role WHERE id = ${roleId};`,
                    (err, res) => {
                      if (err) throw err;

                      console.log(`${answer.role} removed from roles...`);
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

module.exports = role;