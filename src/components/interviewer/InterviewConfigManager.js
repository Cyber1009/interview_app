/**
 * InterviewConfigManager Component
 * 
 * Interviewer-specific component for managing interview-related configuration.
 * Uses the shared ConfigManager component for core functionality.
 * 
 * Features:
 * - Interview duration settings
 * - Question limits configuration
 * - Interview behavior settings (auto-end, video recording)
 * - Retry attempts configuration
 */
import React from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, TextField,
  Grid, Switch, alpha
} from '@mui/material';
import ConfigManager from '../shared/ConfigManager';

const InterviewConfigManager = () => {
  // Transform backend config to frontend format
  const transformConfig = (backendConfig) => ({
    interviewDuration: backendConfig.rate_limits?.interview || 30,
    questionsPerInterview: backendConfig.rate_limits?.questions || 5,
    maxRetries: backendConfig.rate_limits?.retries || 3,
    autoEndInterview: backendConfig.feature_flags?.autoEndInterview !== undefined 
      ? backendConfig.feature_flags.autoEndInterview 
      : true,
    recordVideo: backendConfig.feature_flags?.recordVideo !== undefined 
      ? backendConfig.feature_flags.recordVideo 
      : true
  });

  // Validate config before saving
  const validateConfig = (config) => {
    if (config.interviewDuration < 1 || config.interviewDuration > 120) {
      return false;
    }
    if (config.questionsPerInterview < 1 || config.questionsPerInterview > 50) {
      return false;
    }
    if (config.maxRetries < 0 || config.maxRetries > 10) {
      return false;
    }
    return true;
  };

  // Transform frontend config to backend format for saving
  const prepareForSave = (frontendConfig) => ({
    rate_limits: {
      interview: frontendConfig.interviewDuration,
      questions: frontendConfig.questionsPerInterview,
      retries: frontendConfig.maxRetries
    },
    feature_flags: {
      autoEndInterview: frontendConfig.autoEndInterview,
      recordVideo: frontendConfig.recordVideo
    }
  });

  return (
    <ConfigManager 
      configType="interview"
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
            Interview Configuration
          </Typography>
          
          <Grid container spacing={3}>
            {/* Interview Settings Card */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: '100%'
              }}>
                <CardHeader 
                  title="Interview Settings"
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
                      Default Interview Duration (minutes)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.interviewDuration}
                      onChange={(e) => updateConfig({ interviewDuration: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 5, max: 120 }
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Questions Per Interview
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.questionsPerInterview}
                      onChange={(e) => updateConfig({ questionsPerInterview: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 1, max: 20 }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Interview Behavior Card */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: '100%'
              }}>
                <CardHeader 
                  title="Interview Behavior"
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
                      <Typography variant="subtitle2">Auto End Interview</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automatically end interview when all questions are answered
                      </Typography>
                    </Box>
                    <Switch
                      checked={config.autoEndInterview}
                      onChange={(e) => updateConfig({ autoEndInterview: e.target.checked })}
                      color="primary"
                    />
                  </Box>
                  
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
                      <Typography variant="subtitle2">Record Video</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Enable video recording for candidate responses
                      </Typography>
                    </Box>
                    <Switch
                      checked={config.recordVideo}
                      onChange={(e) => updateConfig({ recordVideo: e.target.checked })}
                      color="primary"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Maximum Retry Attempts
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      value={config.maxRetries}
                      onChange={(e) => updateConfig({ maxRetries: Number(e.target.value) })}
                      InputProps={{
                        inputProps: { min: 0, max: 10 }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </ConfigManager>
  );
};

export default InterviewConfigManager;