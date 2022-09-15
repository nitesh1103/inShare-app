const express = require('express');
const app = express();
const ejs = require('ejs');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// MongoDB Database connection.
const connectDB = require('./config/db');
connectDB();

// Cors config.
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(',')
  // ['http://localhost:3000' 'http://localhost:5000' 'http://localhost:8000']
};
app.use(cors(corsOptions));

// Middlewares.
app.use(express.static('public'));
app.use(express.json());

// Set template engine.
app.use(expressEjsLayouts);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Importing routes.
app.use('/', require('./routes/home'));                   // GET route for home page.
app.use('/api/files', require('./routes/files'));         // POST routes for upload & email file.
app.use('/files', require('./routes/show'));              // GET route for show file.
app.use('/files/download', require('./routes/download')); // GET route for download file.


app.listen(PORT, () => console.log(`Listening server on port ${PORT}`));

