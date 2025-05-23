/**
 * Theme Hooks - Simplified theme access for components
 * 
 * This module provides specialized hooks for accessing theme colors,
 * CSS variables, and updating the theme consistently across the application.
 */

import { useMemo } from 'react';
import { useThemeContext, useThemeColors, useThemeUpdater } from '../context/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';

/**
 * Get a CSS variable value
 * @param {string} variableName - CSS variable name without the -- prefix
 * @returns {string} CSS variable value
 */
const getCssVariable = (variableName) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${variableName}`).trim();
};

/**
 * Hook to get a specific theme color with fallbacks
 * @param {string} colorName - Color name (primary, secondary, background, text)
 * @returns {string} Color value (hex code)
 */
export const useThemeColor = (colorName) => {
  const themeColors = useThemeColors();
  const muiTheme = useMuiTheme();
  
  return useMemo(() => {    // Try from our theme context first
    if (themeColors) {
      const colorMap = {
        primary: themeColors.primaryColor,
        accent_color: themeColors.accent_color,
        background: themeColors.backgroundColor,
        text: themeColors.textColor
      };
      
      if (colorMap[colorName]) {
        return colorMap[colorName];
      }
    }
    
    // Fallback to MUI theme
    if (muiTheme) {
      const muiColorMap = {
        primary: muiTheme.palette.primary.main,
        secondary: muiTheme.palette.secondary.main,
        background: muiTheme.palette.background.default,
        text: muiTheme.palette.text.primary
      };
      
      if (muiColorMap[colorName]) {
        return muiColorMap[colorName];
      }
    }
      // Fallback to CSS variables
    const cssVarMap = {
      primary: 'theme-primary-color',
      accent_color: 'theme-accent-color',
      background: 'theme-background-color',
      text: 'theme-text-color'
    };
    
    const cssVarValue = getCssVariable(cssVarMap[colorName]);
    if (cssVarValue) {
      return cssVarValue;
    }
      // Final fallbacks
    const defaultColors = {
      primary: '#3f51b5',
      accent_color: '#f50057',
      background: '#ffffff',
      text: '#212121'
    };
    
    return defaultColors[colorName] || '#000000';
  }, [themeColors, muiTheme, colorName]);
};

/**
 * Hook to access all theme variables as CSS variables
 * @returns {Object} Object with all theme CSS variables
 */
export const useThemeVariables = () => {  return useMemo(() => {
    // Return an object with all theme CSS variables
    return {
      primaryColor: getCssVariable('theme-primary-color'),
      primaryLight: getCssVariable('theme-primary-light'),
      primaryDark: getCssVariable('theme-primary-dark'),
      accentColor: getCssVariable('theme-accent-color'),
      accentLight: getCssVariable('theme-accent-light'),
      textColor: getCssVariable('theme-text-color'),
      backgroundColor: getCssVariable('theme-background-color'),
      backgroundPaper: getCssVariable('theme-background-paper')
    };
  }, []);
};

/**
 * Hook for updating a specific theme color
 * @returns {Function} updateColor function
 */
export const useThemeColorUpdater = () => {
  const { themeColors } = useThemeContext();
  const updateTheme = useThemeUpdater();
  
  return (colorName, value) => {
    if (!themeColors) return false;
    
    const colorMap = {
      primary: 'primaryColor',
      secondary: 'secondaryColor',
      background: 'backgroundColor',
      text: 'textColor'
    };
    
    const propertyName = colorMap[colorName];
    if (!propertyName) return false;
    
    const updatedTheme = {
      ...themeColors,
      [propertyName]: value
    };
    
    return updateTheme(updatedTheme);
  };
};

/**
 * Hook to provide a complete theme API with all color access/update methods
 * @returns {Object} Complete theme API
 */
export const useThemeApi = () => {
  const themeContext = useThemeContext();
  const updateColor = useThemeColorUpdater();
  
  return useMemo(() => ({
    ...themeContext,
    getColor: (colorName) => useThemeColor(colorName),
    getVariables: useThemeVariables(),
    updateColor
  }), [themeContext, updateColor]);
};

export default {
  useThemeColor,
  useThemeVariables,
  useThemeColorUpdater,
  useThemeApi
};
