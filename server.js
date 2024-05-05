const inquirer = require('inquirer');
const pool = require('./connection/connection');

async function init() {
    try {
        inquirer.prompt([
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
            },

        ]); 
    } catch (err) {
        console.error("An error has occurred", err)
    }
}

(async () => {
    try {
        await pool.connect();
        console.log('Connection to the database was successful!')
        init()
    } catch (error) {
        console.error(error)
    }
})();