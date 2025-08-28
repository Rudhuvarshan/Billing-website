const express = require('express');
const router = express.Router();
const { createBill, getBillHistory } = require('../controllers/billController');

// Define the route for creating a bill
// This will correspond to the URL: POST /api/bills/create
router.post('/create', createBill);

// Define the route for getting the bill history
// This will correspond to the URL: GET /api/bills/history
router.get('/history', getBillHistory);

module.exports = router;