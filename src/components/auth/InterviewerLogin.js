import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Link,
  CircularProgress
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { AuthService } from '../../services';

/**
 * Login Component
 * Provides:
 * - Authentication for interviewers and admins
 * - Form validation
 * - Error handling
 * - Redirection based on user role
 */
const InterviewerLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginTitle, setLoginTitle] = useState('Sign In');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set appropriate title based on URL path
    if (location.pathname.includes('/admin')) {
      setLoginTitle('Admin Login');
      document.title = 'Admin Login';
    } else {
      setLoginTitle('Interviewer Login');
      document.title = 'Interviewer Login';
    }
    
    // Clear any stored roles/tokens that might be causing issues
    if (location.state?.clearAuth) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Login attempt with:', credentials);
      const response = await AuthService.login(credentials);
      console.log('Login response:', response);
      
      // Check for token (either access_token or token property)
      if (response && (response.access_token || response.token)) {
        // Get the actual token value
        const tokenValue = response.access_token || response.token;
        
        // Determine role - either from response or based on URL
        let role = response.role;
        if (!role) {
          console.log('Role not found in response, determining from URL');
          // Use explicit URL-based role determination
          role = location.pathname.startsWith('/admin/') ? 'admin' : 'interviewer';
          
          // Save determined role to localStorage
          localStorage.setItem('userRole', role);
          console.log('Determined and saved role:', role);
        }
        
        console.log('Authenticated with role:', role);
        
        // Force clear any existing unauthorized paths in history
        window.history.replaceState({}, '', 
          role === 'admin' ? '/admin' : '/interviewer'
        );
        
        // Use replace instead of push to avoid the back button going to login page
        navigate(role === 'admin' ? '/admin' : '/interviewer', { replace: true });
      } else {
        throw new Error('Authentication failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Set error but DON'T clear credentials - this is key to preserving form data
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {loginTitle}
        </Typography>
        
        <Paper 
          elevation={3}
          sx={{ 
            mt: 3,
            p: 4,
            width: '100%'
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={handleChange}
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
              onChange={handleChange}
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
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="#" variant="body2" onClick={() => navigate('/forgot-password')}>
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InterviewerLogin;