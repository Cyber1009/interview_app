import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';

/**
 * AdminLogin Component
 * 
 * Specialized login component for admin users.
 * Uses adminAuthService which is separate from regular authService
 * to maintain separation between admin and regular user authentication.
 */
const AdminLogin = ({ adminAuthService, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have a fresh login message or error from URL params
  useEffect(() => {
    // Check for explicit logout or session expired message
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setError("Your session has expired. Please log in again.");
    }
  }, [location]);

  // Update path to align with admin routes in AdminPanel
  const from = location.state?.from?.pathname || "/admin/overview";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    // Important: Prevent default form submission
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Prepare credentials for API request
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      console.log('Attempting admin login with credentials:', {
        username: credentials.username,
        password: '********'
      });
      
      // Make direct API call to bypass automatic redirects
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle error response without page refresh
        throw { 
          response: { 
            status: response.status, 
            data: data 
          } 
        };
      }
      
      // Successfully logged in
      console.log('Admin login successful, response:', data);
      
      // Store admin token and username in localStorage
      if (data.access_token) {
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminUsername', credentials.username);
        
        if (data.admin_id) {
          localStorage.setItem('adminId', data.admin_id);
        }
        
        // Call onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Navigate to admin dashboard or original target route
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid response format from authentication server');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError(err.response?.data?.detail || 
                err.response?.data?.message || 
                "Admin login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleInputChange}
              disabled={loading}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleInputChange}
              disabled={loading}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                position: 'relative'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-12px'
                    }} 
                  />
                  <span style={{ visibility: 'hidden' }}>Sign In</span>
                </>
              ) : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;