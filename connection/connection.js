require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

(async () => {
    try {
        await client.connect()
        console.log('Connection to the database was successful!')
    } catch (error) {
        console.error(error)
    } finally {
        await client.end()
        console.log('Connection to the database has ended.')
    }
})();
