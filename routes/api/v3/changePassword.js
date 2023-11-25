const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // Import bcrypt

// Define a route for changing the password
router.post('/api/v3/changePassword', async (req, res) => {
    try {
        // Access request body parameters
        const { username, newPassword } = req.body;
        const { oldPassword } = req.query; // Retrieve old password from URL query

        if (!username || !oldPassword || !newPassword) {
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

        // Retrieve the hashed password for the given username
        const [userData] = await connection.query(
            'SELECT Password FROM users WHERE Username = ?',
            [username]
        );

        if (userData.length === 0) {
            // User not found, return error
            return res.status(404).json({ result: 'error', message: 'User not found' });
        }

        // Compare the old password with the stored hashed password
        const isMatch = await bcrypt.compare(oldPassword, userData[0].Password);

        if (!isMatch) {
            // Old password doesn't match, return error
            return res.status(401).json({ result: 'error', message: 'Invalid old password' });
        }

        // Hash the new password before storing it
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // You can adjust the saltRounds as needed

        // Update the password in the 'users' table
        await connection.query(
            'UPDATE users SET Password = ? WHERE Username = ?',
            [hashedNewPassword, username]
        );

        // Release the database connection
        connection.release();

        return res.status(200).json({ result: 'success', message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ result: 'error', message: 'Unable to change password' });
    }
});

module.exports = router; // Export the router