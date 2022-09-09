require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
  // Database connection establishment.
  mongoose.connect(
    process.env.MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  const connection = mongoose.connection;
  connection
      .on('open', () => console.log('Database connected.'))
      .on('close', () => console.log('The goose is closed.'))
      .on('error', (err) => {
        console.log(err);
        process.exit();
      });
};

module.exports = connectDB;
