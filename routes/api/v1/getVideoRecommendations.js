const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fastLevenshtein = require('fast-levenshtein');

// Load environment variables from .env file
require('dotenv').config();

// Function to recommend videos based on similar titles and watch history
async function recommendVideosBasedOnHistory(userId, connection) {
    try {
        // Fetch watch history for the given user from the database
        const [historyRows] = await connection.execute(
            `SELECT videos.VideoID, videos.Title
             FROM watch_history
             JOIN videos ON watch_history.VideoID = videos.VideoID
             WHERE watch_history.UserID = ?`,
            [userId]
        );

        if (!historyRows || historyRows.length === 0) {
            return []; // If no watch history found, return an empty array
        }

        // Get all video titles in the database
        const [allVideosRows] = await connection.execute(
            'SELECT VideoID, Title FROM videos'
        );

        const allVideoTitles = allVideosRows.map(row => row.Title);

        // Calculate similarity scores for each video based on watch history
        const videoRecommendations = allVideoTitles.map(title => ({
            title,
            similarity: fastLevenshtein.get(title, historyRows.map(row => row.Title).join(' ')), // Compare with concatenated watched titles
        }));

        // Sort videos by similarity (high to low)
        videoRecommendations.sort((a, b) => a.similarity - b.similarity);

        // Extract recommended video titles
        const recommendedVideos = videoRecommendations.map(video => video.title);

        return recommendedVideos;
    } catch (error) {
        throw error;
    }
}

router.get('/api/v2/getRecommendations', async (req, res) => {
    const userId = req.query.uid; // Fetch user ID from query parameter
    console.log('Received request for recommendations. User ID:', userId);

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

        // Call function to recommend videos based on user's watch history
        const recommendedVideos = await recommendVideosBasedOnHistory(userId, connection);

        // Release the connection
        connection.release();

        // Return recommendations as JSON response
        res.json({ recommendedVideos });
    } catch (error) {
        console.error(error);
        res.json({ result: 'error', message: 'Failed to fetch recommendations' });
    }
});

// The existing route for the database connection remains unchanged

module.exports = router;