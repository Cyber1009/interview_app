/**
 * ConfigManager Component
 * 
 * A base configuration management component that can be extended
 * for specific configuration needs (interview, admin, system).
 * 
 * Features:
 * - Loads configuration from API
 * - Provides structured state management
 * - Handles saving configurations with validation
 * - Manages loading and error states
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Alert, CircularProgress, Divider
} from '@mui/material';
// Update import to use consolidated API
import { systemAPI } from '../../api';

const ConfigManager = ({ 
  configType = 'general',  // Type of configuration to manage
  onConfigChange,         // Callback for config changes
  transformConfig,        // Transform function for backend to frontend
  validateConfig,         // Validation function before saving
  children               // Children render prop function
}) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Load configuration data
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await systemAPI.getConfig(configType);
      
      // Transform backend response to frontend format if needed
      const frontendConfig = transformConfig 
        ? transformConfig(response.data) 
        : response.data;
      
      setConfig(frontendConfig);
      
      // Notify parent of config changes if needed
      if (onConfigChange) {
        onConfigChange(frontendConfig);
      }
      
    } catch (err) {
      console.error(`Failed to fetch ${configType} config:`, err);
      setError(`Failed to load configuration. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [configType, onConfigChange, transformConfig]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Update configuration state
  const updateConfig = (changes) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...changes
    }));
  };

  // Save configuration to backend
  const saveConfig = async () => {
    // Validate config if validation function provided
    if (validateConfig && !validateConfig(config)) {
      setError('Invalid configuration. Please check your settings.');
      return;
    }
    
    setSaving(true);
    setSaved(false);
    setError(null);
    
    try {
      await systemAPI.updateConfig(config, configType);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(`Failed to update ${configType} config:`, err);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset configuration to last saved state
  const resetConfig = () => {
    fetchConfig();
  };

  // Render loading state
  if (loading && !Object.keys(config).length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render based on how this component is used
  if (typeof children === 'function') {
    // Render prop pattern for flexibility
    return children({
      config,
      updateConfig,
      saveConfig,
      resetConfig,
      loading,
      saving,
      saved,
      error,
      setError
    });
  }

  // Default UI if no render prop provided
  return (
    <Box sx={{ p: 3 }}>
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
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Configuration
        </Typography>
        <Divider />
      </Box>
      
      {/* Config content would go here when not using render prop */}
      <Box sx={{ opacity: loading ? 0.7 : 1 }}>
        {children}
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={resetConfig}
          disabled={loading || saving}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={saveConfig}
          disabled={saving}
          sx={{ minWidth: 120 }}
        >
          {saving ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Saving...
            </>
          ) : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigManager;