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


const promptUser = () => {
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
                'Quit'
            ]
        },
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
            ],

        },
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
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the title of the department you would like to add?',
            when: (answers) => answers.toDo === 'Add Department'
        },
        {
            type: 'input',

        }
    ])
}