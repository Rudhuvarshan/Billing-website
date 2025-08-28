import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadBillPDF } from '../utils/generateBillPDF'; // Re-using our PDF helper!
import BackToHomeButton from '../components/BackToHomeButton'; // We will create this next

const HistoryPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBillHistory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/bills/history');
        setBills(data);
      } catch (err) {
        setError('Failed to fetch bill history.');
        console.error('Fetch history error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBillHistory();
  }, []);

  const handleRedownload = (bill) => {
    // Re-structure the bill object to match what our PDF function expects
    const billDataForPDF = {
      customerName: bill.customerName,
      customerNumber: bill.customerNumber,
      items: bill.items,
      subTotal: bill.subTotal,
      totalDiscountValue: bill.totalDiscountValue,
      totalGstValue: bill.totalGstValue,
      grandTotal: bill.grandTotal,
    };
    downloadBillPDF(billDataForPDF);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <BackToHomeButton />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mt: 2 }}>
          Bill History
        </Typography>

        <Paper elevation={3} sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ padding: 3 }}>{error}</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Amount (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell>{bill.customerNumber}</TableCell>
                      <TableCell align="right">{bill.grandTotal.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleRedownload(bill)}>
                          <DownloadIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HistoryPage;