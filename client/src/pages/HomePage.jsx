import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Grid, IconButton, TextField, InputAdornment } from '@mui/material';
import Navbar from '../components/Navbar';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import PinPromptModal from '../components/PinPromptModal';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // <-- Import Delete Icon
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openPinModal, setOpenPinModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  useEffect(() => {
    // ... fetchProducts and search filtering useEffects are the same ...
    const fetchProducts = async () => { try { setLoading(true); const { data } = await axios.get('http://localhost:5000/api/products/all'); setProducts(data); setFilteredProducts(data); } catch (err) { setError('Failed to fetch products.'); console.error(err); } finally { setLoading(false); } }; fetchProducts();
  }, []);
  useEffect(() => { const results = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.productNumber.toLowerCase().includes(searchTerm.toLowerCase())); setFilteredProducts(results); }, [searchTerm, products]);

  // --- REQUEST HANDLERS ---
  const handleRequestAdd = () => { setActionToConfirm({ type: 'add' }); setOpenPinModal(true); };
  const handleRequestEdit = (product) => { setActionToConfirm({ type: 'edit', product }); setSelectedProduct(product); setOpenPinModal(true); };
  const handleRequestDelete = (product) => { setActionToConfirm({ type: 'delete', product }); setOpenPinModal(true); };

  // --- NEW DELETE EXECUTION FUNCTION ---
  const executeDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${actionToConfirm.product._id}`);
      toast.success('Product deleted successfully!');
      setProducts(prevProducts => prevProducts.filter(p => p._id !== actionToConfirm.product._id));
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  // --- UPDATED GATEKEEPER FUNCTION ---
  const handlePinSuccess = () => {
    if (actionToConfirm?.type === 'add') {
      setOpenAddProductModal(true);
    } else if (actionToConfirm?.type === 'edit') {
      setOpenEditProductModal(true);
    } else if (actionToConfirm?.type === 'delete') {
      executeDelete();
    }
  };

  const handleProductAdded = (newProduct) => { setProducts(prevProducts => [newProduct, ...prevProducts]); };
  const handleProductUpdate = (updatedProduct) => { setProducts(prevProducts => prevProducts.map(p => (p._id === updatedProduct._id ? updatedProduct : p))); };

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="lg">
          {/* ... Dashboard cards are the same ... */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}><Paper onClick={handleRequestAdd} elevation={3} sx={{ p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { boxShadow: 8 } }}><AddShoppingCartIcon sx={{ fontSize: 50, color: 'primary.main' }} /><Typography variant="h6" sx={{ mt: 1 }}>Add Products</Typography></Paper></Grid>
            <Grid item xs={12} md={4}><Paper onClick={() => navigate('/billing')} elevation={3} sx={{ p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { boxShadow: 8 } }}><ReceiptIcon sx={{ fontSize: 50, color: 'success.main' }} /><Typography variant="h6" sx={{ mt: 1 }}>Go to Billing</Typography></Paper></Grid>
            <Grid item xs={12} md={4}><Paper onClick={() => navigate('/history')} elevation={3} sx={{ p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { boxShadow: 8 } }}><HistoryIcon sx={{ fontSize: 50, color: 'secondary.main' }} /><Typography variant="h6" sx={{ mt: 1 }}>View Bill History</Typography></Paper></Grid>
          </Grid>
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Your Products</Typography>
            <TextField label="Search Products..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon /></InputAdornment> ), }} />
          </Box>
          <Paper elevation={3} sx={{ mt: 2 }}>
            <TableContainer>
              {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> ) 
              : error ? ( <Typography color="error" align="center" sx={{ p: 5 }}>{error}</Typography> ) 
              : (
                <Table>
                  <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Product No.</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>Price (₹)</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>Discount (%)</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>GST (%)</TableCell><TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell></TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product._id} hover>
                        <TableCell>{product.productNumber}</TableCell><TableCell>{product.name}</TableCell><TableCell align="right">{product.price.toFixed(2)}</TableCell><TableCell align="right">{product.discountPercentage}</TableCell><TableCell align="right">{product.gstPercentage}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" onClick={() => handleRequestEdit(product)}><EditIcon /></IconButton>
                          {/* NEW DELETE BUTTON */}
                          <IconButton color="error" onClick={() => handleRequestDelete(product)}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      <PinPromptModal open={openPinModal} handleClose={() => setOpenPinModal(false)} onSuccess={handlePinSuccess} />
      <AddProductModal open={openAddProductModal} handleClose={() => setOpenAddProductModal(false)} onProductAdd={handleProductAdded} />
      <EditProductModal open={openEditProductModal} handleClose={() => setOpenEditProductModal(false)} product={selectedProduct} onProductUpdate={handleProductUpdate} />
    </>
  );
};
export default HomePage;