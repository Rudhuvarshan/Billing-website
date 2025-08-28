const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log the host it connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log the error message and exit the process
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;