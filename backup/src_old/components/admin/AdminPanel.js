/**
 * Admin Panel Component
 * Provides administration interface for:
 * - Managing interview questions and their timing
 * - Customizing application theme and branding
 * - Generating and managing access tokens
 * - Configuring practice and actual interview questions
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Tab,
  Tabs,
  Grid,
  Drawer,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, QuestionMark as QuestionIcon, Palette as PaletteIcon, Key as KeyIcon, AccessTime, Videocam } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { generateToken, cleanExpiredTokens } from '../../utils/tokenGenerator';
import SetTheme from './SetTheme';
import SetQuestion from './SetQuestion';
import AccessToken from './AccessToken';

function AdminPanel({ onThemeChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const [logo, setLogo] = useState(() => localStorage.getItem('companyLogo') || null);
  const drawerWidth = 280;  // Increased width

  const menuItems = [
    { 
      id: 0, 
      label: 'Interview Questions', 
      icon: <QuestionIcon />,
      component: <SetQuestion />
    },
    { 
      id: 1, 
      label: 'Theme Settings', 
      icon: <PaletteIcon />,
      component: <SetTheme onThemeChange={onThemeChange} logo={logo} onLogoChange={setLogo} />
    },
    { 
      id: 2, 
      label: 'Access Tokens', 
      icon: <KeyIcon />,
      component: <AccessToken />
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'background.default',
      background: (theme) => `linear-gradient(${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.background.default, 1)} 400px)`
    }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(20px)',
            boxShadow: (theme) => theme.shadows[2]
          },
        }}
      >
        <Box sx={{ 
          p: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: (theme) => `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`,
        }}>
          {logo ? (
            <img 
              src={logo} 
              alt="Company Logo" 
              style={{ 
                width: '100%', 
                height: 'auto',
                maxHeight: 80,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          ) : (
            <Typography 
              variant="h5" 
              color="primary" 
              sx={{ 
                fontSize: '1.25rem', // Update header font size
                fontWeight: 700,
                letterSpacing: '0.01em'
              }}
            >
              Interview Admin
            </Typography>
          )}
        </Box>

        <List sx={{ pt: 3, px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  transition: 'none',
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: activeTab === item.id ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '1rem',  // Update menu item font size
                    fontWeight: activeTab === item.id ? 600 : 500,
                    letterSpacing: '0.01em',
                    color: activeTab === item.id ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: '100%',
          width: '100%',
          minHeight: '100vh'
        }}
      >
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            minHeight: '90vh',
          }}
        >
          {menuItems[activeTab].component}
        </Paper>
      </Box>
    </Box>
  );
}

export default AdminPanel;