/**
 * Enhanced Token Manager Component
 * Extends the basic TokenManager with advanced features:
 * - Bulk token generation
 * - Token status visualization (active, used, expired)
 * - Detailed token summaries
 * - Grid view for tokens
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Snackbar, 
  Alert,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  alpha,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

// Updated import to use the consolidated API
import { interviewerAPI } from '../../../api';

const TokenManagerExtended = ({
  interviewId,
  tokens = [],
  loading = false,
  error = null,
  onTokensChange = () => {},
  onError = () => {}
}) => {
  const [processingAction, setProcessingAction] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const handleGenerateToken = async () => {
    try {
      setProcessingAction(true);
      
      const response = await interviewerAPI.generateToken(interviewId);
      
      if (response && response.data) {
        // Fetch fresh tokens to update the UI
        const tokensResponse = await interviewerAPI.getTokensByInterview(interviewId);
        if (tokensResponse && tokensResponse.data) {
          onTokensChange(tokensResponse.data);
          setNotification({
            open: true,
            message: 'Token generated successfully',
            severity: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Failed to generate token:', error);
      onError('Failed to generate token. Please try again.');
      setNotification({
        open: true,
        message: 'Failed to generate token. Please try again.',
        severity: 'error'
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleBulkGenerateTokens = async (count) => {
    try {
      setProcessingAction(true);
      
      // Call the API multiple times to generate multiple tokens
      const generatePromises = [];
      for (let i = 0; i < count; i++) {
        generatePromises.push(interviewerAPI.generateToken(interviewId));
      }
      
      await Promise.all(generatePromises);
      
      // Fetch fresh tokens to update the UI
      const tokensResponse = await interviewerAPI.getTokensByInterview(interviewId);
      if (tokensResponse && tokensResponse.data) {
        onTokensChange(tokensResponse.data);
        setNotification({
          open: true,
          message: `${count} tokens generated successfully`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Failed to generate bulk tokens:', error);
      onError('Failed to generate tokens. Please try again.');
      setNotification({
        open: true,
        message: 'Failed to generate tokens. Please try again.',
        severity: 'error'
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    try {
      await interviewerAPI.deleteToken(interviewId, tokenId);
      
      // Update tokens list by removing the deleted token
      const updatedTokens = tokens.filter(token => token.id !== tokenId);
      onTokensChange(updatedTokens);
      
      setNotification({
        open: true,
        message: 'Token deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to delete token:', error);
      onError('Failed to delete token. Please try again.');
      setNotification({
        open: true,
        message: 'Failed to delete token. Please try again.',
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

  // Get token status: active, used, or expired
  const getTokenStatus = (token) => {
    if (!token.expires_at) return 'active';
    const now = new Date();
    const expiryDate = new Date(token.expires_at);
    if (now > expiryDate) return 'expired';
    return token.is_used ? 'used' : 'active';
  };

  // Get color based on token status
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'used': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  // Group tokens by status
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
      {/* Token Actions */}
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
                  startIcon={processingAction ? null : <AddIcon />}
                  sx={{ 
                    height: 48, 
                    px: 3,
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                    fontWeight: 500,
                    position: 'relative'
                  }}
                  disabled={processingAction}
                >
                  {processingAction ? (
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
                  disabled={processingAction}
                >
                  Generate 5 Tokens
                </Button>
              </Box>
              
              {interviewId && (
                <Box sx={{ mt: 2, px: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tokens will be generated for interview ID: {interviewId}
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
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: 120 
                }}>
                  <CircularProgress />
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
              title="Access Tokens"
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
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: 200 
                }}>
                  <CircularProgress />
                </Box>
              ) : tokens.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No tokens available. Generate tokens to get started.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {tokens.map((token, index) => {
                    // Get token value using the correct property name
                    const tokenValue = token.token_value || token.value || token.code;
                    
                    // Skip rendering if token doesn't have a value
                    if (!tokenValue) return null;
                    
                    const status = getTokenStatus(token);
                    const expiryDate = token.expires_at ? new Date(token.expires_at) : null;
                    const timeLeft = expiryDate ? expiryDate - new Date() : null;
                    const hoursLeft = timeLeft ? Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60))) : null;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={token.id || index}>
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
                              {tokenValue}
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
                              <Tooltip title="Copy to clipboard">
                                <IconButton 
                                  onClick={() => handleCopyToClipboard(tokenValue)} 
                                  size="small"
                                  color="primary"
                                >
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete token">
                                <IconButton 
                                  onClick={() => handleDeleteToken(token.id)} 
                                  color="error"
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification snackbar */}
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

export default TokenManagerExtended;