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
import defaultAuthService from '../../../services/authService';

/**
 * Login Component
 * Provides:
 * - Authentication for interviewers and admins
 * - Form validation
 * - Error handling
 * - Redirection based on user role
 * - Handling of pending accounts requiring payment
 */
const InterviewerLogin = ({ authService = defaultAuthService, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginTitle, setLoginTitle] = useState('Sign In');
  const [logoutMessage, setLogoutMessage] = useState(null);
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
    
    // Check if we've just logged out
    const explicitLogout = sessionStorage.getItem('explicit_logout');
    const fromLogoutState = location.state?.loggedOut || false;
    
    // If we've just logged out, show the message and prevent subscription redirect
    if (explicitLogout === 'true' || fromLogoutState) {
      console.log('User has explicitly logged out');
      setLogoutMessage('You have been successfully logged out.');
      
      // Remove the logout flag from session storage to prevent it persisting across page refreshes
      sessionStorage.removeItem('explicit_logout');
      
      // Don't check for pending accounts when we've just logged out
      return;
    }
    
    // Clear any stored roles/tokens that might be causing issues
    if (location.state?.clearAuth) {
      console.log('Clearing auth data due to clearAuth state flag');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('pendingToken');
    }
    
    // Only check for pending account if we're not explicitly logging out
    if (authService.hasPendingAccount()) {
      console.log('Detected pending account requiring payment');
      navigate('/subscription', { replace: true });
    }
  }, [location, navigate, authService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
    
    // Clear logout message when user starts typing
    if (logoutMessage) setLogoutMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setLogoutMessage(null);
    
    try {
      console.log('Login attempt with:', credentials);
      
      // Use the authService directly instead of manual fetch
      const result = await authService.login(credentials);
      console.log('Login response:', result);
      
      // Check if the account requires payment (pending status)
      if (result && (result.status === 'pending' || result.requiresPayment)) {
        console.log('Account requires payment, redirecting to subscription page');
        navigate('/subscription', { replace: true });
        return;
      }
      
      // If we have a token, proceed with login
      if (result && (result.access_token || result.token)) {
        const token = result.access_token || result.token;
        const role = result.role || authService.getUserRole() || 'interviewer';
        
        console.log('Authenticated with role:', role);
        
        // Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Force clear any existing unauthorized paths in history
        window.history.replaceState({}, '', 
          role === 'admin' ? '/admin/dashboard' : '/interviewer/dashboard'
        );
        
        // Use replace instead of push to avoid the back button going to login page
        navigate(role === 'admin' ? '/admin/dashboard' : '/interviewer/dashboard', { replace: true });
      } else {
        throw new Error('Authentication failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Check for payment required error
      if (err.response?.status === 402) {
        console.log('Payment required error detected, redirecting to subscription page');
        navigate('/subscription', { replace: true });
        return;
      }
      
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
          {logoutMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {logoutMessage}
            </Alert>
          )}
          
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
              label="User Name or Email Address"
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
              <Typography variant="body2" sx={{ mb: 1 }}>
                {/* For testing a pending account, use:
                <br />
                Email: pending@example.com
                <br />
                Password: pending123 */}
              </Typography>
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