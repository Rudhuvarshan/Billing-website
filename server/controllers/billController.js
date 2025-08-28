const Bill = require('../models/Bill');

// @desc    Create a new bill
// @route   POST /api/bills/create
const createBill = async (req, res) => {
  try {
    const { 
        customerName, 
        customerNumber, 
        items, 
        subTotal, 
        totalDiscountValue,
        totalGstValue,
        grandTotal 
    } = req.body;

    // Basic validation
    if (!customerName || !customerNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please provide all required bill details' });
    }

    // Create new bill
    const bill = await Bill.create({
        customerName,
        customerNumber,
        items,
        subTotal,
        totalDiscountValue,
        totalGstValue,
        grandTotal,
    });

    res.status(201).json(bill); // 201 Created
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all bills (bill history)
// @route   GET /api/bills/history
const getBillHistory = async (req, res) => {
  try {
    // Find all bills and sort them by creation date, newest first
    const bills = await Bill.find({}).sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createBill,
  getBillHistory,
};