const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductByNumber,
  updateProduct,
  deleteProduct, // <-- Import the new function
} = require('../controllers/productController');

router.post('/add', addProduct);
router.get('/all', getAllProducts);
router.get('/:productNumber', getProductByNumber);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct); // <-- Add the new DELETE route

module.exports = router;