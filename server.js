// DEPENDENCIES IMPORTED INTO APP
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('./config/connection');

console.log(`Welcome to Employee Tracker `);
mainMenu();
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

            }
        });
};

function displayAll() {
    //display all employees
    let query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC;`;
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
    connection.query(`SELECT title FROM role`, function (err, res) {
        for (i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        };

        //user selects role
        inquirer.prompt({
                name: 'role',
                type: 'list',
                message: 'Choose a role to search.',
                choices: roleArray
            })
            .then(answer => {
                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC;`;
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
    connection.query(`SELECT name FROM department`, function (err, res) {
        //add to departmentArray
        for (i = 0; i < res.length; i++) {
            departmentArray.push(res[i].name);
        }

        //user selects department
        inquirer.prompt({
                name: 'department',
                type: 'list',
                message: 'Choose a department to search.',
                choices: departmentArray
            })
            .then(answer => {
                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC;`;
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

function displayAllManager() {
    let managerArray = [];
    connection.query(`select concat(e2.first_name, ' ', e2.last_name) as manager from employee as e join employee as e2 on e.manager_id = e2.id ;`, function (err, res) {
        // add to managerArray
        for (i = 0; i < res.length; i++) {
            managerArray.push(res[i].manager);
        }
        inquirer.prompt({
                name: 'manager',
                type: 'list',
                message: 'Choose a manager!',
                choices: managerArray
            })
            .then(answer => {
                console.log(answer)
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
                    mainMenu();
                });
            });
    });
};

const addEmployee = async () => {
    let roleArray = [];
    let managerArray = [];
    //all roles and managers as a promise
    const allResults = await Promise.all([
        connection
            .promise()
            .query(`SELECT id, title FROM role ORDER BY title ASC;`)
            .then(([rows, fields]) => {
                return rows
        }),
        connection
            .promise()
            .query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`)
            .then(([rows, fields]) => {
                return rows;
        })
    ])

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
    ;

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
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleId}, ${managerId});`, (err, res) => {
                if (err) return err;

                // Confirm employee has been added
                console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                //return to menu
                mainMenu();
            });
        });
};

function addRole() {
    let deptArray = [];
    mysql.createConnection(connectSettings)
        .then(conn => {
            return conn.query(`SELECT id, name FROM department ORDER BY name ASC;`);
        })
        .then(departments => {
            //add to department Array
            for (i = 0; i < departments.length; i++) {
                deptArray.push(departments[i].name);
            }
            return departments;
        })
        .then(departments => {
            inquirer.prompt([{
                        name: 'role',
                        type: 'input',
                        message: 'Enter role title.'
                    },
                    {
                        name: 'salary',
                        type: 'number',
                        message: 'Enter a number for salary.'
                    },
                    {
                        name: 'dept',
                        type: 'list',
                        message: 'Department: ',
                        choices: deptArray
                    }
                ])
                .then(answer => {
                    // Create usable variable
                    let deptId = null;

                    for (i = 0; i < departments.length; i++) {
                        if (answer.dept == departments[i].name) {
                            deptId = departments[i].id;
                        }
                    }

                    //add role to table
                    connection.query(`INSERT INTO role (title, salary, department_id)
            VALUES ('${answer.role}', ${answer.salary}, ${deptId});`, (err, res) => {
                        if (err) throw err;
                        console.log(`adding ${answer.role}!`);
                        //return to menu
                        mainMenu();

                    });
                });
        });
};

function addDepartment() {
    inquirer.prompt({
        name: 'department',
        type: 'input',
        message: 'Enter a name for the new Department'
    }).then(answer => {
        connection.query(`INSERT INTO department (name)
                            VALUES ('${answer.department}');`, (err, res) => {
            if (err) throw err;
            console.log(`Adding ${answer.department}...`);
            //return to menu
            mainMenu();
        });
    });
};

function updateRole() {
    //Create usable variables
    let employeeArray = [];
    let roleArray = [];

    //connection via promiseSQL
    mysql.createConnection(connectSettings)
        .then(conn => {
            return Promise.all([
                conn.query(`SELECT id, title FROM role ORDER BY title ASC;`),
                conn.query(`SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`)
            ]);
        })
        .then(([roles, employees]) => {
            //update roles array
            for (i = 0; i < roles.length; i++) {
                roleArray.push(roles[i].title);
            }

            //update employee array
            for (i = 0; i < employees.length; i++) {
                employeeArray.push(employees[i].Employee);
            }

            return Promise.all([roles, employees]);
        })
        .then(([roles, employees]) => {
            inquirer.prompt([{
                        name: 'employee',
                        type: 'list',
                        message: 'Select an employee.',
                        choices: employeeArray
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'what is the new role?',
                        choices: roleArray
                    }
                ])
                .then(answer => {
                    //creating variables
                    let roleId;
                    let employeeId;

                    for (i = 0; i < roles.length; i++) {
                        if (answer.role == roles[i].title) {
                            roleId = roles[i].id;
                        }
                    }

                    for (i = 0; i < employees.length; i++) {
                        if (answer.employee == employees[i].Employee) {
                            employeeId = employees[i].id;
                        }
                    }

                    //updating employee role
                    connection.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`, (err, res) => {
                        if (err) throw err;

                        console.log(`${answer.employee} role update to ${answer.role}...`);
                        //return to menu
                        mainMenu();
                    });
                });
        });
};

