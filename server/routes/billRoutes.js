const express = require('express');
const router = express.Router();
const { createBill, getBillHistory } = require('../controllers/billController');

// @route   POST /api/bills/create
// @desc    Create a new bill
router.post('/create', createBill);

// @route   GET /api/bills/history
// @desc    Get all bills for the history page
router.get('/history', getBillHistory);


module.exports = router;