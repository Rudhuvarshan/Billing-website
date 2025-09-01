const Product = require('../models/Product');

// ... addProduct, getAllProducts, getProductByNumber, updateProduct functions are the same ...
const addProduct = async (req, res) => {
  const { productNumber, name, price, discountPercentage, gstPercentage } = req.body;
  try {
    const productExists = await Product.findOne({ productNumber });
    if (productExists) { return res.status(400).json({ message: 'Product with this number already exists' }); }
    const product = await Product.create({ productNumber, name, price, discountPercentage, gstPercentage });
    if (product) { res.status(201).json(product); } else { res.status(400).json({ message: 'Invalid product data' }); }
  } catch (error) { res.status(500).json({ message: `Server Error: ${error.message}` }); }
};
const getAllProducts = async (req, res) => {
  try { const products = await Product.find({}).sort({ createdAt: -1 }); res.json(products); } catch (error) { res.status(500).json({ message: `Server Error: ${error.message}` }); }
};
const getProductByNumber = async (req, res) => {
  try {
    const product = await Product.findOne({ productNumber: req.params.productNumber.toUpperCase() });
    if (product) { res.json(product); } else { res.status(404).json({ message: 'Product not found' }); }
  } catch (error) { res.status(500).json({ message: `Server Error: ${error.message}` }); }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.discountPercentage = req.body.discountPercentage ?? product.discountPercentage;
      product.gstPercentage = req.body.gstPercentage ?? product.gstPercentage;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else { res.status(404).json({ message: 'Product not found' }); }
  } catch (error) { res.status(500).json({ message: `Server Error: ${error.message}` }); }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
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
  getProductByNumber,
  updateProduct,
  deleteProduct, // <-- Export the new function
};