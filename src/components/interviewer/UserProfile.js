import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Skeleton,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  WorkOutline as WorkIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  SaveAlt as SaveIcon,
  Cancel as CancelIcon,
  SubscriptionsOutlined as SubscriptionIcon
} from '@mui/icons-material';
import { authAPI } from '../../api';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getCurrentUser();
      console.log('User profile data:', response.data);
      setProfile(response.data);
      setUpdatedProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // If canceling edit, reset the form
      setUpdatedProfile(profile);
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value
    });
  };

  const handleUpdateProfile = async () => {
    try {
      // Make API call to update user profile
      const response = await authAPI.updateUserProfile(updatedProfile);
      
      // Update local state with response data
      setProfile(response.data || updatedProfile);
      setEditMode(false);
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setNotification({
        open: true,
        message: error.response?.data?.detail || 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Use profile data directly - no default fallback needed
  const user = profile || {};

  const getSubscriptionStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
          User Profile
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circular" width={120} height={120} />
              <Skeleton variant="text" width={100} height={30} sx={{ mt: 2 }} />
              <Skeleton variant="text" width={150} height={20} sx={{ mt: 1 }} />
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <Skeleton variant="text" width="70%" height={40} />
              <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="50%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 3 }} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
          User Profile
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchUserProfile}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        User Profile
      </Typography>

      <Paper elevation={0} sx={{ 
        p: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.dark', 
          color: 'white',
          position: 'relative'
        }}>
          <Typography variant="h6" fontWeight={600}>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Member since {formatDate(user.created_at)}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={editMode ? <CancelIcon /> : <EditIcon />}
            onClick={handleEditToggle}
            sx={{ 
              position: 'absolute',
              right: 16,
              top: 16
            }}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ p: 3 }}>
          <Grid item xs={12} md={4} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-start' }
          }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'secondary.main',
                fontSize: '3rem'
              }}
            >
              {user.username ? user.username[0].toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              {user.username}
            </Typography>
            
            {/* Only show subscription info if available */}
            {user.subscription_plan && (
              <Card elevation={0} sx={{ 
                mt: 4, 
                width: '100%', 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 2
              }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Subscription Information
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={user.is_active ? "Active" : "Expired"}
                      color={getSubscriptionStatusColor(user.is_active)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {user.subscription_plan ? 
                        `${user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)} Plan` : 
                        'No Plan'}
                    </Typography>
                    {user.subscription_end_date && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 1
                      }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {user.is_active ? 'Renews' : 'Expired'}: {formatDate(user.subscription_end_date)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Profile Information
            </Typography>

            <Box sx={{ mt: 3 }}>
              {editMode ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={updatedProfile.username || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={updatedProfile.email || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={updatedProfile.company || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleUpdateProfile}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1">
                        {user.username}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <WorkIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Company
                      </Typography>
                      <Typography variant="body1">
                        {user.company || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <SubscriptionIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Current Plan
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {user.subscription_plan ? 
                          `${user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)}` : 
                          'No Plan'}
                        {user.subscription_plan && (
                          <Chip 
                            label={user.is_active ? "Active" : "Expired"}
                            color={getSubscriptionStatusColor(user.is_active)}
                            size="small"
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Created
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(user.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;