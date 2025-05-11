/**
 * Loading Overlay Component
 * 
 * Provides a fullscreen loading indicator with customizable message.
 * 
 * Features:
 * - Fullscreen overlay with backdrop
 * - Animated loading spinner
 * - Customizable loading message
 * - Optional transparency settings
 */

import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

const LoadingOverlay = ({ 
  isLoading = true, 
  message = 'Loading...', 
  transparent = false 
}) => {
  if (!isLoading) return null;
  
  return (
    <Backdrop
      open={isLoading}
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: transparent ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.85)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6" component="div">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;