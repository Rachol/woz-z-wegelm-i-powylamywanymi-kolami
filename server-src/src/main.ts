import { DatabaseConfig } from './config/database';
import { PassportConfig } from './config/passport';
import { UserRoutes } from './routes/user';
import {FileRoutes} from "./routes/file";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// Port Numbers
const port = 3001;

// Connect To Database
mongoose.connect(DatabaseConfig.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + DatabaseConfig.database);
});

// On Error
mongoose.connection.on('error', (err: any) => {
    console.log('Database error: ' + err);
});

//Initialize Express app
const app = express();

app.use(function (req: any, res: any, next: any) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// CORS Middleware
app.use(cors(corsOptions));


// Set Static Folder ( Angular 2 files)
app.use(express.static(path.join(__dirname, '../../public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
PassportConfig.configure(passport);

//Use /users for all the user routes
app.use('/users', new UserRoutes().getRouter());
app.use('/files', new FileRoutes().getRouter());

// Index Route
app.get('/', (req: any, res: any) => {
    res.send('Invalid Endpoint');
});

// All Other Routes
app.get('*', (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});