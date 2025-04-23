/**
 * Main Application Component
 * Serves as the root component and handles:
 * - Application routing configuration
 * - Theme provider setup and management
 * - Protected route implementations
 * - Component lazy loading
 * - API service integration
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  // Admin components
  AdminPanel,
  ConfigManager,
  
  // Interviewer components
  InterviewerPanel,
  InterviewerDashboard,
  CreateInterview,
  InterviewList,
  SetQuestion,
  InterviewAnalytics,
  
  // Candidate components
  Welcome,
  Instructions,
  Interview,
  ThankYou,
  InterviewAccess,
  
  // Auth components
  InterviewerLogin,
  RequireAuth,
  RequireToken,
  
  // Shared components
  ErrorBoundary,
  NotFound,
  Layout
} from './components';

// Import services
import { AuthService, ThemeService } from './services';

function App() {
  const [theme, setTheme] = React.useState(() => {
    // Get theme from local storage or use default
    const savedTheme = ThemeService.getLocalTheme();
    return createTheme({
      palette: savedTheme ? savedTheme.palette : {
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#1a2027', secondary: '#637381' }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '8px 16px',
            }
          }
        }
      }
    });
  });
  
  // Add company logo state
  const [logo, setLogo] = useState(() => {
    // Get logo from local storage or use default
    return localStorage.getItem('companyLogo') || null;
  });

  const handleThemeChange = (newTheme) => {
    const updatedTheme = createTheme(newTheme);
    setTheme(updatedTheme);
    ThemeService.saveThemeLocally({
      palette: updatedTheme.palette
    });
  };
  
  // Add logo change handler
  const handleLogoChange = (logoData) => {
    setLogo(logoData);
    // If logoData is null, removeItem is called; otherwise, setItem
    if (logoData === null) {
      localStorage.removeItem('companyLogo');
    } else {
      localStorage.setItem('companyLogo', logoData);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<InterviewerLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <RequireAuth requiredRole="admin">
                  <AdminPanel onThemeChange={handleThemeChange} onLogoChange={handleLogoChange} logo={logo} />
                </RequireAuth>
              } 
            />
            
            {/* Interviewer Routes */}
            <Route path="/interviewer/login" element={<InterviewerLogin />} />
            <Route
              path="/interviewer"
              element={
                <RequireAuth requiredRole="interviewer">
                  <InterviewerPanel onThemeChange={handleThemeChange} onLogoChange={handleLogoChange} logo={logo} />
                </RequireAuth>
              }
            />
            
            {/* Candidate Routes */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/access" element={<InterviewAccess />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route 
              path="/interview/:interviewId" 
              element={
                <RequireToken>
                  <Interview />
                </RequireToken>
              } 
            />
            <Route path="/thank-you" element={<ThankYou />} />
            
            {/* Fallback Routes */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;