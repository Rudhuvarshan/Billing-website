const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products/add
const addProduct = async (req, res) => {
  try {
    const { productNumber, name, price, discountPercentage, gstPercentage } = req.body;
    if (!productNumber || !name || !price) {
      return res.status(400).json({ message: 'Please provide product number, name, and price' });
    }
    const productExists = await Product.findOne({ productNumber });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this number already exists' });
    }
    const product = await Product.create({ productNumber, name, price, discountPercentage, gstPercentage });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all products
// @route   GET /api/products/all
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get a single product by its number
// @route   GET /api/products/:productNumber
const getProductByNumber = async (req, res) => {
  try {
    const product = await Product.findOne({ productNumber: req.params.productNumber });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  getProductByNumber, // <-- Make sure to export the new function
};