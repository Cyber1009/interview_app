/**
 * AdminConfigManager Component
 * 
 * Admin-specific component for managing system configuration.
 * Uses the shared ConfigManager component for core functionality.
 * 
 * Features:
 * - System rate limits configuration
 * - Feature flags management
 * - Security settings
 * - API access controls
 */
import React from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, TextField,
  Grid, FormControlLabel, Switch, alpha, Divider
} from '@mui/material';
import ConfigManager from '../shared/ConfigManager';

const AdminConfigManager = () => {
  // Transform backend config to frontend format
  const transformConfig = (backendConfig) => ({
    // System settings
    maxUsersPerCompany: backendConfig.system?.maxUsersPerCompany || 50,
    maxConcurrentInterviews: backendConfig.system?.maxConcurrentInterviews || 10,
    storageQuotaMB: backendConfig.system?.storageQuotaMB || 5000,
    
    // Security settings
    passwordMinLength: backendConfig.security?.passwordMinLength || 8,
    passwordRequireSpecialChar: backendConfig.security?.passwordRequireSpecialChar || true,
    sessionTimeoutMinutes: backendConfig.security?.sessionTimeoutMinutes || 30,
    maxLoginAttempts: backendConfig.security?.maxLoginAttempts || 5,
    
    // Feature flags
    enableBetaFeatures: backendConfig.features?.enableBeta || false,
    enableAIAssistant: backendConfig.features?.enableAIAssistant || true,
    enableBulkImport: backendConfig.features?.enableBulkImport || true
  });

  // Validate config before saving
  const validateConfig = (config) => {
    if (config.maxUsersPerCompany < 1) return false;
    if (config.maxConcurrentInterviews < 1) return false;
    if (config.storageQuotaMB < 100) return false;
    if (config.passwordMinLength < 6) return false;
    if (config.sessionTimeoutMinutes < 5) return false;
    if (config.maxLoginAttempts < 1) return false;
    
    return true;
  };

  return (
    <ConfigManager 
      configType="admin"
      transformConfig={transformConfig}
      validateConfig={validateConfig}
    >
      {({ 
        config, 
        updateConfig, 
        saveConfig, 
        resetConfig,
        loading, 
        saving, 
        saved, 
        error 
      }) => (
        <Box sx={{ p: 0 }}>
          <Typography variant="h5" sx={{ 
            mb: 4, 
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '0.01em',
            color: 'text.primary'
          }}>
            System Configuration
          </Typography>
          
          <Grid container spacing={3}>
            {/* System Settings Card */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: '100%'
              }}>
                <CardHeader 
                  title="System Settings"
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
                      Max Users Per Company
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.maxUsersPerCompany}
                      onChange={(e) => updateConfig({ maxUsersPerCompany: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 1, max: 1000 }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Max Concurrent Interviews
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.maxConcurrentInterviews}
                      onChange={(e) => updateConfig({ maxConcurrentInterviews: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 1, max: 100 }
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Storage Quota (MB)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.storageQuotaMB}
                      onChange={(e) => updateConfig({ storageQuotaMB: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 100, max: 50000 }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Security Settings Card */}
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
                      Password Minimum Length
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.passwordMinLength}
                      onChange={(e) => updateConfig({ passwordMinLength: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 6, max: 30 }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Session Timeout (minutes)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.sessionTimeoutMinutes}
                      onChange={(e) => updateConfig({ sessionTimeoutMinutes: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 5, max: 240 }
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
                      <Typography variant="subtitle2">Require Special Characters</Typography>
                      <Typography variant="caption" color="text.secondary">
                        For password security
                      </Typography>
                    </Box>
                    <Switch
                      checked={config.passwordRequireSpecialChar}
                      onChange={(e) => updateConfig({ passwordRequireSpecialChar: e.target.checked })}
                      color="primary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Feature Flags Card */}
            <Grid item xs={12}>
              <Card elevation={0} sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%'
                      }}>
                        <Box>
                          <Typography variant="subtitle2">Enable Beta Features</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Enable experimental features
                          </Typography>
                        </Box>
                        <Switch
                          checked={config.enableBetaFeatures}
                          onChange={(e) => updateConfig({ enableBetaFeatures: e.target.checked })}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%'
                      }}>
                        <Box>
                          <Typography variant="subtitle2">AI Assistant</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Enable AI interview assistance
                          </Typography>
                        </Box>
                        <Switch
                          checked={config.enableAIAssistant}
                          onChange={(e) => updateConfig({ enableAIAssistant: e.target.checked })}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%'
                      }}>
                        <Box>
                          <Typography variant="subtitle2">Bulk Import</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Enable bulk user/question import
                          </Typography>
                        </Box>
                        <Switch
                          checked={config.enableBulkImport}
                          onChange={(e) => updateConfig({ enableBulkImport: e.target.checked })}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </ConfigManager>
  );
};

export default AdminConfigManager;