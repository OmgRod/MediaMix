const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await support
const dotenv = require('dotenv'); // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

// Define a route for /api/api1
router.get('/', async (req, res) => {
    try {
        // Create a MySQL connection pool using environment variables
        const pool = mysql.createPool({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Attempt to connect to the database
        const connection = await pool.getConnection();
        
        // If the connection was successful, release it and send a "success" response
        connection.release();
        res.json({ result: 'success' });
    } catch (error) {
        console.error(error);
        res.json({ result: 'error', message: 'Unable to connect to the database' });
    }
});

module.exports = router;
