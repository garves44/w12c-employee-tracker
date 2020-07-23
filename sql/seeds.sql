USE employees_db;

INSERT INTO department (name)
VALUES ('engineering'), ('finance'), ('legal'), ('sales');

INSERT INTO role (title, salary, department_id)
VALUES ('lead software engineer', 2000, 1),
('software engineer', 1000, 1),
('accountant', 500, 2),
('lawyer', 2000, 3),
('lawyer assistant', 500, 3),
('salesman', 900, 4),
('lead salesman', 1200, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jeremy', 'Collins', 1, null),
('Jacob', 'Crosley', 3, 3),
('Matthew', 'Foster', 1, null),
('Kevin', 'Dingle', 2, null),
('Kelli', 'Mattingly', 4, 4);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;
