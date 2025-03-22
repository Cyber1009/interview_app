export const themeConfigs = {
  light: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#dc004e', light: '#ff4081', dark: '#c51162' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
    text: { primary: '#000000', secondary: '#666666' }
  },
  dark: {
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f48fb1',
      light: '#f8bbd0',
      dark: '#ec407a',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    error: {
      main: '#ef5350',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffd54f',
      dark: '#ff9800',
      contrastText: '#000000',
    },
    success: {
      main: '#81c784',
      light: '#a5d6a7',
      dark: '#4caf50',
      contrastText: '#000000',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
};

// Remove unused functions and keep only essential ones
export const getThemeOptions = (mode) => ({
  palette: {
    mode,
    ...themeConfigs[mode]
  }
});