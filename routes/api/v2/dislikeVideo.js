// Import necessary modules and dependencies
const express = require('express');
const mysql = require('mysql2/promise'); // Using 'mysql2/promise' for async/await support
const bcrypt = require('bcrypt');

// Create an Express router
const router = express.Router();

// Define the route for disliking videos
router.get('/api/v2/dislikeVideo', async (req, res) => {
    try {
        // Get the video ID, username, and password from the query parameters
        const videoId = req.query.v;
        const username = req.query.username;
        const password = req.query.password;

        // Create a MySQL connection pool using environment variables
        const pool = mysql.createPool({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Attempt to connect to the database
        const connection = await pool.getConnection();

        // Retrieve user details (including password hash) from the database
        const [userRows] = await connection.query('SELECT UserID, Password FROM users WHERE Username = ?', [username]);

        // Check if the user exists
        if (userRows.length === 0) {
            connection.release();
            return res.status(404).json({ result: 'error', message: 'User not found' });
        }

        const user = userRows[0];

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            connection.release();
            return res.status(401).json({ result: 'error', message: 'Invalid credentials' });
        }

        // Retrieve video details from the database, including the title and views
        const [videoRows] = await connection.query('SELECT VideoID, Title, URL, Views FROM videos WHERE VideoID = ?', [videoId]);

        // Check if the video exists
        if (videoRows.length === 0) {
            connection.release();
            return res.status(404).json({ result: 'error', message: 'Video not found' });
        }

        const video = videoRows[0];

        // Check if the user has already disliked the video
        const [dislikeRows] = await connection.query('SELECT * FROM dislikes WHERE VideoID = ? AND UserID = ?', [videoId, user.UserID]);

        let isDisliked = false;
        if (dislikeRows.length > 0) {
            isDisliked = true;
        }

        // Logic to handle disliking/undisliking based on the current state
        if (!isDisliked) {
            // If the user hasn't disliked the video, add a dislike
            await connection.query('INSERT INTO dislikes (UserID, VideoID, CreatedAt) VALUES (?, ?, NOW())', [user.UserID, videoId]);

            // Increase the dislikes count in the videos table
            await connection.query('UPDATE videos SET dislikes = dislikes + 1 WHERE VideoID = ?', [videoId]);

            isDisliked = true; // Set isDisliked to true after disliking the video
        } else {
            // If the user has already disliked the video, remove the dislike (undislike)
            await connection.query('DELETE FROM dislikes WHERE VideoID = ? AND UserID = ?', [videoId, user.UserID]);

            // Decrease the dislikes count in the videos table
            await connection.query('UPDATE videos SET dislikes = dislikes - 1 WHERE VideoID = ?', [videoId]);

            isDisliked = false; // Set isDisliked to false after undisliking the video
        }

        // Release the database connection
        connection.release();

        // Send response indicating the current state of disliking
        return res.status(200).json({ result: 'success', message: `${isDisliked ? 1 : 0}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: 'Unable to process the request' });
    }
});

// Export the router for use in your main application file
module.exports = router;