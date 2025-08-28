const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products/add
const addProduct = async (req, res) => {
  try {
    const { productNumber, name, price, discountPercentage, gstPercentage } = req.body;

    // Basic validation
    if (!productNumber || !name || !price) {
      return res.status(400).json({ message: 'Please provide product number, name, and price' });
    }

    // Check if product with the same number already exists
    const productExists = await Product.findOne({ productNumber });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this number already exists' });
    }

    // Create new product
    const product = await Product.create({
      productNumber,
      name,
      price,
      discountPercentage,
      gstPercentage,
    });

    res.status(201).json(product); // 201 Created
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all products
// @route   GET /api/products/all
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Find all products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
};