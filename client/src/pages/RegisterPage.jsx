import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Grid, Paper, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'; // A different icon

// Using the same theme for consistency
const theme = createTheme({
    palette: {
        primary: { main: '#2196f3' },
        secondary: { main: '#ff4081' },
        background: { default: '#e3f2fd', paper: '#ffffff' },
    },
    typography: { h5: { fontWeight: 600, color: '#3f51b5' } },
});

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const registerData = {
        name,
        email,
        password,
      };

      // API call to the backend register endpoint
      await axios.post(
        'http://localhost:5000/api/auth/register',
        registerData
      );

      // If registration is successful
      alert('Registration Successful! Please log in.');
      
      // Redirect to the login page
      navigate('/login');

    } catch (error) {
      // If there is an error from the backend (e.g., user already exists)
      console.error('Registration error:', error.response.data);
      alert(error.response.data.message || 'An error occurred during registration.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e3f2fd 30%, #bbdefb 90%)', padding: 2, }}>
        <Paper elevation={10} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, width: '100%', maxWidth: '400px', bgcolor: 'background.paper', }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <AppRegistrationIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Create an Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="name" label="Full Name" name="name" autoComplete="name" autoFocus value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, py: 1.5 }} >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;