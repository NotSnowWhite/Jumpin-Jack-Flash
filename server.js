const inquirer = require('inquirer');
const pool = require('./connection/connection');

async function init() {
    try {
        await inquirer.prompt([
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
                ]
            }
        ]);
        switch (response.option) {
            case 'View all departments':
            pool.query(`SELECT * FROM departments`, (err, res) => {
                if (err) {
                    console.error(err)
                }
                    console.table(res)
            })
                break;
            case 'View all roles':

                break;
            case 'View all employees':

                break;
            case 'Add a department':

                break;
            case 'Add a role':

                break;
            case 'Add an employee':

                break;
                case 'Update an employee role':

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
    } catch (error) {
        console.error(error)
    } finally {
        await pool.end()
        console.log('The connection has been severed. Goodbye.')
    }
})();