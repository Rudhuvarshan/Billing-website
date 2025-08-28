const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductByNumber } = require('../controllers/productController');

// POST /api/products/add
router.post('/add', addProduct);

// GET /api/products/all
router.get('/all', getAllProducts);

// GET /api/products/:productNumber
// The ":" makes "productNumber" a URL parameter
router.get('/:productNumber', getProductByNumber); // <-- ADD THIS NEW ROUTE

module.exports = router;