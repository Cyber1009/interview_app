import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { AdminService } from '../../services';

/**
 * CreateUser Component
 * 
 * Provides a form to create new user accounts with:
 * - Username and password 
 * - Initial subscription settings
 * - Account activation status
 */
const CreateUser = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    company: '',
    is_active: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Send create request to API
      const response = await AdminService.createUser(formData);
      
      // Navigate to the user details page
      navigate(`/admin/user-management/${response.data.id}`);
    } catch (err) {
      console.error('Failed to create user:', err);
      
      // Handle specific error messages
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Unable to create user. Please try again.');
      }
      setLoading(false);
    }
  };
  
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
          Create User
        </Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information Card */}
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
                required
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Password must be at least 8 characters"
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
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
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
        
        {/* Note Card */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="subtitle1" fontWeight={500}>
            Note About New Accounts
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            By default, new accounts are created with no subscription. After creating the user, 
            you will be redirected to the user details page where you can set subscription details.
          </Typography>
        </Paper>
        
        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined"
            onClick={() => navigate('/admin/user-management')}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <LinearProgress size={20} /> : <SaveIcon />}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateUser;