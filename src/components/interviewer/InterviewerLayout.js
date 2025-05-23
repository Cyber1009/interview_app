/**
 * Interviewer Dashboard Layout Component
 * 
 * A comprehensive layout for interviewer pages with:
 * - Consistent navigation sidebar
 * - User profile menu
 * - Theme and logo integration
 * - Proper logout handling
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  VideoCall as VideoIcon,
  Palette as ThemeIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

import SlimSidebarLayout from '../core/layout/SlimSidebarLayout';
import { AuthService } from '../../services';
import { Popover, Box, Typography, Avatar, Divider, Button, alpha } from '@mui/material';

const InterviewerLayout = ({ children, logo, onThemeChange }) => {
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  // Define navigation items for the interviewer dashboard
  const navItems = [
    {
      text: 'Dashboard',
      path: '/interviewer/dashboard',
      icon: <DashboardIcon />
    },
    {
      text: 'Interviews',
      path: '/interviewer/interviews',
      icon: <VideoIcon />
    },
    {
      text: 'Theme',
      path: '/interviewer/theme',
      icon: <ThemeIcon />
    }
  ];

  // Custom logout handler that uses AuthService for proper logout
  const handleLogout = () => {
    console.log('Logging out from InterviewerDashboard');
    // Use the AuthService logout method with navigate function
    AuthService.logout(navigate);
  };
  
  // Profile popover handlers
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  // Navigation to profile page
  const handleProfileNav = () => {
    navigate('/interviewer/profile');
    handleProfileClose();
  };
  
  const profileOpen = Boolean(profileAnchorEl);
  
  // Mock user data - in a real app, this would come from context or props
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Interviewer'
  };
  
  return (
    <>
      <SlimSidebarLayout
        navItems={navItems}
        logoData={logo}
        onLogout={handleLogout}
        headerButton={{
          icon: <AccountIcon />,
          tooltip: 'Your Profile',
          onClick: handleProfileClick
        }}
      >
        {children}
      </SlimSidebarLayout>
      
      <Popover
        open={profileOpen}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 280,
            p: 2,
            mt: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.8),
              color: 'white'
            }}
          >
            {userData.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {userData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.email}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          onClick={handleProfileNav}
          sx={{ mb: 1 }}
        >
          Manage Profile
        </Button>
        
        <Button
          fullWidth
          variant="contained"
          color="error"
          size="medium"
          onClick={handleLogout}
          sx={{ mt: 0.5 }}
        >
          Sign Out
        </Button>
      </Popover>
    </>
  );
};

export default InterviewerLayout;