const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    // Specify the destination directory as "public/uploads"
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

async function generateUniqueVideoId(connection) {
    try {
        const [lastVideo] = await connection.query('SELECT MAX(VideoID) AS lastVideoID FROM videos');
        let lastVideoID = lastVideo[0].lastVideoID;

        if (!lastVideoID) {
            lastVideoID = 0;
        }

        const newVideoID = lastVideoID + 1;

        return newVideoID.toString();
    } catch (error) {
        throw error;
    }
}

router.post('/', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const connection = await pool.getConnection();

        let { title, creatorUsername, creatorPassword, tags } = req.body;

        // Check if all required parameters are present
        if (title && creatorUsername && creatorPassword && tags && req.files && req.files['video'] && req.files['thumbnail']) {
            const videoFileName = req.files['video'][0].filename;
            const thumbnailFileName = req.files['thumbnail'][0].filename;

            const videoUrl = path.join('/uploads', videoFileName);
            const thumbnailUrl = path.join('/uploads', thumbnailFileName);

            const [userRows] = await connection.query('SELECT UserID, Password FROM users WHERE Username = ?', [creatorUsername]);

            if (userRows.length === 0) {
                connection.release();
                return res.status(400).json({ result: 'error', message: 'User not found' });
            }

            const { UserID, Password: storedHashedPassword } = userRows[0];
            const passwordMatch = await bcrypt.compare(creatorPassword, storedHashedPassword);

            if (passwordMatch) {
                const videoId = await generateUniqueVideoId(connection);

                await connection.query(
                    'INSERT INTO videos (VideoID, Title, Description, URL, ThumbnailURL, UserID, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                    [videoId, title, '', videoUrl, thumbnailUrl, UserID]
                );

                connection.release();
                return res.status(200).json({ result: 'success', message: 'Video uploaded successfully' });
            } else {
                connection.release();
                return res.status(400).json({ result: 'error', message: 'Invalid credentials' });
            }
        } else {
            connection.release();
            return res.status(400).json({ result: 'error', message: 'Missing required parameters' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', message: 'Unable to process the request', error: error.message });
    }
});

module.exports = router;