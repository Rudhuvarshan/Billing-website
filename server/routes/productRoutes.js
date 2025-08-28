const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts } = require('../controllers/productController');

// This line defines the POST method for the '/add' path
router.post('/add', addProduct); // <--- CHECK THIS LINE

// This line defines the GET method for the '/all' path
router.get('/all', getAllProducts);

module.exports = router;