const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const webpages = require('./routes/defaults/webpages'); // Adjust the path as needed
app.use(webpages);

// Require and use your middleware modules here

const getVideoRecommendations = require('./routes/api/v1/getVideoRecommendations'); // Adjust the path as needed
app.use('/api/v1/getVideoRecommendations', getVideoRecommendations);

const uploadVideo = require('./routes/api/v1/uploadVideo'); // Adjust the path as needed
app.use('/api/v1/uploadVideo', uploadVideo);

const createAccount = require('./routes/api/v1/createAccount'); // Adjust the path as needed
app.use('/api/v1/createAccount', createAccount);

const recents = require('./routes/api/v1/recents'); // Adjust the path as needed
app.use(recents);

const accountAuth = require('./routes/api/v1/accountAuth'); // Adjust the path as needed
app.use(accountAuth);

const watchVideo = require('./routes/api/v1/watchVideo'); // Adjust the path as needed
app.use(watchVideo);

const loginAccount = require('./routes/api/v1/loginAccount'); // Adjust the path as needed
app.use(loginAccount);

const deleteUnusedVideos = require('./routes/api/v1/deleteUnusedVideos'); // Adjust the path as needed
app.use(deleteUnusedVideos);

// Create the HTTP server with Express.js app
const server = http.createServer(app);

const IP_ADDRESS = process.env["IP_ADDRESS"]; // Replace with your local IP
const SERVER_PORT = 3000;

server.listen(SERVER_PORT, IP_ADDRESS, () => {
  console.log(`Server is running at http://${IP_ADDRESS}:${SERVER_PORT}/`);
});
