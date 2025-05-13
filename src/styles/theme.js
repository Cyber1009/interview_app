/**
 * Simplified Theme Configuration
 * 
 * Core theme values taken directly from sample.html for consistency.
 * This file serves as the central source for color definitions used throughout the app.
 */

import { createTheme, alpha } from '@mui/material/styles';

// -----------------------------------------------------
// SIMPLIFIED COLOR PALETTE - Based on sample.html
// Core colors used throughout the application
// -----------------------------------------------------
export const colors = {
  // Core UI colors from sample.html
  primary: '#091326',      // Main brand/header/button background color
  primaryLight: '#1a233a', // Lighter variant for hover states
  
  // Grays - from sample.html
  gray: '#52606d',         // Label and secondary text color 
  grayLight: '#d1d5db',    // Border color
  grayLighter: '#e5eaf1',  // Label background color
  grayMedium: '#b6c2c9',   // Main background color
  
  // Base colors
  white: '#ffffff',        // Card background and button text color
  black: '#000000',        // Used for deep shadows
  
  // Status colors - for feedback states
  success: '#7bae7e',      // Success state
  warning: '#ff9800',      // Warning state
  error: '#e75552',        // Error state
  info: '#a4cae5',         // Info state
  
  // Shadows
  shadow: 'rgba(80,86,96,0.10)'  // Card/element shadows
};

/* Original expanded color palette - kept for reference
export const originalColors = {
  // Core UI colors
  primary: '#091326',      // Main brand/header color
  primaryLight: '#1a233a', // Lighter variant 
  primaryDark: '#050a15',  // Darker variant
  
  // Grays
  gray: '#52606d',        // Main gray text
  grayLight: '#d1d5db',   // Light gray for borders
  grayLighter: '#e5eaf1', // Lighter gray for backgrounds
  grayLightest: '#f5f7fa', // Lightest gray for search backgrounds
  grayMedium: '#b6c2c9',  // Medium gray for backgrounds
  
  // White/Black
  white: '#ffffff',       // White
  black: '#000000',       // Black
  
  // Status colors
  success: '#7bae7e',     
  warning: '#ff9800',     
  error: '#e75552',       
  info: '#a4cae5',        
  neutral: '#757575',     
  
  // Light/dark mode status backgrounds
  statusBgLight: {
    success: '#b5e7b8',  
    warning: '#e8d5b6',  
    error: '#fee1e5',    
    info: '#e3f2fd',     
    neutral: '#f4cfcf'   
  },
  
  statusBgDark: {
    success: '#253c26',  
    warning: '#493000',  
    error: '#441a18',    
    info: '#0d3c61',     
    neutral: '#424242'   
  },
  
  // Text colors
  text: {
    light: {
      primary: '#091326', 
      secondary: '#52606d',
      disabled: '#8a9198'
    },
    dark: {
      primary: '#e0e0e0', 
      secondary: '#b0b0b0',
      disabled: '#707070'
    }
  },
  
  // Shadows
  shadows: {
    card: 'rgba(80,86,96,0.10)',
    button: 'rgba(9,19,38,0.08)',
    buttonHover: 'rgba(9,19,38,0.15)',
    dark: 'rgba(0,0,0,0.20)'
  }
};
*/

// -----------------------------------------------------
// STATUS COLORS
// Mapping of statuses to colors for consistent representation
// -----------------------------------------------------
export const statusColors = {
  online: colors.success,
  operational: colors.success,
  warning: colors.warning,
  degraded: colors.warning,
  error: colors.error,
  offline: colors.error,
  unknown: colors.gray,
  loading: colors.info,
};

// -----------------------------------------------------
// COMPONENT COLORS
// Common component-specific colors for easy reference
// -----------------------------------------------------
export const componentColors = {
  background: colors.grayMedium,
  cardBackground: colors.white,
  labelBackground: colors.grayLighter,
  labelColor: colors.gray,
  buttonBackground: colors.primary,
  buttonColor: colors.white,
  headerColor: colors.primary,
  searchBackground: colors.grayLighter,
  searchBorder: colors.grayLight,
};

/**
 * Creates a complete palette configuration for the given mode
 * @param {string} mode - 'light' or 'dark' mode
 * @returns {Object} - Complete palette configuration
 */
export const createPalette = (mode) => {
  // We default everything to light mode for simplicity
  mode = 'light';
  
  // Define base palette
  return {
    mode,
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primary,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.gray,
      light: alpha(colors.gray, 0.8),
      dark: colors.gray,
      contrastText: colors.white,
    },
    success: {
      main: colors.success,
      contrastText: colors.white,
    },
    error: {
      main: colors.error,
      contrastText: colors.white,
    },
    warning: {
      main: colors.warning,
      contrastText: colors.white,
    },
    info: {
      main: colors.info,
      contrastText: colors.white,
    },
    background: {
      default: colors.grayMedium, // From sample.html
      paper: colors.white,
      elevation1: colors.white,
      elevation2: colors.grayLighter,
      elevation3: colors.grayLighter,
    },
    text: {
      primary: colors.primary,
      secondary: colors.gray,
      disabled: alpha(colors.gray, 0.6),
    },
    // Status colors for direct access
    status: statusColors,
    // Admin palette integration - simplified
    admin: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primary,
      contrastText: colors.white,
      header: colors.primary,
      headerText: colors.white,
      card: colors.white,
      hover: alpha(colors.primary, 0.08),
      gradient: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.primaryLight} 90%)`,
    }
  };
};

/**
 * Creates a complete theme configuration
 * @param {string} mode - 'light' or 'dark' mode
 * @returns {Object} - Complete theme options
 */
export const createThemeOptions = (mode) => {
  const palette = createPalette(mode);
  
  return {
    palette,
    customGradients: {
      primary: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.primaryLight} 90%)`,
      secondary: `linear-gradient(45deg, ${colors.gray} 30%, ${palette.secondary.light} 90%)`,
      background: `linear-gradient(120deg, ${colors.grayLighter} 0%, ${colors.white} 100%)`,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 18,
    },
    components: {      MuiButton: {
        styleOverrides: {          root: {
            borderRadius: '2em',
            padding: '0.6em 1.6em',            boxShadow: `0 2px 8px 0 rgba(9,19,38,0.08)`,
            '&:hover': {
              boxShadow: `0px 2px 10px rgba(9,19,38,0.15)`,
              background: colors.primaryLight,
            },
          },
          containedPrimary: {
            backgroundColor: colors.primary,
            color: colors.white,
            '&:hover': {
              backgroundColor: colors.primaryLight,
            },
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 18,
          },          elevation1: {
            boxShadow: `0 4px 24px 0 ${colors.shadow}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            overflow: 'hidden',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(224, 224, 224, 1)' : 'rgba(81, 81, 81, 1)'}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.03)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            boxShadow: mode === 'light' ? '0px 2px 8px rgba(0, 0, 0, 0.05)' : '0px 2px 8px rgba(0, 0, 0, 0.25)',
          },
        },
        defaultProps: {
          elevation: 0,
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            borderRight: 'none',
          },
        },
      },
    },
  };
};

/**
 * Helper function to create a theme with specific mode
 * @param {string} mode - 'light' or 'dark' mode
 * @returns {Object} - MUI theme object
 */
export const makeTheme = (mode = 'light') => {
  return createTheme(createThemeOptions(mode));
};

// Default theme - light mode
const defaultTheme = makeTheme('light');

export default defaultTheme;