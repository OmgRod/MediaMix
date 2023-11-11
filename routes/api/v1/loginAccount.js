// Import necessary modules and dependencies
const express = require('express');
const mysql = require('mysql2/promise'); // Using 'mysql2/promise' for async/await support
const bcrypt = require('bcrypt');

// Create an Express router
const router = express.Router();

// Define the route for logging in
router.get('/api/v1/loginAccount', async (req, res) => {
    try {
        // Create a MySQL connection pool using environment variables
        const pool = mysql.createPool({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Creating database connection pool...');
        // Attempt to connect to the database
        const connection = await pool.getConnection();
        console.log('Database connection established.');

        // Extract username and password from URL parameters
        const username = req.query.username;
        const password = req.query.password;

        if (!username || !password) {
            connection.release();
            return res.status(400).json({ result: 'error', message: 'Missing username or password' });
        }

        // Query the database to check if the username exists
        const [userRows] = await connection.query('SELECT * FROM users WHERE Username = ?', [username]);

        // Check if the username exists
        if (userRows.length === 0) {
            connection.release();
            return res.status(401).json({ result: 'error', message: 'Username not found' });
        }

        // Get the user's hashed password from the database
        const hashedPassword = userRows[0].Password;

        // Compare the provided password with the hashed password
        const match = await bcrypt.compare(password, hashedPassword);

        if (match) {
            // Passwords match, send a success response with the username and hashed password
            connection.release();
            return res.status(200).json({
                result: 'success',
                username: username,
                hashedPassword: hashedPassword,
            });
        } else {
            // Passwords do not match, render an error view with the error message
            connection.release();
            return res.status(401).json({ result: 'error', message: 'Authentication failed' });
        }
    } catch (error) {
        console.error('Error:', error.message); // Log the error message
        res.status(500).json({ result: 'error', message: error.message });
    }
});

// Export the router for use in your main application file
module.exports = router;
