import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';

const AddProductModal = ({ open, handleClose, onProductAdd }) => {
  const [productNumber, setProductNumber] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [gstPercentage, setGstPercentage] = useState('18');

  const handleSubmit = async () => {
    if (!productNumber || !name || !price) {
      return toast.error('Please fill in Product Number, Name, and Price.');
    }

    const newProduct = {
      productNumber,
      name,
      price: Number(price),
      discountPercentage: Number(discountPercentage) || 0,
      gstPercentage: Number(gstPercentage) || 0,
    };

    try {
      const { data } = await axios.post('http://localhost:5000/api/products/add', newProduct);
      toast.success(`Product '${data.name}' added successfully!`);
      onProductAdd(data); // Pass the new product back to the HomePage

      // --- CHANGE IS HERE ---
      // We no longer call handleClose(). We just reset the form fields.
      // handleClose(); // <-- THIS LINE IS REMOVED

      // Reset form fields for the next entry
      setProductNumber('');
      setName('');
      setPrice('');
      setDiscountPercentage('0');
      setGstPercentage('18');
      // --------------------

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product.');
    }
  };
  
  // Create a new close handler that also resets the form
  const handleCancel = () => {
    setProductNumber('');
    setName('');
    setPrice('');
    setDiscountPercentage('0');
    setGstPercentage('18');
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="Product Number (e.g., P002)"
              type="text"
              fullWidth
              variant="outlined"
              value={productNumber}
              onChange={(e) => setProductNumber(e.target.value.toUpperCase())}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Price (₹)"
              type="number"
              fullWidth
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Discount (%)"
              type="number"
              fullWidth
              variant="outlined"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="GST (%)"
              type="number"
              fullWidth
              variant="outlined"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Product</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;