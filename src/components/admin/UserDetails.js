import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  MenuItem,
  LinearProgress,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { AdminService } from '../../services';

/**
 * UserDetails Component
 * 
 * View and edit user account details including:
 * - Basic user information
 * - Subscription details
 * - Account status
 */
const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company: '',
    subscription_plan: '',
    subscription_end_date: null,
    subscription_status: '',
    is_active: false
  });
  
  // Load user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      // Simple check for invalid userId - just redirect back to user management
      if (!userId) {
        navigate('/admin/user-management');
        return;
      }
      
      try {
        setLoading(true);
        const response = await AdminService.getUser(userId);
        setUser(response.data);
        
        // Initialize form with user data
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          company: response.data.company || '',
          subscription_plan: response.data.subscription_plan || '',
          subscription_status: response.data.subscription_status || '',
          subscription_end_date: response.data.subscription_end_date ? new Date(response.data.subscription_end_date) : null,
          is_active: response.data.is_active || false
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Unable to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId, navigate]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear success message when form changes
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      subscription_end_date: date
    });
    
    // Clear success message when form changes
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Format the data for the API
      const updatedUser = {
        ...formData,
        subscription_end_date: formData.subscription_end_date ? formData.subscription_end_date.toISOString() : null
      };
      
      // Send update to API
      const response = await AdminService.updateUser(userId, updatedUser);
      
      // Update user state with response
      setUser(response.data);
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Unable to update user details. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      await AdminService.deleteUser(userId);
      setDeleteDialogOpen(false);
      navigate('/admin/user-management', { replace: true });
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user. Please try again.');
      setDeleteDialogOpen(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  if (loading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/admin/user-management')}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            User Details
          </Typography>
        </Box>
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <LinearProgress />
          <Typography sx={{ mt: 2 }}>Loading user details...</Typography>
        </Paper>
      </Box>
    );
  }
  
  if (error && !user) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/admin/user-management')}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            User Details
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/admin/user-management')}
        >
          Back to User Management
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          sx={{ mr: 2 }} 
          onClick={() => navigate('/admin/user-management')}
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={600}>
          User Details
        </Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {saveSuccess && <Alert severity="success" sx={{ mb: 3 }}>User details updated successfully!</Alert>}
      
      <form onSubmit={handleSubmit}>
        {/* User Information Card */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                disabled
                helperText="Username cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Subscription Details Card */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Subscription Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Subscription Plan"
                name="subscription_plan"
                select
                value={formData.subscription_plan}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Subscription Status"
                name="subscription_status"
                select
                value={formData.subscription_status}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Subscription End Date"
                  value={formData.subscription_end_date}
                  onChange={handleDateChange}
                  renderInput={(props) => <TextField {...props} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label={formData.is_active ? "Account Active" : "Account Inactive"}
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Account Information Card */}
        <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom fontWeight={500}>
              Account Information
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">User ID</Typography>
              <Typography variant="body2">{user?.id}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Created Date</Typography>
              <Typography variant="body2">{formatDate(user?.created_at)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Current Status</Typography>
              <Chip 
                size="small" 
                label={user?.subscription_status || 'Unknown'} 
                color={user?.is_active ? 'success' : 'default'}
                variant={user?.is_active ? "default" : "outlined"}
              />
            </Box>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete User
          </Button>
          
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
            startIcon={saving ? <LinearProgress size={20} /> : <SaveIcon />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </form>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
            All data associated with this user will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetails;