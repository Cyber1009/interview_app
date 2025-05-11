/**
 * Admin Dashboard Layout
 * 
 * Specialized layout for the admin dashboard that leverages the base layout component.
 * Configures navigation items and paths specific to the admin section.
 */

import React from 'react';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { BaseLayout } from '../core/layout';
import { AuthService } from '../../services';

const AdminDashboardLayout = ({ children }) => {
  // Admin-specific navigation items
  const navItems = [
    {
      text: 'Dashboard',
      path: '/admin/dashboard',
      icon: <DashboardIcon />
    },
    {
      text: 'Users',
      path: '/admin/users',
      icon: <PeopleIcon />
    },
    {
      text: 'Analytics',
      path: '/admin/analytics',
      icon: <AssessmentIcon />
    },
    {
      text: 'Settings',
      path: '/admin/settings',
      icon: <SettingsIcon />
    }
  ];

  // Admin-specific logout handler
  const handleAdminLogout = (navigate) => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <BaseLayout
      navItems={navItems}
      title="Admin Dashboard"
      onLogout={handleAdminLogout}
      profilePath="/admin/profile"
      settingsPath="/admin/settings"
      userInitial="A"
    >
      {children}
    </BaseLayout>
  );
};

export default AdminDashboardLayout;