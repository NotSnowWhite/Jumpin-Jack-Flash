require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

module.exports = pool;