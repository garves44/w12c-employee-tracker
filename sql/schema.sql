-- delete existing employess database
DROP DATABASE IF EXISTS employees_db;
-- remake employees database
CREATE DATABASE employees_db;

USE employees_db;

-- employees_db.department definition

CREATE TABLE IF NOT EXISTS `department` (
  `id` int NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
);

-- employees_db.`role` definition

CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL auto_increment,
  `title` varchar(30) NOT NULL,
  `salary` VARCHAR(30) NOT NULL,
  `department_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
);

-- employees_db.employee definition

CREATE TABLE IF NOT EXISTS `employee` (
  `id` int NOT NULL auto_increment,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `role_id` int NOT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `role` (`id`)
);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;

