import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import generateBillPDF from '../utils/generateBillPDF';

const ViewBillModal = ({ open, handleClose, bill }) => {
  if (!bill) return null; // Don't render if no bill is selected

  const handleReprint = () => {
    generateBillPDF(bill);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bill Details (ID: {bill._id})</DialogTitle>
      <DialogContent>
        {/* Customer Details */}
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="h6">Customer:</Typography>
          <Typography>Name: {bill.customerName}</Typography>
          <Typography>Phone: {bill.customerNumber}</Typography>
          <Typography>Date: {new Date(bill.createdAt).toLocaleString('en-IN')}</Typography>
        </Box>

        {/* Items Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals Section */}
        <Box sx={{ mt: 3, float: 'right', textAlign: 'right' }}>
          <Typography>Sub Total: ₹{bill.subTotal.toFixed(2)}</Typography>
          <Typography color="error">Discount: - ₹{bill.totalDiscountValue.toFixed(2)}</Typography>
          <Typography>GST: + ₹{bill.totalGstValue.toFixed(2)}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Grand Total: ₹{bill.grandTotal.toFixed(2)}
          </Typography>
        </Box>

      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleReprint} variant="contained">
          Re-print Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewBillModal;