const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// New API endpoint for deleting unused videos and thumbnails
router.get('/api/v1/deleteUnusedVideos', async (req, res) => {
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

// Fetch all videos and thumbnails from the folder
const filesInFolder = await fs.readdir('public/uploads');

// Fetch all video and thumbnail URLs from the database
const [videoRows] = await connection.query('SELECT URL, ThumbnailURL FROM videos');

const allVideoUrls = videoRows.map((row) => '/uploads/' + path.basename(row.URL));
const allThumbnailUrls = videoRows.map((row) => '/uploads/' + path.basename(row.ThumbnailURL));
const allUrls = [...allVideoUrls, ...allThumbnailUrls];

console.log('All video URLs from the database:', allVideoUrls);
console.log('All thumbnail URLs from the database:', allThumbnailUrls);

// Identify files in the folder that do not have a corresponding URL in the database
const filesToDelete = filesInFolder.filter((file) => !allUrls.includes('/uploads/' + file));

for (const fileToDelete of filesToDelete) {
    const filePath = path.join('public/uploads', fileToDelete);

    // Log which files are identified for deletion
    console.log(`Deleting file: ${fileToDelete}`);

    try {
        await fs.unlink(filePath);
        console.log(`File deleted successfully: ${fileToDelete}`);
    } catch (deleteError) {
        console.error(`Error deleting file: ${fileToDelete}`, deleteError);
    }
}

        connection.release();
        return res.status(200).json({ result: 'success', message: 'Unused videos and thumbnails deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', message: 'Unable to process the request', error: error.message });
    }
});

module.exports = router;