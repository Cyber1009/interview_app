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
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  QuestionAnswer as QuestionIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

// Import the settings-related components
import ThemeSettings from './ThemeSettings';
import InterviewConfigManager from './InterviewConfigManager';

/**
 * Settings Component
 * 
 * A unified settings interface with:
 * - Tab-based navigation between different settings sections
 * - Theme & branding configuration
 * - Interview configuration
 */
const Settings = ({ onThemeChange, logo, onLogoChange }) => {
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
            Settings
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            mb: 3,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            }
          }}
        >
          <Tab 
            label="Theme & Branding" 
            icon={<PaletteIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Interview Configuration" 
            icon={<SpeedIcon />} 
            iconPosition="start"
          />
        </Tabs>
        
        {activeTab === 0 && (
          <ThemeSettings 
            onThemeChange={onThemeChange}
            logo={logo}
            onLogoChange={onLogoChange}
          />
        )}
        
        {activeTab === 1 && (
          <InterviewConfigManager />
        )}
      </Paper>
    </Container>
  );
};

export default Settings;