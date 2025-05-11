import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Paper } from '@mui/material';
import AdminDashboardLayout from './AdminDashboardLayout';

// Import admin components
import SystemSettings from './SystemSettings';
import Overview from './Overview';
import UserManagement from './UserManagement';
import SystemStatus from './SystemStatus';

/**
 * AdminPanel Component
 * Main container for admin functionality with:
 * - User management and troubleshooting tools
 * - System configuration
 * - System monitoring
 */
const AdminPanel = ({ onLogoChange }) => {
  const [logo, setLogo] = React.useState(() => localStorage.getItem('companyLogo'));
  
  // Add logo change handler
  const handleLogoChange = (logoData) => {
    setLogo(logoData);
    // Update parent component if provided
    if (onLogoChange) {
      onLogoChange(logoData);
    }
  };

  return (
    <AdminDashboardLayout logo={logo}>
      <Paper elevation={0} sx={{ p: 0, height: '100%' }}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/status" element={<SystemStatus />} />
        </Routes>
      </Paper>
    </AdminDashboardLayout>
  );
};

export default AdminPanel;