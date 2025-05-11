import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Paper, IconButton, Card, CardContent, CardHeader,
  CircularProgress, Snackbar, Alert, LinearProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add as AddIcon, Delete as DeleteIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { tokenAPI } from '../../services/api';

const AccessToken = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [activeInterviewId, setActiveInterviewId] = useState(null);

  useEffect(() => {
    const storedInterviewId = localStorage.getItem('activeInterviewId');
    if (storedInterviewId) {
      setActiveInterviewId(storedInterviewId);
    }
    
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      // Important: Pass the interview ID when fetching tokens
      const response = await tokenAPI.getTokens(activeInterviewId);
      console.log('Fetched tokens:', response);
      setTokens(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setNotification({
        open: true,
        message: `Failed to fetch tokens: ${error.response?.data?.detail || error.message}`,
        severity: 'error'
      });
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    setTokenLoading(true);
    try {
      console.log('Generating token for interview:', activeInterviewId);
      // Use the backendGenerateTokens method for better reliability
      const response = await tokenAPI.backendGenerateTokens(activeInterviewId, 1);
      console.log('Token generated response:', response);
      await fetchTokens();
      setNotification({
        open: true,
        message: 'Token generated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to generate token:', error);
      let errorMessage = 'Failed to generate token. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.detail || 
                       `Server error: ${error.response.status}`;
        console.log('Error response data:', error.response.data);
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setTokenLoading(false);
    }
  };

  const handleBulkGenerateTokens = async (count) => {
    setTokenLoading(true);
    try {
      console.log(`Generating ${count} tokens for interview:`, activeInterviewId);
      // Use the bulk generation endpoint with the correct parameters
      const response = await tokenAPI.generateBulkTokens(activeInterviewId, count);
      console.log('Bulk tokens generated:', response);
      await fetchTokens();
      setNotification({
        open: true,
        message: `${count} tokens generated successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to generate bulk tokens:', error);
      let errorMessage = 'Failed to generate tokens. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.detail || 
                       `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setTokenLoading(false);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    try {
      console.log(`Deleting token ${tokenId} for interview:`, activeInterviewId);
      // Delete token with the correct parameters
      await tokenAPI.deleteToken(tokenId, activeInterviewId);
      await fetchTokens();
      setNotification({
        open: true,
        message: 'Token deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to delete token:', error);
      setNotification({
        open: true,
        message: `Failed to delete token: ${error.response?.data?.detail || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCopyToClipboard = (tokenValue) => {
    navigator.clipboard.writeText(tokenValue).then(() => {
      setNotification({
        open: true,
        message: 'Token copied to clipboard',
        severity: 'success'
      });
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getTokenStatus = (token) => {
    if (!token.expiresAt) return 'active';
    const now = new Date();
    const expiryDate = new Date(token.expiresAt);
    if (now > expiryDate) return 'expired';
    return token.is_used ? 'used' : 'active';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'used': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getTokenGroups = () => {
    return tokens.reduce((acc, token) => {
      const status = getTokenStatus(token);
      if (!acc[status]) acc[status] = [];
      acc[status].push(token);
      return acc;
    }, { active: [], used: [], expired: [] });
  };

  const tokenGroups = getTokenGroups();

  return (
    <Box>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Access Tokens
      </Typography>

      <Grid container spacing={3}>
        {/* Actions Card */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateToken}
                  startIcon={tokenLoading ? null : <AddIcon />}
                  sx={{ 
                    height: 48, 
                    px: 3,
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                    fontWeight: 500,
                    position: 'relative'
                  }}
                  disabled={tokenLoading}
                >
                  {tokenLoading ? (
                    <CircularProgress 
                      size={24} 
                      sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px'
                      }} 
                    />
                  ) : 'Generate New Token'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleBulkGenerateTokens(5)}
                  sx={{ 
                    height: 48, 
                    px: 3,
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                    fontWeight: 500
                  }}
                  disabled={tokenLoading}
                >
                  Generate 5 Tokens
                </Button>
              </Box>
              
              {activeInterviewId && (
                <Box sx={{ mt: 2, px: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tokens will be generated for interview ID: {activeInterviewId}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Token Summary Card */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="Token Summary"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              {loading ? (
                <Box sx={{ width: '100%', my: 2 }}>
                  <LinearProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {Object.entries(tokenGroups).map(([status, tokenList]) => (
                    <Grid item xs={4} key={status}>
                      <Box sx={{ 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center'
                      }}>
                        <Typography 
                          variant="overline" 
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            color: 'text.secondary'
                          }}
                        >
                          {status}
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mt: 1, 
                            color: `${getStatusColor(status)}.main`,
                            fontSize: '2rem',
                            fontWeight: 700,
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {tokenList.length}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Token List */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="Active Tokens"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : tokens.length > 0 ? (
                <Grid container spacing={2}>
                  {tokens.map((token) => {
                    const status = getTokenStatus(token);
                    const expiryDate = token.expiresAt ? new Date(token.expiresAt) : null;
                    const timeLeft = expiryDate ? expiryDate - new Date() : null;
                    const hoursLeft = timeLeft ? Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60))) : null;

                    return (
                      <Grid item xs={12} sm={6} md={4} key={token.id || token.token_id}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              px: 2,
                              py: 0.5,
                              bgcolor: (theme) => alpha(theme.palette[getStatusColor(status)].main, 0.1),
                              color: `${getStatusColor(status)}.main`,
                              borderBottomLeftRadius: 8,
                              textTransform: 'capitalize',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {status}
                          </Box>
                          <Box sx={{ pt: 1 }}>
                            <Typography variant="h6" sx={{ 
                              fontSize: '0.875rem',
                              fontFamily: 'inherit',
                              letterSpacing: '0.02em',
                              fontWeight: 500
                            }}>
                              {token.token_value || token.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {status === 'expired' ? 'Expired' : 
                              status === 'active' ? (expiryDate ? `Expires in ${hoursLeft}h` : 'No expiration') :
                              'Used'}
                            </Typography>
                            <Box sx={{ 
                              mt: 2,
                              pt: 2,
                              borderTop: '1px solid',
                              borderColor: 'divider',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <IconButton 
                                onClick={() => handleCopyToClipboard(token.token_value || token.value)} 
                                size="small"
                                color="primary"
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteToken(token.id || token.token_id)} 
                                color="error"
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No tokens available. Generate tokens to get started.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccessToken;
