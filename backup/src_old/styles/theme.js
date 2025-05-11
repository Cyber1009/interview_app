/**
 * Theme Configuration Module
 * Provides:
 * - Light and dark theme configurations
 * - Custom color palettes
 * - Material-UI theme customization
 * - Custom gradients and styling constants
 */

import { createTheme } from '@mui/material/styles';

export const themeConfigs = {
  light: {
    palette: {
      primary: {
        main: '#2196F3',
        light: '#64B5F6',
        dark: '#1976D2',
      },
      secondary: {
        main: '#FE6B8B',
        light: '#FF8CAF',
        dark: '#DC004E',
      },
      success: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
      },
      error: {
        main: '#F44336',
        light: '#E57373',
        dark: '#D32F2F',
      },
      warning: {
        main: '#FF9800',
        light: '#FFB74D',
        dark: '#F57C00',
      },
      info: {
        main: '#2196F3',
        light: '#64B5F6',
        dark: '#1976D2',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
      },
    },
  },
  dark: {
    palette: {
      primary: {
        main: '#90CAF9',
        light: '#BBE3FF',
        dark: '#5D99C6',
      },
      secondary: {
        main: '#FF8CAF',
        light: '#FFB2CF',
        dark: '#C85A89',
      },
      success: {
        main: '#66BB6A',
        light: '#98EE99',
        dark: '#338A3E',
      },
      error: {
        main: '#EF5350',
        light: '#FF867C',
        dark: '#B61827',
      },
      warning: {
        main: '#FFA726',
        light: '#FFD95B',
        dark: '#C77800',
      },
      info: {
        main: '#90CAF9',
        light: '#BBE3FF',
        dark: '#5D99C6',
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
      },
    },
  }
};

export const getThemeOptions = (mode) => ({
  palette: {
    mode,
    ...themeConfigs[mode].palette
  },
  customGradients: {
    primary: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    secondary: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    background: mode === 'light' 
      ? 'linear-gradient(120deg, #f0f7ff 0%, #ffffff 100%)'
      : 'linear-gradient(120deg, #1e1e1e 0%, #2d2d2d 100%)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Default theme configuration
const theme = createTheme(getThemeOptions('light'));

export default theme;