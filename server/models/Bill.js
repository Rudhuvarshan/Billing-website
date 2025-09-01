const mongoose = require('mongoose');

// This is a "sub-schema" that defines the structure of a single item within a bill.
const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  gstPercentage: {
    type: Number,
    default: 0,
  },
}, { _id: false });


// This is the main schema for the entire bill.
const billSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerNumber: {
    type: String,
    required: true,
    trim: true,
  },
  items: [itemSchema],
  subTotal: {
    type: Number,
    required: true,
  },
  totalDiscountValue: {
    type: Number,
    required: true,
  },
  totalGstValue: {
    type: Number,
    required: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

// THIS IS THE MOST IMPORTANT LINE. It takes the schema and creates a usable model.
module.exports = mongoose.model('Bill', billSchema);