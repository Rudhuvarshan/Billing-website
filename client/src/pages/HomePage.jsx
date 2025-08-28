import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import AddProductModal from '../components/AddProductModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products/all');
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleGoToBilling = () => navigate('/billing');
  const handleGoToHistory = () => navigate('/history');
  const handleAddProductClick = () => setOpenAddProductModal(true);
  const handleCloseModal = () => setOpenAddProductModal(false);
  const handleProductAdded = (newProduct) => setProducts(prevProducts => [newProduct, ...prevProducts]);

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>Store Dashboard</Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid xs={12} md={4}> {/* <-- REMOVED 'item' PROP */}
              <Paper onClick={handleAddProductClick} elevation={3} sx={{ padding: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' }, transition: 'all 0.2s ease-in-out' }}>
                <AddShoppingCartIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'medium' }}>Add Products</Typography>
                <Typography variant="body2" color="textSecondary">Add new items to your store's inventory.</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} md={4}> {/* <-- REMOVED 'item' PROP */}
              <Paper onClick={handleGoToBilling} elevation={3} sx={{ padding: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' }, transition: 'all 0.2s ease-in-out' }}>
                <ReceiptIcon sx={{ fontSize: 50, color: 'success.main' }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'medium' }}>Go to Billing</Typography>
                <Typography variant="body2" color="textSecondary">Create a new bill for a customer.</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} md={4}> {/* <-- REMOVED 'item' PROP */}
              <Paper onClick={handleGoToHistory} elevation={3} sx={{ padding: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' }, transition: 'all 0.2s ease-in-out' }}>
                <HistoryIcon sx={{ fontSize: 50, color: 'secondary.main' }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'medium' }}>View Bill History</Typography>
                <Typography variant="body2" color="textSecondary">Browse all previously generated bills.</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>Your Products</Typography>
            <Paper elevation={3} sx={{ mt: 2 }}>
              {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}><CircularProgress /></Box> ) : 
               error ? ( <Typography color="error" sx={{ padding: 3 }}>{error}</Typography> ) : 
              ( <TableContainer>
                  <Table><TableHead><TableRow sx={{ backgroundColor: '#e3f2fd' }}><TableCell sx={{ fontWeight: 'bold' }}>Product No.</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell><TableCell sx={{ fontWeight: 'bold' }} align="right">Price (₹)</TableCell><TableCell sx={{ fontWeight: 'bold' }} align="right">Discount (%)</TableCell><TableCell sx={{ fontWeight: 'bold' }} align="right">GST (%)</TableCell></TableRow></TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">{product.productNumber}</TableCell><TableCell>{product.name}</TableCell><TableCell align="right">{product.price.toFixed(2)}</TableCell><TableCell align="right">{product.discountPercentage}</TableCell><TableCell align="right">{product.gstPercentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
      <AddProductModal open={openAddProductModal} handleClose={handleCloseModal} onProductAdd={handleProductAdded} />
    </>
  );
};

export default HomePage;