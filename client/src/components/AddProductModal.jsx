import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const AddProductModal = ({ open, handleClose, onProductAdd }) => {
  const [productData, setProductData] = useState({
    productNumber: '',
    name: '',
    price: '',
    discountPercentage: 0,
    gstPercentage: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { data: newProduct } = await axios.post(
        'http://localhost:5000/api/products/add',
        productData
      );
      alert('Product added successfully!');
      onProductAdd(newProduct); // Pass the new product back to the parent
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Failed to add product:', error.response.data);
      alert(error.response.data.message || 'Failed to add product.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill in the details for the new product you want to add to your inventory.
        </DialogContentText>
        <TextField autoFocus margin="dense" name="productNumber" label="Product Number" type="text" fullWidth variant="outlined" onChange={handleChange} />
        <TextField margin="dense" name="name" label="Product Name" type="text" fullWidth variant="outlined" onChange={handleChange} />
        <TextField margin="dense" name="price" label="Price (₹)" type="number" fullWidth variant="outlined" onChange={handleChange} />
        <TextField margin="dense" name="discountPercentage" label="Discount (%)" type="number" fullWidth variant="outlined" defaultValue="0" onChange={handleChange} />
        <TextField margin="dense" name="gstPercentage" label="GST (%)" type="number" fullWidth variant="outlined" defaultValue="0" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add Product</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;