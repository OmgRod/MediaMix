// Import necessary modules and dependencies
const express = require('express');

// Create an Express router
const app = express.Router();

app.get('/search', (req, res) => {
    res.render('search')
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/install/ios', (req, res) => {
    res.render('install/ios');
});

app.get('/install/android', (req, res) => {
    res.render('install/android');
});

app.get('/upload', (req, res) => {
    res.render('uploadVideo');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

module.exports = app;