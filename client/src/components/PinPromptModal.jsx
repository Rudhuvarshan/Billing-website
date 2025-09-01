import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { usePin } from '../context/PinContext';

const PinPromptModal = ({ open, handleClose, onSuccess }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const { verifyPin } = usePin();

  const handleSubmit = () => {
    if (verifyPin(enteredPin)) {
      toast.success('PIN Verified');
      onSuccess();
      handleClose();
    } else {
      toast.error('Incorrect PIN. Please try again.');
    }
    setEnteredPin('');
  };

  const handleKeyPress = (event) => { if (event.key === 'Enter') handleSubmit(); };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Admin Verification</DialogTitle>
      <DialogContent>
        <Typography>Please enter the 6-digit PIN to proceed.</Typography>
        <TextField
          autoFocus
          margin="dense"
          id="pin"
          label="6-Digit PIN"
          type="password"
          fullWidth
          variant="outlined"
          value={enteredPin}
          onChange={(e) => setEnteredPin(e.target.value)}
          onKeyPress={handleKeyPress}
          inputProps={{ maxLength: 6 }}
          // --- THIS IS THE FIX ---
          autoComplete="one-time-code" 
          // ----------------------
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinPromptModal;