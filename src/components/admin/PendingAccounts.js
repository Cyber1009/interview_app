import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  AlertTitle,
  Divider,
  Paper
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import AdminService from '../../services/adminService';
import { colors, componentColors } from '../../styles';

/**
 * PendingAccounts Component
 * 
 * Manages accounts that have been registered but not yet activated.
 * Features:
 * - Visual cards for pending accounts
 * - Account approval workflow
 * - Account rejection with reason
 * - Expiration indicators
 * - Subscription assignment during activation
 */
const PendingAccounts = ({ onAccountApproved }) => {
  // Get theme but avoid using potentially undefined properties
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [activationDialog, setActivationDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activationData, setActivationData] = useState({
    is_active: true,
    subscription_plan: 'basic',
    subscription_end_date: getDateInMonths(1) // Default to 1 month subscription
  });
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Get a date X months from now in ISO format
  function getDateInMonths(months) {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

  // Fetch pending accounts on load
  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  // Fetch accounts from API
  const fetchPendingAccounts = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getPendingAccounts();
      // Correctly handle the API response structure - data might be in response.data.accounts
      const accounts = response?.data?.accounts || response?.data || [];
      setPendingAccounts(accounts);
    } catch (error) {
      console.error('Error fetching pending accounts:', error);
      setStatusMessage({
        type: 'error',
        text: 'Failed to load pending accounts. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the activation dialog
  const handleActivateClick = (account) => {
    setSelectedAccount(account);
    setActivationData({
      is_active: true,
      subscription_plan: 'basic',
      subscription_end_date: getDateInMonths(1)
    });
    setActivationDialog(true);
  };

  // Handle opening the delete dialog
  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setDeleteDialog(true);
  };

  // Close all dialogs
  const handleCloseDialogs = () => {
    setActivationDialog(false);
    setDeleteDialog(false);
    setSelectedAccount(null);
  };

  // Handle activation data changes
  const handleActivationChange = (event) => {
    const { name, value } = event.target;
    setActivationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle subscription plan change with automatic duration
  const handlePlanChange = (event) => {
    const plan = event.target.value;
    // Adjust subscription duration based on plan
    let months = 1;
    if (plan === 'premium') months = 3;
    if (plan === 'enterprise') months = 12;

    setActivationData(prev => ({
      ...prev,
      subscription_plan: plan,
      subscription_end_date: getDateInMonths(months)
    }));
  };

  // Handle account activation
  const handleActivateAccount = async () => {
    if (!selectedAccount) return;

    setProcessing(true);
    try {
      // Adjust date format if needed
      let formattedDate = activationData.subscription_end_date;
      if (formattedDate && !formattedDate.includes('T')) {
        formattedDate += 'T23:59:59Z'; // Add time to ISO date
      }

      const activationPayload = {
        is_active: activationData.is_active,
        subscription_plan: activationData.subscription_plan,
        subscription_end_date: formattedDate
      };

      await AdminService.activatePendingAccount(selectedAccount.id, activationPayload);
      
      // Update UI
      setPendingAccounts(pendingAccounts.filter(acc => acc.id !== selectedAccount.id));
      setStatusMessage({
        type: 'success',
        text: `Account for ${selectedAccount.username} has been successfully activated.`
      });
      
      // Notify parent component that an account was approved
      if (onAccountApproved) {
        onAccountApproved();
      }
    } catch (error) {
      console.error('Error activating account:', error);
      setStatusMessage({
        type: 'error',
        text: 'Failed to activate account. Please try again.'
      });
    } finally {
      setProcessing(false);
      handleCloseDialogs();
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;

    setProcessing(true);
    try {
      await AdminService.deletePendingAccount(selectedAccount.id);
      
      // Update UI
      setPendingAccounts(pendingAccounts.filter(acc => acc.id !== selectedAccount.id));
      setStatusMessage({
        type: 'success',
        text: `Account for ${selectedAccount.username} has been deleted.`
      });
      
      // Notify parent component of changes
      if (onAccountApproved) {
        onAccountApproved();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setStatusMessage({
        type: 'error',
        text: 'Failed to delete account. Please try again.'
      });
    } finally {
      setProcessing(false);
      handleCloseDialogs();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Check if account is expired
  const isAccountExpired = (expirationDate) => {
    if (!expirationDate) return false;
    
    try {
      const expiration = new Date(expirationDate);
      return expiration < new Date();
    } catch (e) {
      return false;
    }
  };

  // Format time since creation
  const formatTimeSince = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  // Define safe color values using our consolidated theme structure
  const safeColors = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    buttonBg: componentColors.buttonBackground,
    buttonText: componentColors.buttonColor
  };

  return (
    <Box>
      {/* Status message */}
      {statusMessage && (
        <Alert 
          severity={statusMessage.type} 
          sx={{ mb: 3 }}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage.text}
        </Alert>
      )}

      {/* Loading state */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Empty state */}
      {!loading && pendingAccounts.length === 0 && (
        <Box
          sx={{ 
            py: 5, 
            textAlign: 'center',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(componentColors.labelBackground || '#e5eaf1', 0.5)
          }}
        >
          <CheckCircleIcon sx={{ 
            fontSize: 64, 
            color: safeColors.success, 
            mb: 2, 
            opacity: 0.7 
          }} />
          <Typography variant="h5" fontWeight={600} gutterBottom color={componentColors.headerColor}>
            No Pending Accounts
          </Typography>
          <Typography color={componentColors.labelColor}>
            There are currently no pending account registrations to review.
          </Typography>
        </Box>
      )}

      {/* Pending accounts grid */}
      {!loading && pendingAccounts.length > 0 && (
        <Grid container spacing={3}>
          {pendingAccounts.map((account) => (
            <Grid item xs={12} sm={6} key={account.id}>
              <Card 
                sx={{ 
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)',
                  overflow: 'hidden',
                  border: isAccountExpired(account.subscription_end_date) 
                    ? `2px solid ${safeColors.error}` 
                    : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px 0 rgba(80,86,96,0.18)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Header with status */}
                  <Box sx={{ 
                    p: 2,
                    bgcolor: isAccountExpired(account.subscription_end_date) 
                      ? alpha(safeColors.error || '#e75552', 0.1)
                      : alpha(componentColors.buttonBackground || '#091326', 0.03),
                    borderBottom: `1px solid ${alpha(componentColors.labelColor || '#52606d', 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {isAccountExpired(account.subscription_end_date) ? (
                      <Chip 
                        label="Expired" 
                        color="error" 
                        size="small"
                        icon={<AccessTimeIcon />}
                        sx={{ 
                          borderRadius: '2em',
                          height: '24px',
                          '& .MuiChip-label': { px: 1.5, fontSize: '0.85rem' }
                        }}
                      />
                    ) : (
                      <Chip 
                        label="Pending" 
                        size="small"
                        sx={{ 
                          bgcolor: safeColors.warning,
                          color: 'white',
                          borderRadius: '2em',
                          height: '24px',
                          '& .MuiChip-label': { px: 1.5, fontSize: '0.85rem' }
                        }}
                      />
                    )}
                    <Typography variant="caption" color={componentColors.labelColor} fontWeight={500}>
                      {formatTimeSince(account.created_at)}
                    </Typography>
                  </Box>
                  
                  {/* Content */}
                  <Box sx={{ p: 2.5 }}>
                    {/* Username with avatar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: componentColors.buttonBackground,
                          mr: 2,
                          width: 56, 
                          height: 56,
                          fontSize: '1.5rem',
                          fontWeight: 600
                        }}
                      >
                        {account.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} color={componentColors.headerColor}>
                          {account.username}
                        </Typography>
                        <Typography variant="body2" color={componentColors.labelColor}>
                          {account.company || 'No company specified'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Contact details */}
                    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon fontSize="small" sx={{ color: componentColors.labelColor, mr: 1.5 }} />
                        <Typography variant="body2">
                          {account.email || 'No email provided'}
                        </Typography>
                      </Box>
                      {account.company && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ color: componentColors.labelColor, mr: 1.5 }} />
                          <Typography variant="body2">
                            {account.company}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon fontSize="small" sx={{ color: componentColors.labelColor, mr: 1.5 }} />
                        <Typography variant="body2">
                          Expires: {formatDate(account.subscription_end_date)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  
                  {/* Action buttons in a footer */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1.5, 
                    px: 2.5, 
                    py: 2,
                    borderTop: `1px solid ${alpha(componentColors.labelColor || '#52606d', 0.1)}`,
                    bgcolor: alpha(componentColors.labelBackground || '#e5eaf1', 0.3)
                  }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={<CancelIcon />}
                      onClick={() => handleDeleteClick(account)}
                      fullWidth
                      sx={{ 
                        color: safeColors.error,
                        borderColor: safeColors.error,
                        borderRadius: '2em',
                        '&:hover': {
                          borderColor: safeColors.error,
                          bgcolor: alpha(safeColors.error || '#e75552', 0.05)
                        }
                      }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleActivateClick(account)}
                      fullWidth
                      sx={{ 
                        bgcolor: safeColors.buttonBg,
                        color: safeColors.buttonText,
                        borderRadius: '2em',
                        '&:hover': {
                          bgcolor: alpha(safeColors.buttonBg || '#091326', 0.9)
                        }
                      }}
                    >
                      Activate
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Activation Dialog */}
      <Dialog
        open={activationDialog}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: safeColors.buttonBg,
          color: safeColors.buttonText,
          px: 3,
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            <Typography variant="h6">Activate Account</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {selectedAccount && (
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                You are about to activate the account for:
              </Typography>
              
              <Paper sx={{ 
                mb: 3, 
                p: 2.5, 
                bgcolor: alpha(componentColors.labelBackground || '#e5eaf1', 0.5),
                borderRadius: '12px' 
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{ bgcolor: safeColors.buttonBg }}
                  >
                    {selectedAccount.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600} color={componentColors.headerColor}>
                      {selectedAccount.username}
                    </Typography>
                    <Typography variant="body2" color={componentColors.labelColor}>
                      {selectedAccount.email}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              
              <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                Subscription Details:
              </Typography>
              
              <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Subscription Plan</InputLabel>
                    <Select
                      name="subscription_plan"
                      value={activationData.subscription_plan}
                      onChange={handlePlanChange}
                      label="Subscription Plan"
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value="basic">Basic</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                      <MenuItem value="enterprise">Enterprise</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Subscription End Date"
                    type="date"
                    name="subscription_end_date"
                    value={activationData.subscription_end_date}
                    onChange={handleActivationChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Account Status</InputLabel>
                    <Select
                      name="is_active"
                      value={activationData.is_active}
                      onChange={handleActivationChange}
                      label="Account Status"
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive (Suspended)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Alert 
                severity="info"
                sx={{ 
                  borderRadius: '8px',
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                This will create a full user account from the pending registration.
                The user will be able to log in immediately after activation.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${alpha(componentColors.labelColor || '#52606d', 0.1)}` }}>
          <Button 
            onClick={handleCloseDialogs}
            disabled={processing}
            sx={{ 
              color: safeColors.buttonBg,
              '&:hover': {
                bgcolor: alpha(safeColors.buttonBg || '#091326', 0.05)
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleActivateAccount}
            disabled={processing}
            sx={{ 
              bgcolor: safeColors.buttonBg,
              color: safeColors.buttonText,
              borderRadius: '2em',
              px: 2,
              '&:hover': {
                bgcolor: alpha(safeColors.buttonBg || '#091326', 0.9)
              },
              '&.Mui-disabled': {
                bgcolor: alpha(safeColors.buttonBg || '#091326', 0.3),
                color: 'white'
              }
            }}
          >
            {processing ? 'Processing...' : 'Activate Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: safeColors.error,
          color: 'white',
          px: 3,
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon />
            <Typography variant="h6">Delete Pending Account</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {selectedAccount && (
            <Box>
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '8px',
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Confirm Deletion</AlertTitle>
                <Typography>
                  You are about to permanently delete this pending account.
                  This action cannot be undone.
                </Typography>
              </Alert>
              
              <Paper sx={{ 
                p: 2.5, 
                bgcolor: alpha(componentColors.labelBackground || '#e5eaf1', 0.5),
                borderRadius: '12px'
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{ bgcolor: safeColors.error }}
                  >
                    {selectedAccount.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600} color={componentColors.headerColor}>
                      {selectedAccount.username}
                    </Typography>
                    <Typography variant="body2" color={componentColors.labelColor}>
                      {selectedAccount.email}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${alpha(componentColors.labelColor || '#52606d', 0.1)}` }}>
          <Button 
            onClick={handleCloseDialogs}
            disabled={processing}
            sx={{ 
              color: safeColors.buttonBg,
              '&:hover': {
                bgcolor: alpha(safeColors.buttonBg || '#091326', 0.05)
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAccount}
            disabled={processing}
            sx={{ 
              borderRadius: '2em',
              px: 2,
              '&.Mui-disabled': {
                bgcolor: alpha(safeColors.error || '#e75552', 0.3),
                color: 'white'
              }
            }}
          >
            {processing ? 'Processing...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingAccounts;