import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AdminAuthService from '../../services/adminAuthService';

/**
 * Admin specific dashboard layout
 * Wraps the shared DashboardLayout with admin-specific navigation and functionality
 * Focused on user management and system configuration only
 */
const AdminDashboardLayout = ({ children, logo }) => {
  const location = useLocation();
  
  // Admin panel specific menu items - removed interview-related items
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
  ];

  // Get current page title from active menu item
  const getPageTitle = () => {
    const item = menuItems.find(item => location.pathname === item.path);
    return item ? item.text : 'Admin Dashboard';
  };

  // Admin-specific logout handler
  const handleLogout = (navigate) => {
    AdminAuthService.logout();
    navigate('/admin/login');
  };

  return (
    <DashboardLayout
      title={getPageTitle()}
      menuItems={menuItems}
      logo={logo}
      userInitial="A"
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
};

export default AdminDashboardLayout;