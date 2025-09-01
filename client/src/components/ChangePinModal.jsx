import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { usePin } from '../context/PinContext';

const ChangePinModal = ({ open, handleClose }) => {
  const { verifyPin, updatePin } = usePin();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = () => {
    if (!verifyPin(currentPin)) {
      return toast.error('Your Current PIN is incorrect.');
    }
    if (newPin.length !== 6) {
      return toast.error('New PIN must be 6 digits.');
    }
    if (newPin !== confirmPin) {
      return toast.error('New PINs do not match.');
    }
    updatePin(newPin);
    toast.success('PIN changed successfully!');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Admin PIN</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField margin="dense" label="Current PIN" type="password" fullWidth variant="outlined" value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} inputProps={{ maxLength: 6 }} />
          <TextField margin="dense" label="New PIN" type="password" fullWidth variant="outlined" value={newPin} onChange={(e) => setNewPin(e.target.value)} inputProps={{ maxLength: 6 }} />
          <TextField margin="dense" label="Confirm New PIN" type="password" fullWidth variant="outlined" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} inputProps={{ maxLength: 6 }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save New PIN</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePinModal;