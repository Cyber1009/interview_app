import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { SentimentVeryDissatisfied as SadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * NotFound Component
 * Provides:
 * - 404 page for non-existent routes
 * - Navigation options to return to valid parts of the app
 * - User-friendly error messaging
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 5
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
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