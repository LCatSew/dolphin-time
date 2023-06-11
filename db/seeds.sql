INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO roles (title, department_id, salary)
VALUES
    ('Sales Lead', 'Sales', 100000.00),
    ('Salesperson', 'Sales', 80000.00),
    ('Lead Engineer', 'Engineering', 150000.00),
    ('Software Engineer', 'Engineering', 120000.00),
    ('Accountant', 'Finance', 125000.00),
    ('Legal Team Lead', 'Legal', 250000.00),
    ('Lawyer', 'Legal', 190000.00);

INSERT INTO employees (first_name, last_name, role_id, department_id, salary, manager_id)
VALUES
    ('John', 'Doe', 'Sales Lead', 'Sales', 100000, ''),
    ('Mike', 'Chan', 'Salesperson', 'Sales', 80000, 'John Doe'),
    ('Ashley', 'Rodriguez', 'Lead Engineer', 'Engineering', 150000, ''),
    ('Kevin', 'Tupik', 'Software Engineer', 'Engineering', 120000, 'Ashley Rodriguez'),
    ('Kunal', 'Singh', 'Accountant', 'Finance', 125000, ''),
    ('Malia', 'Brown', 'Accountant', 'Finance', 125000, 'Kunal Singh'),
    ('Sarah', 'Lourd', 'Legal Team Lead', 'Legal', 250000, ''),
    ('Tom', 'Allen', 'Lawyer', 'Legal', 190000, 'Sarah Lourd');