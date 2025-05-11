// src/components/ThankYou.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  ThemeProvider,
  Fade,
} from '@mui/material';
import {
  CheckCircle,
  Home
} from '@mui/icons-material';
// import theme from '../styles/theme';

/**
 * Thank You Component
 * Displays:
 * - Interview completion message
 * - Next steps information
 * - Return to home option
 * - Success animations and feedback
 */

function ThankYou() {
  const navigate = useNavigate();

  return (
    // <ThemeProvider theme={theme}>
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
            }}
          >
            <CheckCircle
              sx={{
                fontSize: 80,
                color: 'success.main',
                mb: 3
              }}
            />
            
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.main'  
              }}
            >
              Thank You!
            </Typography>

            <Typography
              variant="h6"
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              Your interview has been successfully completed and submitted.
            </Typography>

            <Typography
              variant="body1"
              sx={{ mb: 4 }}
            >
              We appreciate your time and effort in participating in this video interview. 
              Our team will review your responses and get back to you soon.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 30,
                bgcolor: 'primary.main' 
              }}
            >
              Return to Home
            </Button>
          </Paper>
        </Container>
      </Box>
    </Fade>
  // </ThemeProvider>
  );
}

export default ThankYou;