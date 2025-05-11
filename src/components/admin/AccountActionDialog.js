import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

/**
 * Unified dialog component for account-related actions
 * Supports both account approval and rejection scenarios
 * 
 * @param {string} action - Either 'approve' or 'reject'
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Function to call when dialog closes
 * @param {function} onConfirm - Function to call when action is confirmed
 * @param {object} account - Account data object
 * @param {boolean} loading - Loading state
 */
const AccountActionDialog = ({
  action,
  open,
  onClose,
  onConfirm,
  account,
  loading
}) => {
  // Subscription data state for approval dialog
  const [activationData, setActivationData] = useState({
    subscription_plan: 'basic',
    subscription_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    is_active: true
  });

  // Handle subscription data change
  const handleActivationChange = (field, value) => {
    setActivationData({
      ...activationData,
      [field]: value
    });
  };

  // Handle confirmation based on action type
  const handleConfirm = () => {
    if (action === 'approve') {
      onConfirm(activationData);
    } else {
      onConfirm();
    }
  };

  // Render content based on action type
  const renderContent = () => {
    if (action === 'approve') {
      return (
        <>
          <DialogContentText sx={{ mb: 3 }}>
            You are approving the account for:
            <Box component="span" fontWeight="bold" sx={{ display: 'block', mt: 1 }}>
              {account?.username || 'User'} ({account?.email || 'No email'})
            </Box>
          </DialogContentText>
          
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Subscription Plan</InputLabel>
              <Select
                value={activationData.subscription_plan}
                onChange={(e) => handleActivationChange('subscription_plan', e.target.value)}
                label="Subscription Plan"
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Subscription End Date"
                value={activationData.subscription_end_date}
                onChange={(date) => handleActivationChange('subscription_end_date', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            
            <FormControl>
              <Typography variant="body2" gutterBottom>
                Account Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={activationData.is_active}
                      onChange={(e) => handleActivationChange('is_active', e.target.checked)}
                      color="success"
                    />
                  }
                  label={activationData.is_active ? "Active" : "Inactive"}
                />
              </Box>
            </FormControl>
          </Stack>
        </>
      );
    } else {
      return (
        <DialogContentText>
          Are you sure you want to reject the registration request from:
          <Box component="span" fontWeight="bold" sx={{ display: 'block', mt: 1, mb: 1 }}>
            {account?.username || 'User'} ({account?.email || 'No email'})
          </Box>
          This action cannot be undone. The user will need to register again if they wish to access the platform.
        </DialogContentText>
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      fullWidth
      maxWidth={action === 'approve' ? "sm" : "xs"}
    >
      <DialogTitle>
        {action === 'approve' ? 'Activate Account' : 'Reject Account'}
      </DialogTitle>
      
      <DialogContent>
        {renderContent()}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="inherit" 
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleConfirm}
          variant="contained"
          color={action === 'approve' ? 'success' : 'error'}
          startIcon={loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            action === 'approve' ? <CheckIcon /> : <CloseIcon />
          )}
          disabled={loading}
        >
          {loading ? 'Processing...' : (action === 'approve' ? 'Approve Account' : 'Reject Account')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountActionDialog;