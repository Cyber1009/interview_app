import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField,
  Button, Grid, FormControlLabel, Switch
} from '@mui/material';
import { configAPI } from '../../services/api';

const ConfigManager = () => {
  const [config, setConfig] = useState({
    interviewDuration: 30,
    questionsPerInterview: 5,
    autoEndInterview: true,
    recordVideo: true,
    maxRetries: 3
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await configAPI.getConfig();
      
      // Transform backend response to frontend format
      const backendConfig = response.data;
      const frontendConfig = {
        interviewDuration: backendConfig.rate_limits?.interview || 30,
        questionsPerInterview: backendConfig.rate_limits?.questions || 5,
        maxRetries: backendConfig.rate_limits?.retries || 3,
        autoEndInterview: backendConfig.feature_flags?.autoEndInterview !== undefined 
          ? backendConfig.feature_flags.autoEndInterview 
          : true,
        recordVideo: backendConfig.feature_flags?.recordVideo !== undefined 
          ? backendConfig.feature_flags.recordVideo 
          : true
      };
      
      setConfig(frontendConfig);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const handleSave = async () => {
    try {
      await configAPI.updateConfig(config);
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>Interview Configuration</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interview Duration (minutes)"
                type="number"
                value={config.interviewDuration}
                onChange={(e) => setConfig({...config, interviewDuration: Number(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Questions Per Interview"
                type="number"
                value={config.questionsPerInterview}
                onChange={(e) => setConfig({...config, questionsPerInterview: Number(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Retry Attempts"
                type="number"
                value={config.maxRetries}
                onChange={(e) => setConfig({...config, maxRetries: Number(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.autoEndInterview}
                    onChange={(e) => setConfig({...config, autoEndInterview: e.target.checked})}
                  />
                }
                label="Auto End Interview"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.recordVideo}
                    onChange={(e) => setConfig({...config, recordVideo: e.target.checked})}
                  />
                }
                label="Record Video"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSave}>
                Save Configuration
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfigManager;
