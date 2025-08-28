import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- Import axios
import { Container, Box, Typography, TextField, Button, Grid, Paper, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Custom theme (no changes here)
const theme = createTheme({
    palette: {
        primary: { main: '#2196f3' },
        secondary: { main: '#ff4081' },
        background: { default: '#e3f2fd', paper: '#ffffff' },
    },
    typography: { h5: { fontWeight: 600, color: '#3f51b5' } },
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <-- Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Data to be sent to the backend
      const loginData = {
        email,
        password,
      };

      // API call to the backend login endpoint
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        loginData
      );

      // If login is successful
      alert('Login Successful!');
      console.log('User data:', data); // You can see user info and token here
      
      // We will handle saving the token later
      // For now, redirect to the home page
      navigate('/');

    } catch (error) {
      // If there is an error from the backend
      console.error('Login error:', error.response.data);
      alert(error.response.data.message || 'An error occurred during login.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e3f2fd 30%, #bbdefb 90%)', padding: 2, }}>
        <Paper elevation={10} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, width: '100%', maxWidth: '400px', bgcolor: 'background.paper', }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Welcome Back!
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, py: 1.5 }} >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                  {"Don't have an account? Register Now"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;