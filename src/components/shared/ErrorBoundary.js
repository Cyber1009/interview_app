import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

/**
 * Error Boundary Component
 * Provides:
 * - Global error catching
 * - Graceful error UI
 * - Error recovery options
 * - Prevents app crashes
 */
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

  handleReload = () => {
    window.location.reload();
  }

  handleGoHome = () => {
    window.location.href = '/';
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
                We apologize for the inconvenience. The application encountered an unexpected error.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={this.handleReload}>
                  Reload Page
                </Button>
                <Button variant="outlined" onClick={this.handleGoHome}>
                  Go to Home
                </Button>
              </Box>
              
              {/* Only show error details in development */}
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                  <Typography variant="subtitle2" color="error">
                    Error Details (Development Only):
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'grey.100',
                      p: 2,
                      mt: 1,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: 'caption.fontSize',
                      overflow: 'auto'
                    }}
                  >
                    <pre>{this.state.error?.toString()}</pre>
                    <pre>{this.state.errorInfo?.componentStack}</pre>
                  </Paper>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      );
    }

    // If no error occurred, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;