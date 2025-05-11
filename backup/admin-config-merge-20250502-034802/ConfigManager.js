import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, TextField,
  Button, Grid, FormControlLabel, Switch, Alert, CircularProgress,
  alpha, Divider, Tooltip, Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { adminAPI } from '../../services/api';

/**
 * ConfigManager Component
 * 
 * Admin-specific component for managing system-wide configuration settings.
 * Focuses exclusively on system administration parameters, not interview-specific settings.
 * 
 * Features:
 * - System rate limits
 * - Security settings
 * - Logging configuration
 * - System maintenance options
 */
const ConfigManager = () => {
  const [config, setConfig] = useState({
    rate_limits: {
      global_requests: 1000,
      auth_attempts: 5,
      password_reset: 3
    },
    security: {
      session_timeout: 3600,
      password_expiry_days: 90,
      enforce_2fa: false
    },
    logging: {
      level: "info",
      retain_days: 30
    },
    maintenance: {
      scheduled: false,
      maintenance_message: "System is undergoing scheduled maintenance. Please check back later."
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
    setError(null);
    
    try {
      // In a real app, this would call the admin API
      // const response = await adminAPI.getSystemConfig();
      // setConfig(response.data);
      
      // Simulate API call for demo
      setTimeout(() => {
        setConfig({
          rate_limits: {
            global_requests: 1000,
            auth_attempts: 5,
            password_reset: 3
          },
          security: {
            session_timeout: 3600,
            password_expiry_days: 90,
            enforce_2fa: false
          },
          logging: {
            level: "info",
            retain_days: 30
          },
          maintenance: {
            scheduled: false,
            maintenance_message: "System is undergoing scheduled maintenance. Please check back later."
          }
        });
        setLoading(false);
      }, 500);
      
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

  const handleRateLimitChange = (type, value) => {
    setConfig({
      ...config,
      rate_limits: {
        ...config.rate_limits,
        [type]: parseInt(value)
      }
    });
  };

  const handleSecurityChange = (setting, value) => {
    setConfig({
      ...config,
      security: {
        ...config.security,
        [setting]: typeof value === 'boolean' ? value : parseInt(value)
      }
    });
  };

  const handleLoggingChange = (setting, value) => {
    setConfig({
      ...config,
      logging: {
        ...config.logging,
        [setting]: setting === 'level' ? value : parseInt(value)
      }
    });
  };

  const handleMaintenanceChange = (setting, value) => {
    setConfig({
      ...config,
      maintenance: {
        ...config.maintenance,
        [setting]: value
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
        System Configuration
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
              title="System Rate Limits"
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
                  Global Requests (per minute)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.rate_limits.global_requests}
                  onChange={(e) => handleRateLimitChange('global_requests', e.target.value)}
                  InputProps={{
                    inputProps: { min: 100, max: 10000 }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Auth Attempts (per user/hour)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.rate_limits.auth_attempts}
                  onChange={(e) => handleRateLimitChange('auth_attempts', e.target.value)}
                  InputProps={{
                    inputProps: { min: 1, max: 20 }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Password Reset (per user/day)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.rate_limits.password_reset}
                  onChange={(e) => handleRateLimitChange('password_reset', e.target.value)}
                  InputProps={{
                    inputProps: { min: 1, max: 10 }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Security Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="Security Settings"
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
                  value={config.security.session_timeout}
                  onChange={(e) => handleSecurityChange('session_timeout', e.target.value)}
                  InputProps={{
                    inputProps: { min: 300, max: 86400 }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Password Expiry (days)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.security.password_expiry_days}
                  onChange={(e) => handleSecurityChange('password_expiry_days', e.target.value)}
                  InputProps={{
                    inputProps: { min: 30, max: 365 }
                  }}
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
                  <Typography variant="subtitle2">Enforce 2FA</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Require two-factor authentication for all admin users
                  </Typography>
                </Box>
                <Switch
                  checked={config.security.enforce_2fa}
                  onChange={(e) => handleSecurityChange('enforce_2fa', e.target.checked)}
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Logging Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="Logging Configuration"
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
                  Log Level
                </Typography>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  size="small"
                  value={config.logging.level}
                  onChange={(e) => handleLoggingChange('level', e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </TextField>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Log Retention (days)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.logging.retain_days}
                  onChange={(e) => handleLoggingChange('retain_days', e.target.value)}
                  InputProps={{
                    inputProps: { min: 1, max: 365 }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Maintenance Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardHeader 
              title="System Maintenance"
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
                  <Typography variant="subtitle2">
                    Maintenance Mode
                    {config.maintenance.scheduled && (
                      <Chip 
                        size="small" 
                        label="ACTIVE" 
                        color="error" 
                        variant="outlined" 
                        sx={{ ml: 1, height: 20, fontSize: '0.625rem' }} 
                      />
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Activate system maintenance mode
                  </Typography>
                </Box>
                <Switch
                  checked={config.maintenance.scheduled}
                  onChange={(e) => handleMaintenanceChange('scheduled', e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Maintenance Message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                  value={config.maintenance.maintenance_message}
                  onChange={(e) => handleMaintenanceChange('maintenance_message', e.target.value)}
                />
              </Box>
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

export default ConfigManager;
