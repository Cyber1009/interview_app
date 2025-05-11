/**
 * Error Boundary Component
 * 
 * Provides global error catching and fallback UI for React errors.
 * 
 * Features:
 * - Global error catching
 * - Graceful error UI
 * - Error recovery options
 * - Prevents app crashes
 */

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
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
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Something Went Wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We've encountered an unexpected error. Please try again or contact support if the problem persists.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => window.location.reload()}
                  sx={{ mr: 2 }}
                >
                  Refresh Page
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => this.setState({ hasError: false })}
                >
                  Try Again
                </Button>
              </Box>
              {this.props.showDetails && this.state.error && (
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Error Details:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'grey.100',
                      maxHeight: '200px',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem'
                    }}
                  >
                    {this.state.error.toString()}
                  </Paper>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;