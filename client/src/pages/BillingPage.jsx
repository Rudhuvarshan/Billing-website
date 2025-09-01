import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Paper, Grid, TextField, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import generateBillPDF from '../utils/generateBillPDF'; // <-- IMPORT THE PDF GENERATOR

const BillingPage = () => {
  // ... All the state and functions from the previous step are the same ...
  const [allProducts, setAllProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => { const fetchAllProducts = async () => { try { const { data } = await axios.get('http://localhost:5000/api/products/all'); setAllProducts(data); } catch (error) { console.error('Failed to fetch products', error); } }; fetchAllProducts(); }, []);
  const calculateTotals = useCallback(() => { let sub = 0, discount = 0, gst = 0; billItems.forEach(item => { const iTotal = item.price * item.quantity; sub += iTotal; discount += iTotal * (item.discountPercentage / 100); gst += (iTotal - (iTotal * (item.discountPercentage / 100))) * (item.gstPercentage / 100); }); setSubTotal(sub); setTotalDiscount(discount); setTotalGst(gst); setGrandTotal(sub - discount + gst); }, [billItems]);
  useEffect(() => { calculateTotals(); }, [billItems, calculateTotals]);

  const handleProductSelect = (event, selectedProduct) => { if (selectedProduct) { const isAlreadyInBill = billItems.some(item => item._id === selectedProduct._id); if (isAlreadyInBill) return; const newItem = { ...selectedProduct, quantity: 1 }; setBillItems([...billItems, newItem]); } };
  const handleQuantityChange = (productId, newQuantity) => { const updatedItems = billItems.map(item => item._id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item); setBillItems(updatedItems); };
  const handleRemoveItem = (productId) => { setBillItems(billItems.filter(item => item._id !== productId)); };
  const resetBillingPage = () => { setCustomerName(''); setCustomerNumber(''); setBillItems([]); };

  const handleGenerateBill = async () => {
    if (!customerName.trim() || !customerNumber.trim()) { return toast.error('Please enter customer name and phone number.'); }
    if (billItems.length === 0) { return toast.error('Please add at least one item to the bill.'); }

    const billData = { customerName, customerNumber, items: billItems.map(item => ({ productId: item._id, productNumber: item.productNumber, name: item.name, quantity: item.quantity, price: item.price, discountPercentage: item.discountPercentage, gstPercentage: item.gstPercentage, })), subTotal, totalDiscountValue: totalDiscount, totalGstValue: totalGst, grandTotal, };

    try {
      const { data: savedBill } = await axios.post('http://localhost:5000/api/bills/create', billData);
      
      toast.success('Bill generated successfully!');
      
      // --- CALL THE PDF GENERATOR HERE ---
      generateBillPDF(savedBill);
      // ------------------------------------

      resetBillingPage();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate bill.');
    }
  };

  return (
    // ... The JSX for the page is exactly the same as the previous step ...
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}><Container maxWidth="xl"><Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><ArrowBackIcon sx={{ mr: 1 }} /> Back to Dashboard</Link><Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Create New Bill</Typography><Grid container spacing={3}><Grid item xs={12} md={8}><Paper sx={{ p: 2, mb: 2 }}><Grid container spacing={2}><Grid item xs={12} sm={6}><TextField label="Customer Name" fullWidth value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></Grid><Grid item xs={12} sm={6}><TextField label="Customer Phone Number" fullWidth value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} /></Grid></Grid></Paper><Paper sx={{ p: 2 }}><Autocomplete options={allProducts} getOptionLabel={(option) => `${option.productNumber} - ${option.name}`} onChange={handleProductSelect} renderInput={(params) => <TextField {...params} label="Search and Add Product..." />} value={null} /><TableContainer sx={{ mt: 2 }}><Table><TableHead><TableRow><TableCell>Product</TableCell><TableCell align="center">Qty</TableCell><TableCell align="right">Price</TableCell><TableCell align="right">Total</TableCell><TableCell align="center">Action</TableCell></TableRow></TableHead><TableBody>{billItems.map(item => (<TableRow key={item._id}><TableCell>{item.name}</TableCell><TableCell align="center"><TextField type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))} sx={{ width: '80px' }} inputProps={{ min: 1 }} /></TableCell><TableCell align="right">₹{item.price.toFixed(2)}</TableCell><TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell><TableCell align="center"><IconButton onClick={() => handleRemoveItem(item._id)} color="error"><DeleteIcon /></IconButton></TableCell></TableRow>))}</TableBody></Table></TableContainer></Paper></Grid><Grid item xs={12} md={4}><Paper sx={{ p: 3 }}><Typography variant="h5" gutterBottom>Bill Summary</Typography><Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1.5 }}><Typography>Sub Total:</Typography><Typography>₹{subTotal.toFixed(2)}</Typography></Box><Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1.5, color: 'error.main' }}><Typography>Discount:</Typography><Typography>- ₹{totalDiscount.toFixed(2)}</Typography></Box><Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1.5 }}><Typography>GST:</Typography><Typography>+ ₹{totalGst.toFixed(2)}</Typography></Box><hr /><Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}><Typography variant="h6">Grand Total:</Typography><Typography variant="h6">₹{grandTotal.toFixed(2)}</Typography></Box><Button onClick={handleGenerateBill} variant="contained" fullWidth size="large" sx={{ mt: 2 }}>Generate Bill</Button></Paper></Grid></Grid></Container></Box>
  );
};

export default BillingPage;