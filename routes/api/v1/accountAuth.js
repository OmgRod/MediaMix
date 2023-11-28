// // Import necessary modules and dependencies
// const express = require('express');
// const mysql = require('mysql2/promise'); // Using 'mysql2/promise' for async/await support
// const bcrypt = require('bcrypt');

// // Create an Express router
// const router = express.Router();

// // Define the route for account authentication
// router.get('/api/v1/accountAuth', async (req, res) => {
//     try {
//         const { username, password } = req.query;

//         // Create a MySQL connection pool using environment variables
//         const pool = mysql.createPool({
//             host: process.env.DB_HOSTNAME,
//             user: process.env.DB_USERNAME,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME,
//         });

//         console.log('Creating database connection pool...');
//         // Attempt to connect to the database
//         const connection = await pool.getConnection();
//         console.log('Database connection established.');

//         // Query the database to find the user by username
//         const [userData] = await connection.query('SELECT * FROM users WHERE Username = ?', [username]);

//         if (userData.length === 0) {
//             // User not found in the database
//             connection.release();
//             return res.json({ result: 'error', message: 'User not found' });
//         }

//         // Get the hashed password from the database
//         const hashedPassword = userData[0].Password;

//         // Use bcrypt's compare function to check if the provided password matches the hashed password
//         const passwordMatch = await bcrypt.compare(password, hashedPassword);

//         if (passwordMatch) {
//             // Authentication was successful
//             connection.release();
//             return res.json({ result: 'success', message: 'Authentication successful' });
//         } else {
//             // Authentication failed
//             connection.release();
//             return res.json({ result: 'error', message: 'Authentication failed' });
//         }
//     } catch (error) {
//         console.error('Error:', error.message); // Log the error message
//         res.status(500).json({ result: 'error', message: error.message });
//     }
// });

// // Export the router for use in your main application file
// module.exports = router;
