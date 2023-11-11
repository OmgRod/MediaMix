const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await support
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Specify the destination directory as "public/uploads"
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

// Function to generate a unique video ID
async function generateUniqueVideoId(connection) {
    try {
        // Get the last inserted video ID from the 'videos' table
        const [lastVideo] = await connection.query('SELECT MAX(VideoID) AS lastVideoID FROM videos');
        let lastVideoID = lastVideo[0].lastVideoID;

        if (!lastVideoID) {
            // If no videos are in the database yet, start from 1
            lastVideoID = 0;
        }

        // Increment the last video ID by 1
        const newVideoID = lastVideoID + 1;

        return newVideoID.toString(); // Convert to a string to match your current video ID format
    } catch (error) {
        throw error;
    }
}

// Define a route for handling video uploads
router.post('/', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
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

        // Generate a unique video ID
        const videoId = await generateUniqueVideoId(connection);

        // Check if required parameters are provided in the request
        let { title, creatorUsername, creatorPassword } = req.body;

        if (!title || !creatorUsername || !creatorPassword) {
            connection.release();
            // Return an error response with details
            return res.status(400).json({ result: 'error', message: 'Missing required parameters' });
        }

        // Check if video and thumbnail files were uploaded
        if (!req.files || !req.files['video'] || !req.files['thumbnail']) {
            connection.release();
            // Return an error response with details
            return res.status(400).json({ result: 'error', message: 'Video and thumbnail files are required' });
        }

        // Get the file names of the uploaded video and thumbnail
        const videoFileName = req.files['video'][0].filename;
        const thumbnailFileName = req.files['thumbnail'][0].filename;

        // Construct the video and thumbnail URLs
        const videoUrl = path.join('/uploads', videoFileName);
        const thumbnailUrl = path.join('/uploads', thumbnailFileName);

        // Here, you should fetch the actual UserID based on creatorUsername
        const [userRows] = await connection.query('SELECT UserID, Password FROM users WHERE Username = ?', [creatorUsername]);

        if (userRows.length === 0) {
            connection.release();
            // Return an error response if the user does not exist
            return res.status(400).json({ result: 'error', message: 'User not found' });
        }

        const { UserID, Password: storedHashedPassword } = userRows[0];

        // Compare the entered password with the stored hashed password using bcrypt
        const passwordMatch = await bcrypt.compare(creatorPassword, storedHashedPassword);

        if (passwordMatch) {
            // Passwords match, allow video upload
            // Insert video information into the 'videos' table
            await connection.query(
                'INSERT INTO videos (VideoID, Title, Description, URL, ThumbnailURL, UserID, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [videoId, title, '', videoUrl, thumbnailUrl, UserID]
            );

            // Release the database connection
            connection.release();

            // Redirect to the specified URL on success
            return res.redirect("/");
        } else {
            // Passwords do not match, deny video upload
            connection.release();
            return res.status(400).json({ result: 'error', message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        // Return an error response with details
        return res.status(500).json({ result: 'error', message: 'Unable to process the request', error: error.message });
    }
});

module.exports = router;
