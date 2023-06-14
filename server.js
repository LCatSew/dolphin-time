const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express(); 

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const connection = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    database: 'employee_manager_db',
    password: 'password',
    },
    console.log(`Connected to the employee_manager_db database.`)
);


start(() => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'toDo',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role', 
                'View All Departments', 
                'Add Department', 
                'Quit'
            ]
        },
    ])
        .then((answers) => {
            switch (answers.choice) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quit();
                    break;
            }
        })
});

viewAllEmployees(() => {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: 'list',
                name: 'toDo',
                message: 'What would you like to do?',
                choices: [
                    'Main Menu', 
                    'Quit'
                ]
            }
        ])
        .then ((answer) => {
            switch (answer.choice) {   
                case 'Main Menu':
                    start();
                    break;
                case 'Quit':
                    quit();
            }
        })
    })
});



addEmployee(() => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the their first name?',
            when: (answers) => answers.toDo === 'Add Employee'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the their last name?',
            when: (answers) => typeof answers.firstName === 'string'
        },
        {
            type: 'list',
            name: 'newEmployeeRole',
            message: "What is the employee's role?",
            choices: [
                'Sales Lead',
                'Salesperson',
                'Lead Engineer',
                'Software Engineer',
                'Account Manager',
                'Accountant',
                'Legal Team Lead',
                'Lawyer',
                'Customer Service Agent',
            ],
            when: (answers) => typeof answers.lastName === 'string'
        },
        {
            type: 'list',
            name: 'newEmployeeManager',
            message: "Who is the employee's manager?",
            choices: [
                'John Doe',
                'Mike Chan',
                'Ashley Rodriguez',
                'Kevin Tupik',
                'Malia Brown',
                'Sarah Lourd',
                'None'
            ],

        }
    ])
    .then((response) => {
        connection.query('INSERT INTO employees(first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)', 
        [response.FirstName, response.LastName, response.EmployeeID, response.ManagerID]), function(err,res) {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'select an option.',
                    choices: [
                        'Main Menu',
                        'Quit'
                    ]
                }
            ])
        }
    })
    .then ((answer) => {
        switch (answer.choice) {   
            case 'Main Menu':
                start();
                break;
            case 'Quit':
                quit();
        }
    })
});

updateEmployeeRole (() => {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the Employee Id of the employee you would like to update.',
                when: (answers) => answers.toDo === 'Update Employee Role'
            },
            {
                type: 'input',
                name: 'employeeRoleUpdate',
                message: 'What is the new role of the employee?',
                when: (answers) => typeof answers.employeeId === 'number'
            },
        ])
        .then((response) => {
            connection.query('UPDATE employee SET roles_id = ? WHERE id = ?'),
            [response.employeeRoleUpdate, response.employeeId], function(err,res) {
                if (err) throw err;
                console.table(res);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'choice',
                        message: 'select an option.',
                        choices: [
                            'Main Menu',
                            'Quit'
                        ]
                    }
                ])
            }
        })
        .then ((answer) => {
            switch (answer.choice) {
                case 'Main Menu':
                    start();
                    break;
                case 'Quit':
                    quit();
            }
        })
    })
});

viewAllRoles(() => {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
    })
});

addRole(() => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What is the title of the role you would like to add?',
            when: (answers) => answers.toDo === 'Add Role'
        },
        {
            type: 'input',
            name: 'addSalary',
            message: 'What is the salary of this role?',
            when: (answers) => typeof answers.addRole === 'string'
        },
        {
            type: 'list',
            name: 'departmentSelect',
            message: 'What department does this role belong to?',
            choices: [
                'Engineering',
                'Finance',
                'Legal',
                'Sales',
                'Service',
            ],
        },
    ])
    .then((response) => {
        connection.query('INSERT INTO role(title, salary, department_id) VALUES (?,?,?)', 
        [response.addRole, response.addSalary, response.departmentSelect]), function(err,res) {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'select an option.',
                    choices: [
                        'Main Menu',
                        'Quit'
                    ]
                }
            ])
        }
    })
    .then ((answer) => {
        switch (answer.choice) {
            case 'Main Menu':
                start();
                break;
            case 'Quit':
                quit();
        }
    })
});

addDepartment(() => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the title of the department you would like to add?',
            when: (answers) => answers.toDo === 'Add Department'
        },
    ])
    .then((response) => {
        connection.query('INSERT INTO department(name) VALUES (?)', 
        [response.addDepartment]), function(err,res) {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'select an option.',
                    choices: [
                        'Main Menu',
                        'Quit'
                    ]
                }
            ])
        }
    })
});