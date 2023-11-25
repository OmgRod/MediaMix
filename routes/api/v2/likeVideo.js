// Import necessary modules and dependencies
const express = require('express');
const mysql = require('mysql2/promise'); // Using 'mysql2/promise' for async/await support
const bcrypt = require('bcrypt');

// Create an Express router
const router = express.Router();

// Define the route for liking videos
router.get('/api/v2/likeVideo', async (req, res) => {
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

        // Check if the user has already liked the video
        const [likeRows] = await connection.query('SELECT * FROM likes WHERE VideoID = ? AND UserID = ?', [videoId, user.UserID]);

        let isLiked = false;
        if (likeRows.length > 0) {
            isLiked = true;
        }

        // Logic to handle liking/unliking based on the current state
        if (!isLiked) {
            // If the user hasn't liked the video, add a like
            await connection.query('INSERT INTO likes (UserID, VideoID, IsLike, CreatedAt) VALUES (?, ?, ?, NOW())', [user.UserID, videoId, 1]);

            // Increase the likes count in the videos table
            await connection.query('UPDATE videos SET likes = likes + 1 WHERE VideoID = ?', [videoId]);

            isLiked = true; // Set isLiked to true after liking the video
        } else {
            // If the user has already liked the video, remove the like (unlike)
            await connection.query('DELETE FROM likes WHERE VideoID = ? AND UserID = ?', [videoId, user.UserID]);

            // Decrease the likes count in the videos table
            await connection.query('UPDATE videos SET likes = likes - 1 WHERE VideoID = ?', [videoId]);

            isLiked = false; // Set isLiked to false after unliking the video
        }

        // Release the database connection
        connection.release();

        // Send response indicating the current state of liking
        return res.status(200).json({ result: 'success', message: `${isLiked ? 1 : 0}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: 'Unable to process the request' });
    }
});

// Export the router for use in your main application file
module.exports = router;