const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express(); 

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_manager_db',
    password: 'password',
    });

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected to the employee_manager_db database.`);

    start();
});

function start() {
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
                'Quit',
            ],
        },
    ])
    .then((answers) => {
        switch (answers.toDo) {
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
    });
}

// start();

function viewAllEmployees() {
const query = `
    SELECT 
    employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.title AS role, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM 
    employees
    INNER JOIN roles ON employees.role_id = roles.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
`;
connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['Main Menu', 'Quit'],
        },
    ])
    .then((answer) => {
        switch (answer.choice) {
        case 'Main Menu':
            start();
            break;
        case 'Quit':
            quit();
            break;
        }
    });
});
};




function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the their first name?',
            //when: (answers) => answers.toDo === 'Add Employee'
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

        },
    ])
    .then((answers) => {
        const { firstName, lastName, newEmployeeRole, newEmployeeManager } = answers;
        connection.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) SELECT ?, ?, roles.id, employees.id FROM roles, employees WHERE roles.title = ? AND CONCAT(employees.first_name, ' ', employees.last_name) = ?",
            [firstName, lastName, newEmployeeRole, newEmployeeManager],
            function (err, res) {
                if (err) throw err;
                console.log("Employee added successfully!");
                console.table(res);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'Select an option.',
                    choices: [
                        'Main Menu',
                        'Quit'
                    ],
                },
            ])
            .then ((answer) => {
                switch (answer.choice) {   
                    case 'Main Menu':
                        start();
                        break;
                    case 'Quit':
                        quit();
                }
            });
        }
    );
});
};

function updateEmployeeRole () {
    connection.query('SELECT * FROM employees', function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the Employee Id of the employee you would like to update.',
                //when: (answers) => answers.toDo === 'Update Employee Role'
            },
            {
                type: 'input',
                name: 'employeeRoleUpdate',
                message: 'What is the new role of the employee?',
                //when: (answers) => typeof answers.employeeId === 'number'
            },
        ])
        .then((response) => {
            const { employeeId, employeeRoleUpdate } = response;
            connection.query('UPDATE employees SET roles_id = ? WHERE id = ?'),
            [employeeId, employeeRoleUpdate], 
            function(err,res) {
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
                        ],
                    },
                ])
            }
            .then((answer) => {
                switch (answer.choice) {
                    case 'Main Menu':
                        start();
                        break;
                    case 'Quit':
                        quit();
                }
            });
        })
    })
};

function viewAllRoles() {
    const query=`
    SELECT 
        roles.id, 
        roles.title AS role, 
        roles.salary,
        departments.name AS department
    FROM 
        roles
    INNER JOIN departments ON roles.department_id = departments.id
    `;
    connection.query(query, function (err, res) {
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
            ],
            },
        ])
        .then((answer) => {
            switch (answer.choice) {
                case 'Main Menu':
                    start();
                    break;
                case 'Quit':
                    quit();
            }
        });
    })
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What is the title of the role you would like to add?',
            //when: (answers) => answers.toDo === 'Add Role'
        },
        {
            type: 'input',
            name: 'addSalary',
            message: 'What is the salary of this role?',
            //when: (answers) => typeof answers.addRole === 'string'
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
        const { addRole, addSalary, departmentSelect } = response;
        connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)', 
        [addRole, addSalary, departmentSelect]), function(err,res) {
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
                    ],
                },
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
        }
    })
    
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the title of the department you would like to add?',
            when: (answers) => answers.toDo === 'Add Department'
        },
    ])
    .then((response) => {
        const { addDepartment } = response;
        connection.query('INSERT INTO departments(name) VALUES (?)', 
        [addDepartment]), 
        function(err,res) {
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
                    ],
                },
            ])
            .then ((answer) => {
                switch (answer.choice) {
                    case 'Main Menu':
                        start();
                        break;
                    case 'Quit':
                        quit();
                        break
                }
            });
        }
    })
};

function quit() {
    console.log('Goodbye!');
    process.exit();
    
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});