function updateManager() {
    //creating variables
    let employeeArray = [];

    //connect via promiseSQL
    connection.query(`SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`);

    for (i = 0; i < employees.length; i++) {
        employeeArray.push(employees[i].Employee);
    }


    then(employees => {
        inquirer.prompt([{
                    name: 'employee',
                    type: 'list',
                    message: 'Select employee to change.',
                    choices: employeeArray
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Select the manager of Employee.',
                    choices: employeeArray
                }
            ])
            .then(answer => {
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
                connection.query(`UPDATE employee SET manager_id = ${managerId} WHERE id = ${employeeId};`, (err, res) => {
                    if (err) throw err;

                    console.log(`${answer.employee} manager changed to ${answer.manager}...`);
                    //return to menu
                    mainMenu();
                });
            });
    });
};

function deleteEmployee() {
    //creating usable variables
    let employeeArray = [];

    //connection via promiseSQL
    mysql.createConnection(connectSettings)
        .then(conn => {
            return conn.query(`SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS employee FROM employee ORDER BY Employee ASC;`);
        })
        .then(employees => {
            for (i = 0; i < employees.length; i++) {
                employeeArray.push(employees[i].employee);
            }

            inquirer.prompt([{
                        name: 'employee',
                        type: 'list',
                        message: 'What employee would you like to delete?',
                        choices: employeeArray
                    },
                    {
                        name: 'decision',
                        type: 'confirm',
                        message: 'Are you sure(CONFIRM DELETE)?',
                        default: false
                    }
                ])
                .then(answer => {
                    if (answer.decision) {
                        let employeeId;

                        for (i = 0; employees.length; i++) {
                            if (answer.employee == employees[i].employee) {
                                employeeId = employees[i].id;
                            }
                        }

                        //delete selected employee
                        connection.query(`DELETE FROM employee WHERE id = ${employeeId};`, (err, res) => {
                            if (err) throw err;

                            console.log(`Deleting ${answer.employee}...`);
                            //return to menu
                            mainMenu();
                        });
                    };
                });
        });
};

function deleteRole() {
    //create role array
    let roleArray = [];

    mysql.createConnection(connectSettings)
        .then(conn => {
            return conn.query(`SELECT id, title FROM role`);
        })
        .then(roles => {
            for (i = 0; i < roles.length; i++) {
                roleArray.push(roles[i].title);
            }

            inquirer.prompt([{
                    name: 'delete',
                    type: 'confirm',
                    message: 'WARNING--- Deleting a role will remove all employees within the role. Would you like to continue?',
                    default: false
                }])
                .then(answer => {
                    if (!answer.delete) {
                        //return to menu
                        mainMenu();
                    }
                })
                .then(() => {
                    inquirer.prompt([{
                                name: 'role',
                                type: 'list',
                                message: 'Which role would you like to delete?',
                                choices: roleArray
                            },
                            {
                                name: 'confirmDelete',
                                type: 'input',
                                message: 'Enter the name of the role you want to delete!'
                            }
                        ])
                        .then(answer => {
                            if (answer.confirmDelete === answer.role) {
                                let roleId;

                                for (i = 0; i < roles.length; i++) {
                                    roleId = roles[i].id;
                                }

                                //remove role
                                connection.query(`DELETE FROM role WHERE id = ${roleId};`, (err, res) => {
                                    if (err) throw err;

                                    console.log(`${answer.role} removed from roles...`);
                                    //return to menu
                                    mainMenu();
                                })
                            };
                        });
                });
        });
};

function deleteDepartment() {
    // creating usable array
    let departmentArray = [];

    //connection via promiseSQL
    mysql.createConnection(connectSettings)
        .then(conn => {
            return conn.query(`SELECT id, name FROM department;`);
        })
        .then(dept => {
            for (i = 0; i < dept.length; i++) {
                departmentArray.push(dept[i].name);
            }

            inquirer.prompt([{
                    name: 'delete',
                    type: 'confirm',
                    message: 'WARNING --- Deleting a department will remove all roles and employees within the department. Do you wish to continue?',
                    default: false
                }])
                .then(answer => {
                    if (!answer.delete) {
                        //return to menu
                        mainMenu();
                    }
                })
                .then(() => {
                    inquirer.prompt([{
                                name: 'department',
                                type: 'list',
                                message: 'Select a department to delete.',
                                choices: departmentArray
                            },
                            {
                                name: 'confirmDelete',
                                type: 'input',
                                message: 'Enter the department name you want to delete.'
                            }
                        ])
                        .then(answer => {
                            if (answer.confirmDelete === answer.department) {
                                let departmentId;
                                for (i = 0; i < dept.length; i++) {
                                    if (answer.department == dept[i].name) {
                                        departmentId = dept[i].id;
                                    }
                                }

                                //delete department
                                connection.query(`DELETE FROM department WHERE id = ${departmentId};`, (err, res) => {
                                    if (err) throw err;

                                    console.log(`${answer.department} is being deleted..`);
                                    //return to menu
                                    mainMenu();
                                });
                            };
                        });
                });
        });
};