const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
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

router.post('/api/v3/setUserProfilePicture', upload.single('pfp'), async (req, res) => {
    try {
        const { username, password } = req.body;
        const { originalname: pfpFileName } = req.file;

        if (!username || !password || !pfpFileName) {
            return res.status(400).json({ result: 'error', message: 'Missing required parameters' });
        }

        const pool = mysql.createPool({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const connection = await pool.getConnection();

        const [userRows] = await connection.query('SELECT UserID, Password FROM users WHERE Username = ?', [username]);

        if (userRows.length === 0) {
            connection.release();
            return res.status(400).json({ result: 'error', message: 'User not found' });
        }

        const { UserID, Password: storedHashedPassword } = userRows[0];
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (passwordMatch) {
            await connection.query(
                'UPDATE users SET ProfilePicture = ? WHERE UserID = ?',
                [`pfp-${UserID}`, UserID]
            );

            connection.release();
            return res.status(200).json({ result: 'success', message: 'Profile picture updated successfully' });
        } else {
            connection.release();
            return res.status(400).json({ result: 'error', message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ result: 'error', message: 'Unable to update profile picture' });
    }
});

module.exports = router;