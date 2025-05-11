/**
 * Interviewer Dashboard Layout (Simple)
 * 
 * A simplified dashboard layout for interviewer pages.
 * Uses the base layout with minimal navigation options.
 */

import React from 'react';
import { 
  Dashboard as DashboardIcon,
  VideoCall as VideoIcon
} from '@mui/icons-material';
import { BaseLayout } from '../core/layout';

const DashboardLayout = ({ children }) => {
  // Simplified navigation items
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
    }
  ];

  return (
    <BaseLayout
      navItems={navItems}
      title="Interviewer"
      profilePath="/interviewer/profile"
      settingsPath="/interviewer/settings"
      userInitial="I"
    >
      {children}
    </BaseLayout>
  );
};

export default DashboardLayout;