/**
 * Main Application Component
 * Serves as the root component and handles:
 * - Application routing configuration
 * - Theme provider setup and management
 * - Protected route implementations
 * - Component lazy loading
 * - API service integration
 */

import React, { useState, useEffect, createContext, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Import theme configuration
import { colors, componentColors, createThemeOptions } from './styles/theme';

// Import all components using the reorganized structure
import {
  // Auth components
  InterviewerLogin,
  AdminLogin,
  Register,
  
  // Candidate components
  InterviewAccess,
  Welcome,
  Instructions,
  Interview,
  ThankYou,
  
  // Admin components
  AdminPanel,
  
  // Core components
  NotFound,
  ErrorBoundary,
  ProtectedRoute,
  
  // Interviewer components
  InterviewerPanel,
  
  // Payment components
  Subscription
} from './components';

// Import services
import { ThemeService } from './services';
import authService from './services/authService';

// Create authentication context
export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  onLogin: () => {},
  onLogout: () => {},
});

function App() {
  // Remove dark mode state completely - always use light mode
  const [themeColors, setThemeColors] = useState({
    primary: colors.primary,
    secondary: colors.secondary
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [userRole, setUserRole] = useState(() => authService.getUserRole());
  const [themeInitialized, setThemeInitialized] = useState(false);
  // Create theme with light mode only
  const theme = useMemo(() => {
    const mode = 'light'; // Force light mode always
    const themeOptions = createThemeOptions(mode);
    
    // Apply custom colors from state
    return createTheme({
      ...themeOptions,
      palette: {
        ...themeOptions.palette,
        mode, // Always light mode
        primary: {
          main: (function() {
            // Prevent white/too light colors as primary
            const primaryColor = themeColors.primary || colors.primary;
            if (primaryColor === '#ffffff' || primaryColor === 'white' || 
                (primaryColor.startsWith('#') && parseInt(primaryColor.substr(1), 16) > 0xefefef)) {
              console.log('[App] Primary color was too light, using blue instead');
              return '#1976d2'; // Use blue for better visibility
            }
            return primaryColor;
          })(),
          light: themeColors.primaryLight || colors.primaryLight,
          dark: themeColors.primaryDark || colors.primaryDark,
          contrastText: '#ffffff',
        },
        secondary: {
          main: themeColors.secondary || colors.gray, 
          light: themeColors.secondaryLight || colors.grayLight,
          dark: themeColors.secondaryDark || colors.grayDark,
          contrastText: '#ffffff',
        },        background: {
          default: themeColors.background || themeOptions.palette.background.default,
          // Use CSS variables for paper backgrounds to ensure they're transparent when needed
          paper: 'var(--theme-background-paper, ' + themeOptions.palette.background.paper + ')',
          elevation1: themeOptions.palette.background.elevation1,
          elevation2: themeOptions.palette.background.elevation2,
          elevation3: themeOptions.palette.background.elevation3
        },
        text: {
          primary: themeColors.textColor || themeOptions.palette.text.primary,
          secondary: themeOptions.palette.text.secondary,
          disabled: themeOptions.palette.text.disabled
        }
      }
    });
  }, [themeColors]);

  // Initial theme setup based on stored preferences
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Apply theme from ThemeService which handles multiple sources
        const themeData = await ThemeService.getActiveTheme();
        
        if (themeData) {
          console.log("[App] Initializing theme with:", themeData);
          setThemeColors({
            primary: themeData.primaryColor || colors.primary,
            secondary: themeData.secondaryColor || colors.gray,
            background: themeData.backgroundColor || undefined,
            textColor: themeData.textColor || undefined
          });
        }
        
        setThemeInitialized(true);
      } catch (error) {
        console.error("[App] Failed to initialize theme:", error);
        setThemeInitialized(true); // Mark as initialized even if there was an error
      }
    };
    
    initializeTheme();
  }, [isAuthenticated]); // Re-run when authentication state changes

  // Function to handle theme changes from InterviewerPanel
  const handleThemeChange = useCallback((newThemeOptions) => {
    console.log("[App] Handling theme change:", newThemeOptions);
    if (!newThemeOptions || !newThemeOptions.palette) return;
    
    // Extract relevant colors from the theme options
    const updatedColors = {
      primary: newThemeOptions.palette.primary?.main || colors.primary,
      secondary: newThemeOptions.palette.secondary?.main || colors.gray,
      background: newThemeOptions.palette.background?.default,
      textColor: newThemeOptions.palette.text?.primary
    };
    
    // Apply CSS variable for immediate background color transitions
    if (updatedColors.background) {
      document.documentElement.style.setProperty('--theme-temp-background', updatedColors.background);
    }
    
    console.log("[App] Setting theme colors to:", updatedColors);
    setThemeColors(updatedColors);
    
    // Store theme in ThemeService to persist changes
    ThemeService.saveThemeLocally(newThemeOptions);
  }, []);

  // Function to handle successful login
  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    setUserRole(authService.getUserRole());
    
    // Force theme refresh on login
    try {
      // Clear any cached theme data
      ThemeService.clearCachedTheme();
      
      // Fetch and apply the latest theme
      const themeData = await ThemeService.getActiveTheme(true); // force refresh
      
      if (themeData) {
        setThemeColors({
          primary: themeData.primaryColor || colors.primary,
          secondary: themeData.secondaryColor || colors.secondary,
          background: themeData.backgroundColor,
          textColor: themeData.textColor
        });
      }
    } catch (error) {
      console.error("Failed to refresh theme after login:", error);
    }
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    
    // Reset theme to defaults
    setThemeColors({
      primary: colors.primary,
      secondary: colors.secondary
    });
  };

  // Create authentication context value
  const authContextValue = {
    isAuthenticated,
    userRole,
    onLogin: handleLoginSuccess,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {themeInitialized && (
          <Router>
            <Routes>
              {/* Public routes accessible without login */}
              <Route path="/" element={<Welcome />} />
              <Route path="/interview-access" element={<InterviewAccess />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/interview/:interviewId" element={<Interview />} />
              <Route path="/thank-you" element={<ThankYou />} />
              
              {/* Login routes */}
              <Route 
                path="/interviewer/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/interviewer/dashboard" /> : 
                    <InterviewerLogin onLoginSuccess={handleLoginSuccess} />
                } 
              />
              <Route 
                path="/register" 
                element={<Register />} 
              />
              
              {/* Admin routes */}
              <Route
                path="/admin/login"
                element={
                  isAuthenticated && userRole === 'admin' ?
                    <Navigate to="/admin/dashboard" /> :
                    <AdminLogin onLoginSuccess={handleLoginSuccess} />
                }
              />
              <Route
                path="/admin/dashboard/*"
                element={
                  isAuthenticated && userRole === 'admin' ?
                    <AdminPanel /> :
                    <Navigate to="/admin/login" />
                }
              />
              
              {/* Interviewer routes */}
              <Route
                path="/interviewer/*"
                element={
                  isAuthenticated && (userRole === 'interviewer' || userRole === 'admin') ?
                    <InterviewerPanel onThemeChange={handleThemeChange} /> :
                    <Navigate to="/interviewer/login" />
                }
              />
              
              {/* Subscription and payment routes */}
              <Route path="/subscription" element={<Subscription />} />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        )}
        {!themeInitialized && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}>
            Loading...
          </div>
        )}
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;