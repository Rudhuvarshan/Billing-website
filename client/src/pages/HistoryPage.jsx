import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Link, Button, TextField, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search'; // Import Search Icon
import ViewBillModal from '../components/ViewBillModal';

const HistoryPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- NEW STATE FOR SEARCH ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBills, setFilteredBills] = useState([]);
  // -----------------------------

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const fetchBillHistory = async () => { try { setLoading(true); const { data } = await axios.get('http://localhost:5000/api/bills/history'); setBills(data); setFilteredBills(data); } catch (err) { setError('Failed to fetch bill history.'); console.error(err); } finally { setLoading(false); } };
    fetchBillHistory();
  }, []);

  // --- NEW USEEFFECT FOR FILTERING ---
  useEffect(() => {
    const results = bills.filter(bill =>
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerNumber.includes(searchTerm)
    );
    setFilteredBills(results);
  }, [searchTerm, bills]);
  // ------------------------------------

  const handleOpenViewModal = (bill) => { setSelectedBill(bill); setOpenViewModal(true); };
  const handleCloseViewModal = () => { setOpenViewModal(false); setSelectedBill(null); };

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} /> Back to Dashboard
          </Link>

          {/* --- Search Box --- */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Bill History</Typography>
            <TextField 
              label="Search by Customer Name/Number..." 
              variant="outlined" 
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: ( <InputAdornment position="start"><SearchIcon /></InputAdornment> ),
              }}
            />
          </Box>

          <Paper elevation={3} sx={{ mt: 2 }}>
            <TableContainer>
              {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> ) 
              : error ? ( <Typography color="error" align="center" sx={{ p: 5 }}>{error}</Typography> ) 
              : (
                <Table>
                  {/* ... TableHead is the same ... */}
                  <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Customer Number</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Amount (₹)</TableCell><TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell></TableRow>
                  </TableHead>
                  {/* UPDATE TABLE TO USE filteredBills */}
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill._id} hover>
                        <TableCell>{new Date(bill.createdAt).toLocaleString('en-IN')}</TableCell><TableCell>{bill.customerName}</TableCell><TableCell>{bill.customerNumber}</TableCell><TableCell align="right">{bill.grandTotal.toFixed(2)}</TableCell><TableCell align="center"><Button variant="outlined" size="small" onClick={() => handleOpenViewModal(bill)}>View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      <ViewBillModal open={openViewModal} handleClose={handleCloseViewModal} bill={selectedBill} />
    </>
  );
};
export default HistoryPage;