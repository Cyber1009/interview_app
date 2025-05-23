/**
 * Unified Theme Provider
 * Single source of truth for theme management
 * Handles theme state, CSS variables, and Material-UI theming
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { colors, themeColors } from '../theme/colors';
import { makeTheme, createThemeOptions } from '../theme';
import { adjustColorLuminance, getContrastColor } from '../../utils/colorUtils';

const ThemeContext = createContext({
  colors: null,
  theme: null,
  updateColor: () => {},
  setColors: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a UnifiedThemeProvider');
  }
  return context;
};

export const UnifiedThemeProvider = ({ children }) => {
  const [themeColors, setThemeColors] = useState({
    primary: colors.primary,
    secondary: colors.gray,
    background: colors.grayMedium,
    text: colors.primary,
  });

  // Create MUI theme based on our colors
  const theme = useMemo(() => {
    const options = createThemeOptions('light');
    options.palette.primary.main = themeColors.primary;
    options.palette.secondary.main = themeColors.secondary;
    options.palette.background.default = themeColors.background;
    options.palette.text.primary = themeColors.text;
    return makeTheme(options);
  }, [themeColors]);

  // Update CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set main colors
    root.style.setProperty('--theme-primary-color', themeColors.primary);
    root.style.setProperty('--theme-secondary-color', themeColors.secondary);
    root.style.setProperty('--theme-background-color', themeColors.background);
    root.style.setProperty('--theme-text-color', themeColors.text);
    
    // Set derived colors
    const primaryLight = adjustColorLuminance(themeColors.primary, 0.2);
    const primaryDark = adjustColorLuminance(themeColors.primary, -0.2);
    const secondaryLight = adjustColorLuminance(themeColors.secondary, 0.2);
    const backgroundLight = adjustColorLuminance(themeColors.background, 0.15);
    
    root.style.setProperty('--theme-primary-light', primaryLight);
    root.style.setProperty('--theme-primary-dark', primaryDark);
    root.style.setProperty('--theme-secondary-light', secondaryLight);
    root.style.setProperty('--theme-background-paper', backgroundLight);

    // Update content background
    const mainContent = document.querySelector('.main-content-area');
    if (mainContent) {
      mainContent.style.backgroundColor = themeColors.background;
    }

    // Update sidebar colors
    const sidebarDrawers = document.querySelectorAll('.MuiDrawer-paper');
    sidebarDrawers.forEach(drawer => {
      drawer.style.backgroundColor = themeColors.background;
    });
  }, [themeColors]);

  // Single color update function
  const updateColor = (key, value) => {
    setThemeColors(prev => ({ ...prev, [key]: value }));
  };

  const contextValue = useMemo(() => ({
    colors: themeColors,
    theme,
    updateColor,
    setColors: setThemeColors
  }), [themeColors, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};