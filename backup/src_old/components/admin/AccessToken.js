import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Paper, IconButton, Card, CardContent, CardHeader
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { generateToken, cleanExpiredTokens } from '../../utils/tokenGenerator';

const AccessToken = () => {
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('interviewTokens');
    return savedTokens ? JSON.parse(savedTokens) : [];
  });

  useEffect(() => {
    const validTokens = cleanExpiredTokens(tokens);
    if (validTokens.length !== tokens.length) {
      setTokens(validTokens);
      localStorage.setItem('interviewTokens', JSON.stringify(validTokens));
    }
  }, []);

  const handleGenerateToken = () => {
    const newTokenData = generateToken();
    const updatedTokens = [...tokens, newTokenData];
    setTokens(updatedTokens);
    localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
  };

  const handleBulkGenerateTokens = (count) => {
    const newTokens = Array.from({ length: count }, () => generateToken());
    const updatedTokens = [...tokens, ...newTokens];
    setTokens(updatedTokens);
    localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
  };

  const handleDeleteToken = (tokenToDelete) => {
    const updatedTokens = tokens.filter(t => t.token !== tokenToDelete);
    setTokens(updatedTokens);
    localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
  };

  const getTokenStatus = (token) => {
    const now = new Date();
    const expiryDate = new Date(token.expiresAt);
    if (now > expiryDate) return 'expired';
    return token.used ? 'used' : 'active';
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
    const groups = tokens.reduce((acc, token) => {
      const status = getTokenStatus(token);
      if (!acc[status]) acc[status] = [];
      acc[status].push(token);
      return acc;
    }, { active: [], used: [], expired: [] });

    return groups;
  };

  const tokenGroups = getTokenGroups();

  return (
    <Box>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',  // Update page title font size
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
                  startIcon={<AddIcon />}
                  sx={{ 
                    height: 48, 
                    px: 3,
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                    fontWeight: 500
                  }}
                >
                  Generate New Token
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
                >
                  Generate 5 Tokens
                </Button>
              </Box>
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
              <Grid container spacing={2}>
                {Object.entries(tokenGroups).map(([status, tokens]) => (
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
                        {tokens.length}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
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
              <Grid container spacing={2}>
                {tokens.map((token) => {
                  const status = getTokenStatus(token);
                  const expiryDate = new Date(token.expiresAt);
                  const timeLeft = expiryDate - new Date();
                  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

                  return (
                    <Grid item xs={12} sm={6} md={4} key={token.token}>
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
                            {token.token}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {status === 'expired' ? 'Expired' : 
                             status === 'active' ? `Expires in ${hoursLeft}h` :
                             'Used'}
                          </Typography>
                          <Box sx={{ 
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'flex-end'
                          }}>
                            <IconButton 
                              onClick={() => handleDeleteToken(token.token)} 
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccessToken;
