// DEPENDENCIES IMPORTED INTO APP
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const promiseMysql = require('promise-mysql');

// Connection Settings
const connectSettings = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employees_db'
};

//Connect to database
const connection = mysql.createConnection(connectSettings);
connection.connect(err => {
    if (err) throw err;
    console.log(`Welcome to Employee Tracker `);
    mainMenu();
});

//============Functions==============
function mainMenu() {
    //Using inquirer to prompt users with different options
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Main Menu',
            choices: [
                'View All Employees',
                'View All Employees by ROLE',
                'View All Employees by DEPARTMENT',
                'View All Employees by MANAGER',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Update Employee ROLE',
                'Update Employee MANGER',
                'Delete Employee',
                'Delete ROLE',
                'Delete DEPARTMENT',
                'View Department Budgets'
            ]
        })
        .then((answer) => {
            // User answer into switch case
            switch (answer.action) {
                case 'View All Employees':
                    displayAll();
                    break;
                case 'View All Employees by ROLE':
                    displayAllRoles();
                    break;
                case 'View All Employees by DEPARTMENT':
                    displayAllDept();
                    break;
                case 'View All Employees by MANAGER':
                    displayAllManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Employee ROLE':
                    updateRole();
                    break;
                case 'Update Employee MANGER':
                    updateManager();
                    break;
                case 'Delete Employee':
                    deleteEmployee();
                    break;
                case 'Delete ROLE':
                    deleteRole();
                    break;
                case 'Delete DEPARTMENT':
                    deleteDepartment();
                    break;
                case 'View Department Budgets':
                    viewBudget();
                    break;
            }
        });
};

function displayAll() {
    //display all employees
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    //query connection
    connection.query(query, function(err, res) {
        if (err) throw err;
        
        //display results via console.table
        console.table(res);

        //return to menu
        mainMenu();
    });
};