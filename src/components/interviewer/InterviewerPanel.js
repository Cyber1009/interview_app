import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Paper, Box, CircularProgress } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// FIXED: Use InterviewerLayout instead of InterviewerDashboardLayout for SlimSidebar
import InterviewerLayout from './InterviewerLayout';

// Import interviewer components - only include what's needed
import InterviewerDashboard from './InterviewerDashboard';
import InterviewManager from './InterviewManager';
import InterviewsTab from './InterviewsTab';
import UserProfile from './UserProfile';
import ThemeSettings from './ThemeSettings';
import CreateInterview from './CreateInterview';
import InterviewConfigManager from './InterviewConfigManager';
import { ThemeService } from '../../services';
import { colors, createThemeOptions } from '../../styles'; // Import createThemeOptions and colors from theme
import { 
  createContrastEnsuredPalette,
  adjustColorLuminance
} from '../../utils/colorUtils'; // Import color utility functions
import { alpha } from '@mui/material/styles';

/**
 * InterviewerPanel Component
 * Main container for interviewer functionality with:
 * - Consistent layout and navigation using SlimSidebarLayout
 * - Simplified routing with hierarchical structure aligned with backend
 * - Theme management integration
 */
const InterviewerPanel = ({ onThemeChange }) => {
  // ...existing code...
  const isInitialized = useRef(false);
  const logoRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [themeLoading, setThemeLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);
  const location = useLocation();
  
  // ...existing handlers and effects...
  const handleLogoChange = useCallback((logoData) => {
    console.log("Logo changed:", logoData ? "New logo set" : "Logo removed");
    setLogo(logoData);
    logoRef.current = logoData;
  }, []);
  
  const handleThemeChange = useCallback((newThemeOptions) => {
    try {
      console.log("[InterviewerPanel] Received new theme options:", newThemeOptions);
      const newTheme = createTheme(newThemeOptions);
      setCurrentTheme(newTheme);
      
      if (onThemeChange) {
        onThemeChange(newThemeOptions);
        console.log("[InterviewerPanel] Propagated theme change to App component");
      } else {
        console.warn("[InterviewerPanel] onThemeChange prop is not available");
      }
    } catch (error) {
      console.error('[InterviewerPanel] Failed to apply theme change:', error);
    }
  }, [onThemeChange]);

  // ...existing useEffect hooks...
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        setThemeLoading(true);
        const activeTheme = await ThemeService.getActiveTheme(true);
        
        if (activeTheme) {
          if (activeTheme.logoUrl) {
            setLogo(activeTheme.logoUrl);
          }
          
          const themeOptions = createThemeOptions('light');
          const enhancedColors = createContrastEnsuredPalette(
            activeTheme.primaryColor,
            activeTheme.secondaryColor || activeTheme.accentColor,
            activeTheme.backgroundColor,
            activeTheme.textColor
          );
          
          themeOptions.palette.primary = {
            ...themeOptions.palette.primary,
            main: enhancedColors.adjustedPrimary,
            light: enhancedColors.hoverLight,
            dark: enhancedColors.hoverDark,
          };
          
          if (activeTheme.secondaryColor || activeTheme.accentColor) {
            themeOptions.palette.secondary.main = enhancedColors.secondary;
          }
          
          themeOptions.palette.background = {
            ...themeOptions.palette.background,
            default: enhancedColors.background,
            paper: adjustColorLuminance(enhancedColors.background, 0.02),
          };
          
          themeOptions.palette.text = {
            ...themeOptions.palette.text,
            primary: enhancedColors.text,
            secondary: adjustColorLuminance(enhancedColors.text, 0.2),
          };
          
          themeOptions.custom = {
            ...themeOptions.custom,
            selectionColor: enhancedColors.selectionColor,
            accentColor: activeTheme.accentColor || enhancedColors.secondary,
            neutralColor: activeTheme.neutralColor || '#9e9e9e',
          };
          
          const newTheme = createTheme(themeOptions);
          setCurrentTheme(newTheme);
          console.log("[InterviewerPanel] Applied theme from backend with enhanced colors:", enhancedColors);
        }
      } catch (error) {
        console.error('Failed to initialize theme:', error);
      } finally {
        setThemeLoading(false);
      }
    };
    
    initializeTheme();
  }, []);
  
  useEffect(() => {
    if (isInitialized.current) return;
    
    let isMounted = true;
    
    const initializeThemeAndLogo = async () => {
      try {
        console.log("Initializing theme and logo...");
        const userTheme = await ThemeService.initializeUserTheme();
        const logoUrl = await ThemeService.getLogoUrl();
        console.log("Initial logo URL:", logoUrl);
        
        if (isMounted) {
          if (onThemeChange && userTheme) {
            onThemeChange(userTheme);
          }
          
          if (logoUrl) {
            setLogo(logoUrl);
            logoRef.current = logoUrl;
          }
          
          isInitialized.current = true;
          setInitialLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize theme and logo:", error);
        if (isMounted) {
          setInitialLoading(false);
          isInitialized.current = true;
        }
      }
    };
    
    initializeThemeAndLogo();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    if (!isInitialized.current || initialLoading) return;
    
    const isThemePage = location.pathname.includes('/theme');
    
    if (isThemePage) {
      const syncLogoFromBackend = async () => {
        console.log("Syncing logo from backend on theme page visit");
        try {
          const logoUrl = await ThemeService.getLogoUrl();
          
          if (logoUrl && logoUrl !== logoRef.current) {
            setLogo(logoUrl);
            logoRef.current = logoUrl;
          }
        } catch (error) {
          console.error("Failed to sync logo for theme page:", error);
        }
      };
      
      syncLogoFromBackend();
    } else {
      if (logoRef.current && logoRef.current !== logo) {
        console.log("Restoring logo from ref");
        setLogo(logoRef.current);
      }
    }
  }, [location.pathname, initialLoading, logo]); 

  if (initialLoading || themeLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <InterviewerLayout logo={logo} onThemeChange={handleThemeChange}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 0,
          boxShadow: 'none',
          height: '100%',
          borderRadius: 0,
          bgcolor: 'transparent !important',
          border: 'none',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<InterviewerDashboard />} />
          <Route path="/dashboard" element={<InterviewerDashboard />} />
          <Route path="/interviews" element={<InterviewsTab />} />
          <Route path="/interviews/create" element={<CreateInterview />} />
          <Route path="/interviews/:interviewId/*" element={<InterviewManager />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Theme settings route */}
          <Route path="/theme" element={
            <ThemeSettings
              onThemeChange={handleThemeChange} 
              logo={logo} 
              onLogoChange={handleLogoChange}
            />
          } />
          
          {/* Question library route */}
          <Route path="/config" element={<InterviewConfigManager />} />
        </Routes>
      </Paper>
    </InterviewerLayout>
  );
};

export default InterviewerPanel;