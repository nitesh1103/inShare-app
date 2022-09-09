const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
const path = require('path');

// MongoDB Database connection.
const connectDB = require('./config/db');
connectDB();

// Middlewares.
app.use(express.static('public'));
app.use(express.json());

// Set template engine.
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Importing routes.
app.use('/api/files', require('./routes/files'));         // POST route for uploading file.
app.use('/files', require('./routes/show'));              // GET route for showing the file.
app.use('/files/download', require('./routes/download')); // GET route for download file.


app.listen(PORT, () => console.log(`Listening server on port ${PORT}`));

