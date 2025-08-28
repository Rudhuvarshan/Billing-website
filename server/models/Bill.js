const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerNumber: {
        type: String,
        required: true
    },
    // This will be an array of the items purchased in the bill
    items: [{
        productNumber: { type: String, required: true },
        name: { type: String, required: true }, // <-- THIS LINE IS NOW FIXED
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discountPercentage: { type: Number, required: true },
        gstPercentage: { type: Number, required: true },
    }],
    subTotal: {
        type: Number,
        required: true,
    },
    totalDiscountValue: {
        type: Number,
        required: true
    },
    totalGstValue: {
        type: Number,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;