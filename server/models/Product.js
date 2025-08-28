const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productNumber: {
    type: String,
    required: true,
    unique: true, // This is the ID you will type to find a product
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 0, // Defaults to 0 if not provided
  },
  gstPercentage: {
    type: Number,
    default: 0, // Defaults to 0 if not provided
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;