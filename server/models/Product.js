const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productNumber: {
    type: String,
    required: [true, 'Please add a product number'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  gstPercentage: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);