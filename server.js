const express = require('express');
const inquirer = require('inquirer');
const connection = require('./connection/connection');

const app = express();
const PORT = process.env.PORT || PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Listening on port http://www.localhost:${PORT}`)
})
