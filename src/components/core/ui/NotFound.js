/**
 * NotFound Component
 * 
 * Provides a standard 404 page for the application.
 * 
 * Features:
 * - Consistent 404 page design
 * - Navigation options to return home or go back
 * - Responsive layout
 */

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <SadIcon color="primary" sx={{ fontSize: 80, mb: 2, opacity: 0.7 }} />
          
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            404
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
              Go to Home
            </Button>
            <Button variant="outlined" onClick={handleGoBack}>
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;