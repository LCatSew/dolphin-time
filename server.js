const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

//port set up
const PORT = process.env.PORT || 3001;
const app = express(); 

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//With connection pooling, connections are managed automatically. Connection pool handles the connection management for you.
//connectiom pooling enhances the performance and scalability of executing database queries.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'employee_manager_db',
    password: 'password',
});

const util = require('util');


// Helper function to handle database queries
function queryDatabase(sql, values) {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, res) => {
            if (err) {
            reject(err);
            } else {
            resolve(res);
            }
        });
    });
}


function promptMainMenu() {
    return inquirer.prompt([
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
}



// Handle the user's choice from the main menu
// asynchronous functions provides better control over asynchronous operations, improves code readability, and enables efficient error handling in asynchronous workflows.
async function handleMainMenuChoice(choice) {
    //switch statement will run the function based on the user's choice (case)
    switch (choice) {
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Quit':
            quit();
            break;
    };
}

async function viewAllEmployees() {
    const query = `
        SELECT 
            employees.id, employees.first_name, employees.last_name, roles.title AS role, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM 
            employees
        INNER JOIN roles ON employees.role_id = roles.id
        LEFT JOIN employees manager ON employees.manager_id = manager.id
    `;
    // INNER JOIN only includes matching rows, while LEFT JOIN includes all rows from the left table and matching rows from the right table.
    try {
        const res = await queryDatabase(query);
        console.table(res);

        const answer = await inquirer.prompt([
            {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['Main Menu', 'Quit'],
            },
        ]);
        if (answer.choice === 'Main Menu') {
            start();
        } else {
            quit();
        }
    } catch (err) {
        console.log(err);
    }
}



async function addEmployee() {
    try {
        const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the their first name?',
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
    ]);
    const { firstName, lastName, newEmployeeRole, newEmployeeManager } = answers;
    const query =
        `INSERT INTO 
            employees (first_name, last_name, role_id, manager_id) 
        SELECT 
            ?, ?, roles.id, employees.id 
        FROM 
            roles, employees 
        WHERE 
            roles.title = ? 
        AND CONCAT(employees.first_name, ' ', employees.last_name) = ?`;
        await queryDatabase(query, [firstName, lastName, newEmployeeRole, newEmployeeManager]);
        console.log(`Added ${firstName} ${lastName} to the database.`);
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Select an option.',
                choices: [
                    'Main Menu',
                    'Quit'
                ],
            },
        ]);
        
            if (answer.choice === 'Main Menu') {   
                    start();
            } else {
                    quit();
            }
    } catch (err) {
        console.log(err);
    }
}

async function updateEmployeeRole () {
    const query =`
        SELECT 
            employees. id, employees.first_name, employees.last_name, roles.title AS role
        FROM 
            employees
        INNER JOIN roles ON employees.role_id = roles.id
    `;
    try {
        const res = await queryDatabase(query);
        console.table(res);

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the Employee Id of the employee you would like to update.',
            },
            {
                type: 'input',
                name: 'employeeRoleUpdate',
                message: 'What is the new role of the employee?',
            },
        ]);
        const { employeeId, employeeRoleUpdate } = answers;
            
        const queryAgain = 'SELECT id FROM roles WHERE title = ?';
        const [rolerRow] = await queryDatabase (queryAgain, [employeeRoleUpdate]);
        
            
        // Check if the role exists
        if (rolerRow.length === 0) {
            console.log('Invalid role. Please try again.');
            // Call the updateEmployeeRole function again to restart the process
            updateEmployeeRole();
            return;
        }
        
        const roleId = rolerRow.id;
            
        // Step 2: Update the role_id in the employees table
        const queryUpdate = 'UPDATE employees SET role_id = ? WHERE id = ?'; 
        await queryDatabase (queryUpdate, [roleId, employeeId]);
            
        console.log(`Employee ${employeeId}'s role ha been updated to ${employeeRoleUpdate} successfully! `);
        const answerAgain = inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'select an option.',
                choices: [
                    'Main Menu',
                    'Quit'
                ],
            },
        ]);
        if (answerAgain === 'Main Menu') { 
            start();
        } else {
            quit();
        }
    } catch (err) {
        console.log(err);
    };
};


async function viewAllRoles() {
    const query=`
        SELECT 
            roles.id, roles.title AS role, roles.salary, departments.name AS department
        FROM 
            roles
        INNER JOIN departments ON roles.department_id = departments.id
    `;
    try {
        const res = await queryDatabase(query);
        console.table(res);

        const answer = await inquirer.prompt([
            { 
                type: 'list',
                name: 'choice',
                message: 'select an option.',
                choices: [
                    'Main Menu',
                    'Quit'
                ],
            },
        ]);
        if (answer.choice === 'Main Menu') {   
                start();
        } else {
                quit();
        }
    } catch (err) {
        console.log(err);
    }
};

async function addRole() {
    try {
    const answer = await inquirer.prompt([
        {
        type: 'input',
        name: 'addRole',
        message: 'What is the title of the role you would like to add?',
        },
        {
        type: 'input',
        name: 'addSalary',
        message: 'What is the salary of this role?',
        },
        {
        type: 'list',
        name: 'departmentSelect',
        message: 'What department does this role belong to?',
        choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service'],
        },
    ]);
    const { addRole, addSalary, departmentSelect } = answer;

    // Make sure the role doesn't already exist
    const query = `SELECT id FROM roles WHERE title = ?`;
    const roleRows = await queryDatabase(query, [addRole]);

    // Check if the role exists by checking the length of the result set. Anything more than zero means the role exists.
    if (roleRows.length > 0) {
        console.log('Role already exists. Please try again.');
        // Call the addRole function again to restart the process
        addRole();
        return;
    } else {
        const queryAgain = `
        INSERT INTO roles (title, salary, department_id)
        SELECT ?, ?, departments.id
        FROM departments
        WHERE departments.name = ?`;
        await queryDatabase(queryAgain, [addRole, addSalary, departmentSelect]);
        console.log(`Added ${addRole} Role to the database.`);
    }

    const answers = await inquirer.prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'Select an option.',
        choices: ['Main Menu', 'Quit'],
        },
    ]);

    if (answers.choice === 'Main Menu') {
        start();
    } else {
        quit();
    }
    } catch (err) {
    console.log(err);
    }
}
  

async function viewAllDepartments() {
    const query = `
    SELECT * FROM departments
    `;
    try {
        const res = await queryDatabase(query);
        console.table(res);

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'select an option.',
                choices: [
                    'Main Menu',
                    'Quit'
                ],
            },
        ]);
        if (answer.choice === 'Main Menu') {   
                start();
        } else {
                quit();
        }
    } catch (err) {
        console.log(err);
    }
};

async function addDepartment() {
    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: 'What is the title of the department you would like to add?',
            },
        ])
    const { addDepartment } = answer;
    const query = 'INSERT INTO departments (name) VALUES (?)'; 
    await queryDatabase (query, [addDepartment]);

    console.log(`Added ${addDepartment} Department to the database.`);
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'select an option.',
            choices: [
                'Main Menu',
                'Quit'
            ],
        },
    ]);
    if (response.choice === 'Main Menu') {   
            start();
    } else {
            quit();
    }
    } catch (err) {
        console.log(err);
    }
}



function quit() {
    console.log('Goodbye!');
    process.exit();
    
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Start the application
function start() {
    promptMainMenu()
    .then((answers) => handleMainMenuChoice(answers.toDo))
    .catch((err) => console.error('Error:', err));
}

start();