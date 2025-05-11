/**
 * SystemSettings Component
 * 
 * Admin interface for managing system configurations:
 * - System-wide settings
 * - Security settings
 * - Feature flags
 */
import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

import AdminConfigManager from './AdminConfigManager';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h5" component="h1">
            System Settings
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ pb: 2 }}>
          <AdminConfigManager />
        </Box>
      </Paper>
    </Container>
  );
};

export default SystemSettings;