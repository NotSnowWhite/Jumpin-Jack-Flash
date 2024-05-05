const express = require('express');
const inquirer = require('inquirer');
const pool = require('./connection/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

        ]); init()
    } catch (err) {
        console.error("An error has occurred", err)
    }
}

(async () => {
    try {
        await pool.connect();
        console.log('Connection to the database was successful!')
    } catch (error) {
        console.error(error)
    }
})();

app.listen(PORT, () => {
    console.log(`Listening on port http://www.localhost:${PORT}`)
})
