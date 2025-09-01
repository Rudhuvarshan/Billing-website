import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';

const EditProductModal = ({ open, handleClose, product, onProductUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPercentage: '',
    gstPercentage: '',
  });

  // This useEffect pre-fills the form when a product is selected
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        discountPercentage: product.discountPercentage,
        gstPercentage: product.gstPercentage,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      return toast.error('Please fill in Name and Price.');
    }
    
    const updatedData = {
        ...formData,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage) || 0,
        gstPercentage: Number(formData.gstPercentage) || 0,
    };

    try {
      const { data } = await axios.put(`http://localhost:5000/api/products/${product._id}`, updatedData);
      toast.success('Product updated successfully!');
      onProductUpdate(data); // Pass the updated product back to the HomePage
      handleClose(); // Close the modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product (ID: {product?.productNumber})</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="Product Name"
              type="text"
              fullWidth
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Price (₹)"
              type="number"
              fullWidth
              variant="outlined"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Discount (%)"
              type="number"
              fullWidth
              variant="outlined"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="GST (%)"
              type="number"
              fullWidth
              variant="outlined"
              name="gstPercentage"
              value={formData.gstPercentage}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;