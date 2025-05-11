import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Paper } from '@mui/material';
import InterviewerDashboardLayout from './InterviewerDashboardLayout';

// Import interviewer components
import InterviewerDashboard from './InterviewerDashboard';
import InterviewManager from './InterviewManager';
import InterviewList from './InterviewList';
import InterviewResults from './InterviewResults';
import ManageQuestions from './ManageQuestions';
import InterviewAnalytics from './InterviewAnalytics';
import UserProfile from './UserProfile';
import AccessToken from './AccessToken';

// Import local components
import ConfigManager from './ConfigManager';

// Import the consolidated theme components
import { ThemeManager } from '../core/theme';

/**
 * InterviewerPanel Component
 * Main container for interviewer functionality with:
 * - Consistent layout and navigation
 * - Routing for interviewer features
 * - Theme management integration
 */
const InterviewerPanel = ({ onThemeChange, onLogoChange }) => {
  const [logo, setLogo] = React.useState(() => localStorage.getItem('companyLogo'));
  
  // Logo change handler
  const handleLogoChange = (logoData) => {
    setLogo(logoData);
    if (onLogoChange) {
      onLogoChange(logoData);
    }
  };
  
  // Theme change handler
  const handleThemeChange = (newTheme) => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <InterviewerDashboardLayout logo={logo} onThemeChange={handleThemeChange}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 0,
          boxShadow: 'none',
          height: '100%'
        }}
      >
        <Routes>
          <Route path="/" element={<InterviewerDashboard />} />
          <Route path="/dashboard" element={<InterviewerDashboard />} />
          <Route path="/interviews/*" element={<InterviewManager />} />
          <Route path="/candidates" element={<InterviewList type="candidates" />} />
          <Route path="/questions" element={<ManageQuestions />} />
          <Route path="/tokens" element={<AccessToken />} />
          <Route path="/results/:interviewId?" element={<InterviewResults />} />
          <Route path="/analytics" element={<InterviewAnalytics />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/theme" element={
            <ThemeManager
              onThemeChange={handleThemeChange} 
              logo={logo} 
              onLogoChange={handleLogoChange}
            />
          } />
          <Route path="/settings" element={<ConfigManager />} />
        </Routes>
      </Paper>
    </InterviewerDashboardLayout>
  );
};

export default InterviewerPanel;