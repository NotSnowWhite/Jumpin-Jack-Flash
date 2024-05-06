const inquirer = require('inquirer');
const pool = require('./connection/connection');

async function init() {
    try {
        const response = await inquirer.prompt([
            {
                type: 'list',
                name: 'option',
                message: 'What would you like to do?',
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
                    console.table(result)
                })

                break;
            case 'View all roles':
                pool.query(`SELECT * FROM role`, (err, result) => {
                    if (err) {
                        console.error(err)
                    }
                    console.table(result)
                })
                break;
            case 'View all employees':
                pool.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) {
                        console.error(err)
                    }
                    console.table(result)
                })

                break;
            case 'Add a department':
                (async () => {
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

                        const department = await pool.query(`SELECT * FROM departments`);
                        console.table(department.rows)
                        console.log('A new department has been created!')
                    } catch (err) {
                        console.error(err)

                    }
                })();

                break;
            case 'Add a role':
                (async () => {
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
                        // const departmentId = parseInt(department);

                        const result = await pool.query(`INSERT INTO roles (title, salary, department_id)
                        VALUES ($1, $2, $3)`, [roleName, salary, department]);
                        const role = await pool.query(`SELECT * FROM roles`);
                        console.table(role.rows)

                    } catch (err) {
                        console.error(err)
                    }
                })();
                break;
            case 'Add an employee':

                break;
            case 'Update an employee role':

                break;
            case 'Exit':
                await pool.end()
                console.log('The connection has been severed. Goodbye.')
                break;
            default:
                console.log('Invalid option. Try again.');
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
    } //finally {
    //     await pool.end()
    //     console.log('The connection has been severed. Goodbye.')
    // }
})();