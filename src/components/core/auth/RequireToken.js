import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Alert, Paper, Typography, Button } from '@mui/material';
// Import from consolidated API
import { candidatesAPI } from '../../../api';

/**
 * RequireToken Component
 * 
 * Provides interview token validation and protection for interview routes.
 * 
 * Features:
 * - Interview token validation
 * - Loading state handling
 * - Error display
 * - Redirection for invalid tokens
 */
const RequireToken = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const { interviewId } = useParams();
  const location = useLocation();
  
  useEffect(() => {
    const validateInterviewToken = async () => {
      try {
        const token = localStorage.getItem('interviewToken');
        if (!token) {
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        
        const response = await candidatesAPI.verifyToken(token);
        
        if (response.valid && response.interview_id.toString() === interviewId) {
          setIsValid(true);
        } else {
          localStorage.removeItem('interviewToken');
          setIsValid(false);
          setError('This interview token is invalid or has expired.');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('interviewToken');
        setIsValid(false);
        setError('Unable to validate your interview token. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };
    
    validateInterviewToken();
  }, [interviewId]);
  
  if (isValidating) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Validating your interview access...
        </Typography>
      </Box>
    );
  }
  
  if (!isValid) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3
      }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Access Denied
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Invalid or missing interview token'}
          </Alert>
          
          <Typography variant="body1" paragraph>
            You need a valid access token to participate in this interview.
          </Typography>
          
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => window.location.href = '/access'}
          >
            Enter Access Token
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return children;
};

export default RequireToken;