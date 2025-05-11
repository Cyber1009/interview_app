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
import './App.css';

// Import all components
import {
  CandidateLogin,
  InterviewAccess,
  InterviewerLogin,
  ProtectedRoute,
  AccessToken,
  SetQuestion,
  InterviewResults,
  ConfigManager,
  Welcome,
  Instructions,
  Interview,
  ThankYou,
  ErrorBoundary,
  NotFound,
  Layout
} from './components';

// Import admin panel directly to avoid circular dependencies
import AdminPanel from './components/admin/AdminPanel';

// Import interviewer panel
import InterviewerPanel from './components/interviewer/InterviewerPanel';

// Import subscription component
import Subscription from './components/payment/Subscription';

// Import services
import { AuthService, ThemeService } from './services';

function App() {
  const [theme, setTheme] = useState(() => {
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
            {/* Public routes - Changed to direct candidates to welcome page first */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/interview-access" element={<InterviewAccess />} />
            <Route path="/interviewer/login" element={<InterviewerLogin />} />
            <Route path="/admin/login" element={<InterviewerLogin />} />
            
            {/* Payment/Subscription route - Allow pending account access */}
            <Route path="/subscription" element={
              AuthService.hasPendingAccount() || AuthService.isAuthenticated() ? 
                <Subscription /> : 
                <Navigate to="/interviewer/login" replace />
            } />
            
            {/* Protected interviewer routes with new dashboard layout */}
            <Route 
              path="/interviewer/*" 
              element={
                <ProtectedRoute>
                  <InterviewerPanel onThemeChange={handleThemeChange} onLogoChange={handleLogoChange} />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes with new dashboard layout */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute adminRequired>
                  <AdminPanel onThemeChange={handleThemeChange} onLogoChange={handleLogoChange} />
                </ProtectedRoute>
              } 
            />
            
            {/* Candidate Routes */}
            <Route path="/instructions" element={<Instructions />} />
            <Route 
              path="/interview/:interviewId" 
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              } 
            />
            <Route path="/thank-you" element={<ThankYou />} />
            
            {/* Legacy route - redirect to new interview access */}
            <Route path="/interview/:token" element={<Navigate to="/interview-access" replace />} />
            
            {/* Redirect unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;