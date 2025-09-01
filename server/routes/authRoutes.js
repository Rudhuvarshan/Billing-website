const express = require('express');
const router = express.Router();
// Import both functions from the controller
const { registerUser, loginUser } = require('../controllers/authController');

// Route for registering a new user
// POST /api/auth/register
router.post('/register', registerUser);

// Route for logging a user in
// POST /api/auth/login
router.post('/login', loginUser);


module.exports = router;