import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { downloadBillPDF } from '../utils/generateBillPDF';
import BackToHomeButton from '../components/BackToHomeButton';

const BillingPage = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [productNumberInput, setProductNumberInput] = useState('');
  const [foundProduct, setFoundProduct] = useState(null);
  const [quantityInput, setQuantityInput] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [totals, setTotals] = useState({ subTotal: 0, discount: 0, gst: 0, grandTotal: 0 });

  useEffect(() => {
    let subTotal = 0, totalDiscount = 0, totalGst = 0;
    billItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subTotal += itemTotal;
      const itemDiscount = itemTotal * (item.discountPercentage / 100);
      totalDiscount += itemDiscount;
      const priceAfterDiscount = itemTotal - itemDiscount;
      totalGst += priceAfterDiscount * (item.gstPercentage / 100);
    });
    const grandTotal = subTotal - totalDiscount + totalGst;
    setTotals({ subTotal, discount: totalDiscount, gst: totalGst, grandTotal });
  }, [billItems]);

  const handleFindProduct = async () => {
    if (!productNumberInput) return alert('Please enter a product number.');
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${productNumberInput}`);
      setFoundProduct(data);
    } catch (error) {
      setFoundProduct(null);
      alert('Product not found.');
    }
  };

  const handleAddItemToBill = () => {
    if (!foundProduct) return alert('Please find a product first.');
    if (quantityInput <= 0) return alert('Quantity must be at least 1.');
    const newItem = { ...foundProduct, quantity: quantityInput };
    setBillItems(prevItems => [...prevItems, newItem]);
    setProductNumberInput('');
    setFoundProduct(null);
    setQuantityInput(1);
  };

  const handleRemoveItem = (indexToRemove) => {
    setBillItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };
  
  const resetBillingPage = () => {
    setCustomerName(''); setCustomerNumber(''); setBillItems([]);
    setProductNumberInput(''); setFoundProduct(null); setQuantityInput(1);
  };
  
  const handleGenerateBill = async () => {
    if (!customerName || !customerNumber) return alert('Please enter customer name and number.');
    if (billItems.length === 0) return alert('Please add at least one item to the bill.');

    const billData = {
      customerName, customerNumber,
      items: billItems.map(({ _id, name, quantity, price, discountPercentage, gstPercentage, productNumber }) => ({ productId: _id, name, quantity, price, discountPercentage, gstPercentage, productNumber })),
      subTotal: totals.subTotal, totalDiscountValue: totals.discount,
      totalGstValue: totals.gst, grandTotal: totals.grandTotal,
    };

    try {
      await axios.post('http://localhost:5000/api/bills/create', billData);
      downloadBillPDF(billData);
      alert('Bill generated and saved successfully!');
      resetBillingPage();
    } catch (error) {
      console.error('Failed to generate bill:', error);
      alert('Failed to generate bill. Please try again.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <BackToHomeButton />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mt: 2 }}>
          Billing
        </Typography>
        <Grid container spacing={4}>
          <Grid xs={12} md={5}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>Customer Details</Typography>
              <TextField label="Customer Name" fullWidth margin="normal" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <TextField label="Customer Number" fullWidth margin="normal" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} />
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>Add Item</Typography>
              <TextField label="Enter Product Number" fullWidth margin="normal" value={productNumberInput} onChange={(e) => setProductNumberInput(e.target.value.toUpperCase())} />
              <Button variant="contained" onClick={handleFindProduct} sx={{ mt: 1 }}>Find Product</Button>
              {foundProduct && <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', borderRadius: 2, backgroundColor: '#e3f2fd' }}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{foundProduct.name}</Typography><Typography variant="body2">Price: ₹{foundProduct.price.toFixed(2)}</Typography><Typography variant="body2">Discount: {foundProduct.discountPercentage}%</Typography></Box>}
              <TextField label="Quantity" type="number" fullWidth margin="normal" value={quantityInput} onChange={(e) => setQuantityInput(parseInt(e.target.value))} InputProps={{ inputProps: { min: 1 } }} />
              <Button variant="contained" color="secondary" onClick={handleAddItemToBill} sx={{ mt: 1 }} disabled={!foundProduct}>Add to Bill</Button>
            </Paper>
          </Grid>
          <Grid xs={12} md={7}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>Current Bill</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No items added yet</TableCell>
                      </TableRow>
                    ) : (
                      billItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ pr: 2 }}>
                  <Typography variant="h6" align="right">Subtotal: ₹{totals.subTotal.toFixed(2)}</Typography>
                  <Typography variant="body1" align="right" color="textSecondary">Discount: - ₹{totals.discount.toFixed(2)}</Typography>
                  <Typography variant="body1" align="right" color="textSecondary">GST: + ₹{totals.gst.toFixed(2)}</Typography>
                  <Typography variant="h5" align="right" sx={{ mt: 2, fontWeight: 'bold' }}>Grand Total: ₹{totals.grandTotal.toFixed(2)}</Typography>
              </Box>
              <Button variant="contained" size="large" fullWidth onClick={handleGenerateBill} sx={{ mt: 3 }}>
                Generate Bill & Download PDF
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BillingPage;