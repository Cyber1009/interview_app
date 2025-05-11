/**
 * Consolidated Theme Configuration
 * 
 * This file serves as the central source for all theme-related configurations:
 * - Color palette definitions
 * - Light/dark theme variants
 * - MUI theme customizations
 * - Reusable style constants
 */

import { createTheme, alpha } from '@mui/material/styles';

// -----------------------------------------------------
// BASE COLOR PALETTE
// Primary palette used throughout the application
// -----------------------------------------------------
export const colors = {
  // Brand colors
  primary: '#091326',      // Main brand color - dark blue
  primaryLight: '#1a233a', // Lighter variant
  primaryDark: '#050a15',  // Darker variant
  
  // Grays
  gray: '#52606d',        // Main gray
  grayLight: '#d1d5db',   // Light gray for borders
  grayLighter: '#e5eaf1', // Lighter gray for backgrounds
  grayLightest: '#f5f7fa', // Lightest gray for search backgrounds
  grayMedium: '#b6c2c9',  // Medium gray for backgrounds
  grayDark: '#3a4550',    // Dark gray
  
  // Status colors
  success: '#7bae7e',     // Green for success states
  warning: '#ff9800',     // Orange for warning states
  error: '#e75552',       // Red for error states
  info: '#a4cae5',        // Blue for info states
  neutral: '#757575',     // Gray for neutral states
  
  // Common
  white: '#ffffff',
  black: '#000000',
};

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
  unknown: colors.neutral,
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
  searchBackground: colors.grayLightest,
  searchBorder: colors.grayLight,
};

/**
 * Creates a complete palette configuration for the given mode
 * @param {string} mode - 'light' or 'dark' mode
 * @returns {Object} - Complete palette configuration
 */
export const createPalette = (mode) => {
  // Mode-specific colors
  const modeColors = {
    light: {
      // Use white as default background for light mode instead of grayMedium
      // This allows the extracted colors to be visible
      background: colors.white,
      paper: colors.white,
      textPrimary: colors.primary,
      textSecondary: colors.gray,
      textDisabled: '#8a9198',
      statusBgSuccess: '#b5e7b8',
      statusBgWarning: '#fff3e0',
      statusBgError: '#ffebee',
      statusBgInfo: '#e3f2fd',
      statusBgNeutral: '#f5f5f5',
      secondaryLight: '#7b8996',
    },
    dark: {
      background: colors.primaryLight,
      paper: '#222b42',
      textPrimary: '#e0e0e0',
      textSecondary: '#b0b0b0',
      textDisabled: '#707070',
      statusBgSuccess: '#253c26',
      statusBgWarning: '#493000',
      statusBgError: '#441a18',
      statusBgInfo: '#0d3c61',
      statusBgNeutral: '#424242',
      secondaryLight: '#d8e1e6',
    }
  };
  
  // Current mode colors
  const themeColors = modeColors[mode];
  
  // Define base palette
  return {
    mode,
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.gray,
      light: themeColors.secondaryLight,
      dark: colors.grayDark,
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
      default: themeColors.background,
      paper: themeColors.paper,
      elevation1: themeColors.paper,
      elevation2: mode === 'light' ? colors.grayLightest : '#2a3349',
      elevation3: mode === 'light' ? colors.grayLighter : '#323d56',
    },
    text: {
      primary: themeColors.textPrimary,
      secondary: themeColors.textSecondary,
      disabled: themeColors.textDisabled,
    },
    // Status backgrounds
    statusBg: {
      success: themeColors.statusBgSuccess,
      warning: themeColors.statusBgWarning,
      error: themeColors.statusBgError,
      info: themeColors.statusBgInfo,
      neutral: themeColors.statusBgNeutral,
    },
    // Status colors for direct access
    status: statusColors,
    // Admin palette integration
    admin: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.white,
      header: colors.primary,
      headerText: colors.white,
      card: themeColors.paper,
      hover: `rgba(9, 19, 38, ${mode === 'light' ? 0.08 : 0.15})`,
      gradient: `linear-gradient(45deg, ${colors.primary} ${mode === 'light' ? '30%' : '0%'}, ${colors.primaryLight} ${mode === 'light' ? '90%' : '100%'})`,
      // Status colors
      successBg: themeColors.statusBgSuccess,
      successBorder: colors.success,
      warningBg: themeColors.statusBgWarning,
      warningBorder: colors.warning,
      errorBg: themeColors.statusBgError,
      errorBorder: colors.error,
      unknownBg: themeColors.statusBgNeutral,
      unknownBorder: colors.neutral,
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
      background: mode === 'light' 
        ? `linear-gradient(120deg, ${colors.grayLighter} 0%, ${colors.white} 100%)`
        : `linear-gradient(120deg, ${colors.primaryLight} 0%, ${palette.background.paper} 100%)`,
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
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '2em',
            padding: '0.6em 1.6em',
            boxShadow: '0 2px 8px 0 rgba(9,19,38,0.08)',
            '&:hover': {
              boxShadow: '0px 2px 10px rgba(9,19,38,0.15)',
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
          },
          elevation1: {
            boxShadow: mode === 'light' 
              ? '0 4px 24px 0 rgba(80,86,96,0.10)'
              : '0 4px 24px 0 rgba(0,0,0,0.20)',
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