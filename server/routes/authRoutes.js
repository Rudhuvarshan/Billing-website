const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Define the route for user registration
// This will correspond to the URL: POST /api/auth/register
router.post('/register', registerUser);

// Define the route for user login
// This will correspond to the URL: POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;