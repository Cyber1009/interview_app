import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Admin Dashboard Overview Component
 * Provides:
 * - Quick access to key admin functions
 * - System status overview
 * - User management navigation
 */
const Overview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const dashboardItems = [
    { 
      title: 'System Settings', 
      path: '/admin/settings', 
      description: 'Configure system-wide settings and parameters.' 
    },
    { 
      title: 'User Management', 
      path: '/admin/users', 
      description: 'Manage user accounts and subscriptions.' 
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Welcome to the Interview Admin Dashboard
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
        {dashboardItems.map((item) => (
          <Paper 
            key={item.title}
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 2,
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate(item.path)}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Overview;