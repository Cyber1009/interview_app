/**
 * Interviewer Dashboard Layout Component
 * 
 * A comprehensive layout for interviewer pages with:
 * - Consistent navigation sidebar
 * - User profile menu
 * - Theme and logo integration
 * - Proper logout handling
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  VideoCall as VideoIcon,
  Person as PersonIcon,
  Palette as ThemeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

import { BaseLayout } from '../core/layout';
import { AuthService } from '../../services';

const InterviewerDashboardLayout = ({ children, logo, onThemeChange }) => {
  const navigate = useNavigate();
  
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
    },
    {
      text: 'Profile',
      path: '/interviewer/profile',
      icon: <PersonIcon />
    }
  ];

  // Custom logout handler that uses AuthService for proper logout
  const handleLogout = () => {
    console.log('Logging out from InterviewerDashboardLayout');
    // Use the AuthService logout method with navigate function
    AuthService.logout(navigate);
  };

  return (
    <BaseLayout
      navItems={navItems}
      title="Interview Platform"
      logoData={logo}
      profilePath="/interviewer/profile"
      settingsPath="/interviewer/theme"
      userInitial="I"
      onThemeChange={onThemeChange}
      onLogout={handleLogout} // Pass logout handler to BaseLayout
    >
      {children}
    </BaseLayout>
  );
};

export default InterviewerDashboardLayout;