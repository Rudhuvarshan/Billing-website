const Bill = require('../models/Bill');

// @desc    Create a new bill
// @route   POST /api/bills/create
const createBill = async (req, res) => {
  const {
    customerName,
    customerNumber,
    items,
    subTotal,
    totalDiscountValue,
    totalGstValue,
    grandTotal,
  } = req.body;

  try {
    const bill = await Bill.create({
      customerName,
      customerNumber,
      items,
      subTotal,
      totalDiscountValue,
      totalGstValue,
      grandTotal,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all bills (bill history)
// @route   GET /api/bills/history
const getBillHistory = async (req, res) => {
  try {
    const bills = await Bill.find({}).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  createBill,
  getBillHistory,
};