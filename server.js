/**
 * @todo
 * employeeController.updateManager
 * employeeController.deleteEmployee
 * roleController.deleteRole
 * departmentController.deleteDepartment
 */

// DEPENDENCIES IMPORTED INTO APP
const inquirer = require("inquirer");

// Controllers
var departmentController = require("./controllers/department");
var employeeController = require("./controllers/employee");
var roleController = require("./controllers/role");
var allController = require("./controllers/all");

//============Functions==============
const mainMenu = async () => {
  console.log(`Welcome to Employee Tracker `);

  //Using inquirer to prompt users with different options
  await inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Main Menu",
      choices: [
        "View All Employees",
        "View All Employees by ROLE",
        "View All Employees by DEPARTMENT",
        "View All Employees by MANAGER",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee ROLE",
        "Update Employee MANGER",
        "Delete Employee",
        "Delete ROLE",
        "Delete DEPARTMENT",
        "View Department Budgets",
      ],
    })
    .then((answer) => {
      // User answer into switch case
      switch (answer.action) {
        case "View All Employees":
          allController.displayAll(mainMenu);
          break;
        case "View All Employees by ROLE":
          roleController.displayAllRoles(mainMenu);
          break;
        case "View All Employees by DEPARTMENT":
          departmentController.displayAllDept(mainMenu);
          break;
        case "View All Employees by MANAGER":
          employeeController.displayAllManager(mainMenu);
          break;
        case "Add Employee":
          roleController.addEmployee(mainMenu);
          break;
        case "Add Role":
          roleController.addRole(mainMenu);
          break;
        case "Add Department":
          departmentController.addDepartment(mainMenu);
          break;
        case "Update Employee ROLE":
          roleController.updateRole(mainMenu);
          break;
        case "Update Employee MANGER":
          employeeController.updateManager(mainMenu);
          break;
        case "Delete Employee":
          employeeController.deleteEmployee(mainMenu);
          break;
        case "Delete ROLE":
          roleController.deleteRole(mainMenu);
          break;
        case "Delete DEPARTMENT":
          departmentController.deleteDepartment(mainMenu);
          break;
      }
    });
};

mainMenu();
