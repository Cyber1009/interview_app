import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Paper, Box, CircularProgress } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import InterviewerDashboardLayout from './InterviewerDashboardLayout';

// Import interviewer components - only include what's needed
import InterviewerDashboard from './InterviewerDashboard';
import InterviewManager from './InterviewManager';
import InterviewList from './InterviewList';
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
 * - Consistent layout and navigation
 * - Simplified routing with hierarchical structure aligned with backend
 * - Theme management integration
 */
const InterviewerPanel = ({ onThemeChange }) => {
  // Use a stable ref to track initialization state
  const isInitialized = useRef(false);
  // Use a stable ref for logo to ensure persistence across rerenders
  const logoRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [themeLoading, setThemeLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);
  const location = useLocation();
  
  // Wrap handlers in useCallback to prevent unnecessary re-renders
  const handleLogoChange = useCallback((logoData) => {
    console.log("Logo changed:", logoData ? "New logo set" : "Logo removed");
    
    // Store in both state and ref for persistence
    setLogo(logoData);
    logoRef.current = logoData;
  }, []);
  
  // Handle theme changes from child components
  const handleThemeChange = useCallback((newThemeOptions) => {
    try {
      console.log("[InterviewerPanel] Received new theme options:", newThemeOptions);
      
      // Create a new theme with the provided options
      const newTheme = createTheme(newThemeOptions);
      
      // Apply to local state
      setCurrentTheme(newTheme);
      
      // IMPORTANT: Propagate the theme change to the parent component (App)
      if (onThemeChange) {
        // Pass along the full theme options to ensure all properties are updated
        onThemeChange(newThemeOptions);
        console.log("[InterviewerPanel] Propagated theme change to App component");
      } else {
        console.warn("[InterviewerPanel] onThemeChange prop is not available");
      }
    } catch (error) {
      console.error('[InterviewerPanel] Failed to apply theme change:', error);
    }
  }, [onThemeChange]);  // Using imported color utility functions from colorUtils.js

  // Effect for initializing theme when component mounts
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        setThemeLoading(true);
        
        // Load theme from backend via ThemeService
        const activeTheme = await ThemeService.getActiveTheme(true); // Force refresh on initial load
        
        if (activeTheme) {
          // Update logo state if available
          if (activeTheme.logoUrl) {
            setLogo(activeTheme.logoUrl);
          }
          
          // Create MUI theme based on extracted colors
          const themeOptions = createThemeOptions('light'); // Always use light mode
          
          // Get enhanced colors with proper contrast
          const enhancedColors = createContrastEnsuredPalette(
            activeTheme.primaryColor,
            activeTheme.secondaryColor || activeTheme.accentColor,
            activeTheme.backgroundColor,
            activeTheme.textColor
          );
          
          // Apply enhanced main colors with proper contrast
          themeOptions.palette.primary = {
            ...themeOptions.palette.primary,
            main: enhancedColors.adjustedPrimary,
            light: enhancedColors.hoverLight,
            dark: enhancedColors.hoverDark,
          };
          
          if (activeTheme.secondaryColor || activeTheme.accentColor) {
            themeOptions.palette.secondary.main = enhancedColors.secondary;
          }
          
          // Apply background with subtle tinting for better visual separation
          themeOptions.palette.background = {
            ...themeOptions.palette.background,
            default: enhancedColors.background,
            paper: adjustColorLuminance(enhancedColors.background, 0.02), // Slightly different paper background
          };
          
          // Set text colors
          themeOptions.palette.text = {
            ...themeOptions.palette.text,
            primary: enhancedColors.text,
            secondary: adjustColorLuminance(enhancedColors.text, 0.2), // Lighter/darker secondary text
          };
          
          // Store custom selection and interaction colors
          themeOptions.custom = {
            ...themeOptions.custom,
            selectionColor: enhancedColors.selectionColor,
            accentColor: activeTheme.accentColor || enhancedColors.secondary,
            neutralColor: activeTheme.neutralColor || '#9e9e9e',
          };
          
          // Create the theme with our custom options
          const newTheme = createTheme(themeOptions);
          
          // Apply to state
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
  
  // Initial theme and logo load - only runs ONCE
  useEffect(() => {
    // Prevent duplicate initialization
    if (isInitialized.current) return;
    
    let isMounted = true;
    
    const initializeThemeAndLogo = async () => {
      try {
        console.log("Initializing theme and logo...");
        
        // Get theme data
        const userTheme = await ThemeService.initializeUserTheme();
        
        // Get logo URL on initial mount
        const logoUrl = await ThemeService.getLogoUrl();
        console.log("Initial logo URL:", logoUrl);
        
        if (isMounted) {
          // Apply theme only once during initialization
          if (onThemeChange && userTheme) {
            onThemeChange(userTheme);
          }
          
          // Set logo if available
          if (logoUrl) {
            setLogo(logoUrl);
            logoRef.current = logoUrl;
          }
          
          // Mark as initialized
          isInitialized.current = true;
          setInitialLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize theme and logo:", error);
        if (isMounted) {
          setInitialLoading(false);
          isInitialized.current = true; // Mark as initialized even on error
        }
      }
    };
    
    initializeThemeAndLogo();
    
    return () => {
      isMounted = false;
    };
  }, []); // No dependencies - run once on mount
  
  // Effect to update logo when navigating to theme page
  // Separated to avoid flashing and unnecessary renders
  useEffect(() => {
    // Skip if not initialized yet
    if (!isInitialized.current || initialLoading) return;
    
    const isThemePage = location.pathname.includes('/theme');
    
    if (isThemePage) {
      // When navigating TO the theme page, ensure we have the latest logo
      // This effect is specifically for synchronization, not for showing loading state
      const syncLogoFromBackend = async () => {
        console.log("Syncing logo from backend on theme page visit");
        try {
          const logoUrl = await ThemeService.getLogoUrl();
          
          // Only update if logo actually changed
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
      // When navigating AWAY from theme page, ensure we use the ref value
      // This prevents the logo from disappearing in the layout
      if (logoRef.current && logoRef.current !== logo) {
        console.log("Restoring logo from ref");
        setLogo(logoRef.current);
      }
    }
  }, [location.pathname, initialLoading, logo]); 

  // Initial loading state
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

  return (    <InterviewerDashboardLayout logo={logo} onThemeChange={handleThemeChange}>      <Paper 
        elevation={0}
        sx={{ 
          p: 0,
          boxShadow: 'none',
          height: '100%',
          borderRadius: 0,
          // Use fully transparent background with !important to override any Material-UI defaults
          bgcolor: 'transparent !important',
          // Remove any borders
          border: 'none',
          // Make sure this paper is positioned properly in the stacking context
          position: 'relative',
          zIndex: 1
        }}
      >
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<InterviewerDashboard />} />
          <Route path="/dashboard" element={<InterviewerDashboard />} />
          <Route path="/interviews" element={<InterviewList />} />
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
    </InterviewerDashboardLayout>
  );
};

export default InterviewerPanel;
