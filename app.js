// Import Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// Database Configuration
const config = require('./config/database');

//User Routes
const users = require('./routes/users')

// Port Numbers
const port = 3001;

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

//Initialize Express app
const app = express();

// CORS Middleware
app.use(cors());

// Set Static Folder ( Angulat 2 files)
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

//Use /users for all the user routes
app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
})

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
})