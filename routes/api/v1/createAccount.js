const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // Import bcrypt

// Define a route for creating an account
router.post('/', async (req, res) => {
    try {
        // Access request body parameters
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ result: 'error', message: 'Missing required parameters' });
        }

        // Create a MySQL connection pool using environment variables
        const pool = mysql.createPool({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Attempt to connect to the database
        const connection = await pool.getConnection();

        // Check if the username or email already exists in the database
        const [existingUser] = await connection.query(
            'SELECT * FROM users WHERE Username = ? OR Email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            // User with the same username or email already exists, redirect to /signup
            return res.redirect('/signup');
        } else {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the saltRounds as needed

            // Insert user information into the 'users' table
            await connection.query(
                'INSERT INTO users (Username, Email, Password, CreatedAt) VALUES (?, ?, ?, NOW())',
                [username, email, hashedPassword]
            );

            // Release the database connection
            connection.release();

            // Redirect to the login URL with username and unhashed_password as query parameters
            return res.redirect(`/login?username=${username}&password=${password}`);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ result: 'error', message: 'Unable to create an account' });
    }
});

module.exports = router; // Export the router
