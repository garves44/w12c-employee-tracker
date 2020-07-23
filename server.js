// DEPENDENCIES IMPORTED INTO APP
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const promiseMysql = require('promise-mysql');
const {
    connect
} = require('http2');

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
    connection.query(query, function (err, res) {
        if (err) throw err;

        //display results via console.table
        console.table(res);

        //return to menu
        mainMenu();
    });
};

function displayAllRoles() {
    let roleArray = [];

    promiseMysql.createConnection(connectSettings)
        .then(conn => {
            return conn.query(`SELECT title FROM role`);
        })
        .then(roles => {
            //add roles to array
            for (i = 0; i < roles.length; i++) {
                roleArray.push(roles[i].title);
            };
        })
        .then(() => {
            //user selects role
            inquirer.prompt({
                    name: 'role',
                    type: 'list',
                    message: 'Choose a role to search.',
                    choices: roleArray
                })
                .then(answer => {
                    const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
                    connection.query(query, (err, res) => {
                        if (err) throw err;

                        //display results via console.table
                        console.table(res);
                        //return to menu
                        mainMenu();
                    });
                });
        });
};

function displayAllDept() {
    let departmentArray = [];

    promiseMysql.createConnection(connectSettings)
        .then(conn => {
            return conn.query(`SELECT name FROM department`);
        })
        .then(value => {
            //add to departmentArray
            for (i = 0; i < value.length; i++) {
                departmentArray.push(value[i].name);
            }
        })
        .then(() => {
            //user selects department
            inquirer.prompt({
                    name: 'department',
                    type: 'list',
                    message: 'Choose a department to search.',
                    choices: departmentArray
                })
                .then(answer => {
                    const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
                    connection.query(query, (err, res) => {
                        if (err) throw err;

                        //display results via console.table
                        console.table(res);
                        //return to menu
                        mainMenu();
                    });
                });
        });
};

function addEmployee() {
    let roleArray = [];
    let managerArray = [];

    promiseMysql.createConnection(connectSettings)
        .then(conn => {
            //all roles and managers as a promise
            return Promise.all([
                conn.query('SELECT id, title FROM role ORDER BY title ASC'),
                conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
            ]);
        })
        .then(([roles, managers]) => {
            //roles into roleArray
            for (i = 0; i < roles.length; i++) {
                roleArray.push(roles[i].title);
            }
            //mangers into mangerArray
            for (i = 0; i < managers.length; i++) {
                managerArray.push(managers[i].Employee);
            }

            //return arrays as promise
            return Promise.all([roles, managers]);
        })
        .then(([roles, managers]) => {
            //incase no manager
            managerArray.unshift('--');

            inquirer.prompt([{
                        name: 'firstName',
                        type: 'input',
                        message: 'Enter first name of employee',
                        validate: input => {
                            if (input === '') {
                                console.log(`Enter a name.`);
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: 'Enter last name of employee',
                        validate: input => {
                            if (input === '') {
                                console.log(`Enter a name.`);
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'What is the role of the new employee?',
                        choices: roleArray
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'who is the manager of the new employee?',
                        choices: managerArray
                    }
                ])
                .then(answer => {
                    let roleId = null;
                    let managerId = null;

                    //id for role
                    for (i = 0; i < roles.length; i++) {
                        if (answer.role == roles[i].title) {
                            roleId = roles[i].id;
                        }
                    }
                    //id for manager
                    for (i = 0; i < managers.length; i++) {
                        if (answer.manager == managers[i].Employee) {
                            managerId = managers[i].id;
                        }
                    }

                    //Adding employee
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                        if (err) return err;

                        // Confirm employee has been added
                        console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                        //return to menu
                        mainMenu();
                    });
                })
        })
}