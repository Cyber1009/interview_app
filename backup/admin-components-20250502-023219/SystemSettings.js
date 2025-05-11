import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, TextField,
  Button, Grid, FormControlLabel, Switch, Alert, CircularProgress,
  alpha, Divider, Tooltip, Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { adminAPI } from '../../services/api';

/**
 * SystemSettings Component
 * 
 * Admin-specific component for managing system-wide configuration.
 * Based on the SystemConfigUpdate schema from the backend.
 * 
 * Features:
 * - Rate limits configuration
 * - Feature flags management
 * - Service connection settings
 * - System-wide timeouts
 */
const SystemSettings = () => {
  const [config, setConfig] = useState({
    rate_limits: {
      auth: 10,
      api: 100
    },
    feature_flags: {
      advanced_analytics: true,
      beta_features: false
    },
    timeouts: {
      session: 3600,
      response: 30
    },
    storage_paths: {
      recordings: "/uploads/recordings",
      exports: "/uploads/exports"
    },
    service_connections: {
      analytics: {
        enabled: true,
        api_key: "****"
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the admin API
      // const response = await adminAPI.getSystemConfig();
      // setConfig(response.data);
      
      // Simulate API call for demo
      setTimeout(() => {
        setConfig({
          rate_limits: {
            auth: 10,
            api: 100
          },
          feature_flags: {
            advanced_analytics: true,
            beta_features: false
          },
          timeouts: {
            session: 3600,
            response: 30
          },
          storage_paths: {
            recordings: "/uploads/recordings",
            exports: "/uploads/exports"
          },
          service_connections: {
            analytics: {
              enabled: true,
              api_key: "****"
            }
          }
        });
        setLoading(false);
      }, 500);
      
      setError(null);
    } catch (error) {
      console.error('Failed to fetch system config:', error);
      setError('Failed to load system configuration. Please try again.');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    
    try {
      // In a real app, this would call the admin API
      // await adminAPI.updateSystemConfig(config);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update system config:', error);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureFlagChange = (feature, value) => {
    setConfig({
      ...config,
      feature_flags: {
        ...config.feature_flags,
        [feature]: value
      }
    });
  };

  const handleRateLimitChange = (type, value) => {
    setConfig({
      ...config,
      rate_limits: {
        ...config.rate_limits,
        [type]: value
      }
    });
  };

  const handleTimeoutChange = (type, value) => {
    setConfig({
      ...config,
      timeouts: {
        ...config.timeouts,
        [type]: value
      }
    });
  };

  const handleStoragePathChange = (type, value) => {
    setConfig({
      ...config,
      storage_paths: {
        ...config.storage_paths,
        [type]: value
      }
    });
  };

  const handleServiceConnectionChange = (service, field, value) => {
    setConfig({
      ...config,
      service_connections: {
        ...config.service_connections,
        [service]: {
          ...config.service_connections[service],
          [field]: value
        }
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        System Settings
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuration saved successfully!
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Rate Limits Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="Rate Limits"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Authentication Requests (per minute)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.rate_limits.auth}
                  onChange={(e) => handleRateLimitChange('auth', Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 1, max: 1000 }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  API Requests (per minute)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.rate_limits.api}
                  onChange={(e) => handleRateLimitChange('api', Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 1, max: 1000 }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Feature Flags Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="Feature Flags"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box>
                  <Typography variant="subtitle2">Advanced Analytics</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable advanced data analysis features
                  </Typography>
                </Box>
                <Switch
                  checked={config.feature_flags.advanced_analytics}
                  onChange={(e) => handleFeatureFlagChange('advanced_analytics', e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    Beta Features
                    <Chip 
                      size="small" 
                      label="BETA" 
                      color="warning" 
                      variant="outlined" 
                      sx={{ ml: 1, height: 20, fontSize: '0.625rem' }} 
                    />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable experimental features
                  </Typography>
                </Box>
                <Switch
                  checked={config.feature_flags.beta_features}
                  onChange={(e) => handleFeatureFlagChange('beta_features', e.target.checked)}
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Timeouts Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="System Timeouts"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Session Timeout (seconds)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.timeouts.session}
                  onChange={(e) => handleTimeoutChange('session', Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 60, max: 86400 }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  API Response Timeout (seconds)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.timeouts.response}
                  onChange={(e) => handleTimeoutChange('response', Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 5, max: 120 }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Storage Paths Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="Storage Paths"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recordings Path
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={config.storage_paths.recordings}
                  onChange={(e) => handleStoragePathChange('recordings', e.target.value)}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Exports Path
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={config.storage_paths.exports}
                  onChange={(e) => handleStoragePathChange('exports', e.target.value)}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Service Connections Card */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="Service Connections"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                      Analytics Service
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 2,
                      borderRadius: 1,
                      bgcolor: 'background.default'
                    }}>
                      <Typography variant="body2">Enabled</Typography>
                      <Switch
                        checked={config.service_connections.analytics.enabled}
                        onChange={(e) => handleServiceConnectionChange('analytics', 'enabled', e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" gutterBottom>
                        API Key
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="password"
                        value={config.service_connections.analytics.api_key}
                        onChange={(e) => handleServiceConnectionChange('analytics', 'api_key', e.target.value)}
                      />
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ height: 48, px: 4 }}
        >
          {saving ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Saving...
            </>
          ) : "Save Configuration"}
        </Button>
      </Box>
    </Box>
  );
};

export default SystemSettings;