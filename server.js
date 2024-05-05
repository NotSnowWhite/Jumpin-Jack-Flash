const express = require('express');
const inquirer = require('inquirer');
const pool = require('./connection/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function init() {
    inquirer.prompt([
        {
            name: '',
            type: 'input',
            message: ,
        }
    ])
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
