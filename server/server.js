const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // <--- CHECK THIS LINE

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Billing Application API is running...');
});

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // <--- AND CHECK THIS LINE

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});