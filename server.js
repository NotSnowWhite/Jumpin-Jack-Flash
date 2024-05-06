const inquirer = require('inquirer');
const pool = require('./connection/connection');

async function init() {
    try {
        const response = await inquirer.prompt([
            {
                type: 'list',
                name: 'option',
                message: `What would you like to do? \n`,
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ]
            }
        ]);
        switch (response.option) {
            case 'View all departments':
                pool.query(`SELECT * FROM department`, (err, result) => {
                    if (err) {
                        console.error(err)
                    }
                    console.log('\n')

                    console.table(result.rows)
                    console.log('\n')
                    init();

                })
                break;
            case 'View all roles':
                pool.query(`SELECT * FROM roles`, (err, result) => {
                    if (err) {
                        console.error(err)
                    }
                    console.log('\n')

                    console.table(result.rows)
                    console.log('\n')
                    init();

                })
                break;
            case 'View all employees':
                pool.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) {
                        console.error(err)
                    }
                    console.log('\n')

                    console.table(result.rows)
                    console.log('\n')
                    init();
                })
                break;
            case 'Add a department':
                    try {
                        const deptName = await inquirer.prompt([
                            {
                                name: 'departmentName',
                                type: 'input',
                                message: 'What department would you like to add?'
                            },
                        ])
                        const departmentName = deptName.departmentName;

                        await pool.query(`INSERT INTO department (name)
                        VALUES ($1)`, [departmentName]);

                        const department = await pool.query(`SELECT * FROM department`);
                        console.log('\n')
                        console.table(department.rows)
                        console.log('A new department has been created!')
                        console.log('\n')
                        init()
                    } catch (err) {
                        console.error(err)
                    }
                break;
            case 'Add a role':
                    try {
                        const newRole = await inquirer.prompt([
                            {
                                name: 'roleName',
                                type: 'input',
                                message: 'What is the name of the new role?'
                            },
                            {
                                name: 'salary',
                                type: 'input',
                                message: 'What is the salary amount for the new role?'
                            },
                            {
                                name: 'department',
                                type: 'input',
                                message: 'What is the department id for the new role?'
                            }
                        ])
                        const { roleName, salary, department } = newRole;

                        await pool.query(`INSERT INTO roles (title, salary, department_id)
                        VALUES ($1, $2, $3)`, [roleName, salary, department]);
                        const role = await pool.query(`SELECT * FROM roles`);
                        console.log('\n')

                        console.table(role.rows)
                        console.log('\n')
                        init()
                    } catch (err) {
                        console.error(err)
                    }
                break;
            case 'Add an employee':
                    try {
                        const newEmployee = await inquirer.prompt([
                            {
                                name: 'firstName',
                                type: 'input',
                                message: 'What is the employee\'s first name?'
                            },
                            {
                                name: 'lastName',
                                type: 'input',
                                message: 'What is the employee\'s last name?'
                            },
                            {
                                name: 'role_id',
                                type: 'input',
                                message: 'What is the employee\'s role id?'
                            },
                            {
                                name: 'manager_id',
                                type: 'input',
                                message: 'What is the manager\'s id for the new employee?'
                            }
                        ])
                        const { firstName, lastName, role_id, manager_id } = newEmployee;

                        await pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES ($1, $2, $3, $4)`, [firstName, lastName, role_id, manager_id]);
                        const employee = await pool.query(`SELECT * FROM employee`);
                        console.log('\n')

                        console.table(employee.rows)
                        console.log('\n')
                        init()
                    } catch (err) {
                        console.error(err)
                    }
                break;
            case 'Update an employee role':
                    try {
                        const employees = await pool.query('SELECT id, first_name, last_name, role_id FROM employee');
                        const employeeInfo = employees.rows.map(person => ({ value: person.id, name: `${person.first_name} ${person.last_name}`, role: person.role_id }));

                        const updateRole = await inquirer.prompt([
                            {
                                name: 'employeeRole',
                                type: 'list',
                                message: 'Which employee\'s role do you want to update?',
                                choices: employeeInfo,
                            }
                        ])
                        const selectedEmployee = employeeInfo.find(employee => employee.value === updateRole.employeeRole);
                        const roleIdToUpdate = selectedEmployee.role;

                        const newRoleInfo = await inquirer.prompt([
                            {
                                name: 'title',
                                type: 'input',
                                message: 'Enter the employee\'s new role title:',
                            },
                            {
                                name: 'salary',
                                type: 'input',
                                message: 'Enter the employee\'s new role salary:',
                            },
                            {
                                name: 'department_id',
                                type: 'input',
                                message: 'Enter the employee\'s new role department ID:',
                            },
                        ]);

                        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleIdToUpdate, selectedEmployee.value]);
                        await pool.query('UPDATE roles SET title = $1, salary = $2, department_id = $3 WHERE id = $4', [
                            newRoleInfo.title,
                            newRoleInfo.salary,
                            newRoleInfo.department_id,
                            roleIdToUpdate,
                        ]);
                        console.log('Employee role updated successfully.');
                        init()
                    } catch (err) {
                        console.error(err, "Problem updating employee role.")
                    }
                break;
            case 'Exit':
                try {
                    console.log('The connection has been severed. Goodbye.');
                    process.exit(0); //end nodejs process and close the connection with success
                } catch (err) {
                    console.error(err, "Problem exiting the database.");
                }

                break;
            default:
                console.log('Invalid option. Try again.');
                console.log('\n')
                init();
                break;
        }
    } catch (err) {
        console.error("An error has occurred", err)
    }
};

(async () => {
    try {
        await pool.connect();
        console.log('Connection to the database was successful!')
        await init()
    } catch (err) {
        console.error(err)
    }
})();