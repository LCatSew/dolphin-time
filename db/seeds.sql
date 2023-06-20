INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO roles (title, department_id, salary)
VALUES
    ('Sales Lead', 4, 100000.00),
    ('Salesperson', 4, 80000.00),
    ('Lead Engineer', 1, 150000.00),
    ('Software Engineer', 1, 120000.00),
    ('Accountant', 2, 125000.00),
    ('Legal Team Lead', 3, 250000.00),
    ('Lawyer', 3, 190000.00);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 5, 5),
    ('Sarah', 'Lourd', 6, NULL),
    ('Tom', 'Allen', 7, 7);
