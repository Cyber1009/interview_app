import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, TextField,
  Button, Grid, FormControlLabel, Switch, Alert, CircularProgress,
  alpha, Divider, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { configAPI } from '../../services/api';

/**
 * InterviewConfigManager Component
 * 
 * Allows interviewers to configure interview settings.
 * 
 * Features:
 * - Interview duration configuration
 * - Questions per interview setting
 * - Recording and auto-end options
 * - Configuration persistence
 */
const ConfigManager = () => {
  const [config, setConfig] = useState({
    interviewDuration: 30,
    questionsPerInterview: 5,
    autoEndInterview: true,
    recordVideo: true,
    maxRetries: 3
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
      const response = await configAPI.getConfig();
      setConfig(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      setError('Failed to load configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    
    try {
      await configAPI.updateConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update config:', error);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
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
        Interview Configuration
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
      
      <Card elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Interview Duration (minutes)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.interviewDuration}
                  onChange={(e) => setConfig({...config, interviewDuration: Number(e.target.value)})}
                  InputProps={{
                    inputProps: { min: 5, max: 120 }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Questions Per Interview
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.questionsPerInterview}
                  onChange={(e) => setConfig({...config, questionsPerInterview: Number(e.target.value)})}
                  InputProps={{
                    inputProps: { min: 1, max: 20 }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Max Retry Attempts
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  size="small"
                  value={config.maxRetries}
                  onChange={(e) => setConfig({...config, maxRetries: Number(e.target.value)})}
                  InputProps={{
                    inputProps: { min: 0, max: 10 }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
                  <Typography variant="subtitle2">Auto End Interview</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically end interview when time runs out
                  </Typography>
                </Box>
                <Switch
                  checked={config.autoEndInterview}
                  onChange={(e) => setConfig({...config, autoEndInterview: e.target.checked})}
                  color="primary"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
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
                  <Typography variant="subtitle2">Record Video</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Record video responses for later review
                  </Typography>
                </Box>
                <Switch
                  checked={config.recordVideo}
                  onChange={(e) => setConfig({...config, recordVideo: e.target.checked})}
                  color="primary"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
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