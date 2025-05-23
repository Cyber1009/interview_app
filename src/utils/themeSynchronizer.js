/**
 * Theme Synchronizer Utility
 * 
 * This utility ensures that CSS variables and MUI theme objects stay synchronized
 * by providing a single update method that handles both systems.
 */

import { createTheme } from '@mui/material/styles';
import { createContrastEnsuredPalette, adjustColorLuminance } from './colorUtils';
import { createThemeOptions } from '../styles';
import { setCssVariables, getRootStylePropertyValue } from './cssVarUtils';

/**
 * Normalizes theme data from any source to use consistent property names
 * 
 * @param {Object} sourceTheme - Theme data from any source (API, localStorage, etc.)
 * @returns {Object} Normalized theme data with consistent property names
 */
export const normalizeThemeData = (sourceTheme = {}) => {
  return {
    primaryColor: sourceTheme.primaryColor || sourceTheme.primary_color || '#3f51b5',
    accentColor: sourceTheme.accentColor || sourceTheme.accent_color || '#f50057',
    backgroundColor: sourceTheme.backgroundColor || sourceTheme.background_color || '#ffffff',
    textColor: sourceTheme.textColor || sourceTheme.text_color || '#212121',
    logoUrl: sourceTheme.logoUrl || sourceTheme.logo_url || null,
    neutralColor: sourceTheme.neutralColor || sourceTheme.neutral_color || '#9e9e9e'
  };
};

/**
 * Updates CSS variables with theme colors
 * 
 * @param {Object} normalizedTheme - Normalized theme data
 * @param {Object} enhancedColors - Enhanced colors with proper contrast
 */
export const updateCssVariables = (normalizedTheme, enhancedColors) => {
  const cssVars = {
    '--theme-primary-color': normalizedTheme.primaryColor,
    '--theme-primary-color-adjusted': enhancedColors.adjustedPrimary,
    '--theme-accent-color': normalizedTheme.accentColor,
    '--theme-secondary-color': enhancedColors.secondary,
    '--theme-background-color': normalizedTheme.backgroundColor,
    '--theme-background-paper': adjustColorLuminance(enhancedColors.background, 0.02),
    '--theme-text-color': normalizedTheme.textColor,
    '--theme-text-secondary': adjustColorLuminance(enhancedColors.text, 0.2),
    '--theme-selection-color': enhancedColors.selectionColor,
    '--theme-neutral-color': normalizedTheme.neutralColor,
    '--theme-hover-light': enhancedColors.hoverLight,
    '--theme-hover-dark': enhancedColors.hoverDark,
  };
  
  setCssVariables(cssVars);
  
  console.log('[ThemeSynchronizer] Updated CSS variables with theme colors');
  return cssVars;
};

/**
 * Creates MUI theme options from normalized theme data and enhanced colors
 * 
 * @param {Object} normalizedTheme - Normalized theme data
 * @param {Object} enhancedColors - Enhanced colors with proper contrast
 * @returns {Object} MUI theme options
 */
export const createMuiThemeOptions = (normalizedTheme, enhancedColors) => {
  // Start with base theme options (always light mode for now)
  const themeOptions = createThemeOptions('light');
  
  // Apply enhanced main colors with proper contrast
  themeOptions.palette.primary = {
    ...themeOptions.palette.primary,
    main: enhancedColors.adjustedPrimary,
    light: enhancedColors.hoverLight,
    dark: enhancedColors.hoverDark,
  };
  
  themeOptions.palette.secondary = {
    ...themeOptions.palette.secondary,
    main: enhancedColors.secondary,
  };
  
  // Apply background with subtle tinting for better visual separation
  themeOptions.palette.background = {
    ...themeOptions.palette.background,
    default: enhancedColors.background,
    paper: adjustColorLuminance(enhancedColors.background, 0.02),
  };
  
  // Set text colors
  themeOptions.palette.text = {
    ...themeOptions.palette.text,
    primary: enhancedColors.text,
    secondary: adjustColorLuminance(enhancedColors.text, 0.2),
  };
  
  // Store custom selection and interaction colors
  themeOptions.custom = {
    ...themeOptions.custom,
    selectionColor: enhancedColors.selectionColor,
    accentColor: normalizedTheme.accentColor,
    neutralColor: normalizedTheme.neutralColor,
  };
  
  return themeOptions;
};

/**
 * Main function to synchronize theme across MUI theme and CSS variables
 * 
 * @param {Object} sourceTheme - Source theme data from any source
 * @param {Function} onMuiThemeChange - Callback to update MUI theme in parent component
 * @returns {Object} An object containing the created theme data
 */
export const synchronizeTheme = (sourceTheme, onMuiThemeChange) => {
  try {
    // Step 1: Normalize theme data properties
    const normalizedTheme = normalizeThemeData(sourceTheme);
    
    // Step 2: Create enhanced colors with proper contrast
    const enhancedColors = createContrastEnsuredPalette(
      normalizedTheme.primaryColor,
      normalizedTheme.accentColor,
      normalizedTheme.backgroundColor,
      normalizedTheme.textColor
    );
    
    // Step 3: Update CSS variables
    updateCssVariables(normalizedTheme, enhancedColors);
    
    // Step 4: Create MUI theme options
    const themeOptions = createMuiThemeOptions(normalizedTheme, enhancedColors);
    
    // Step 5: Create actual MUI theme
    const muiTheme = createTheme(themeOptions);
    
    // Step 6: Propagate to parent component if callback provided
    if (typeof onMuiThemeChange === 'function') {
      onMuiThemeChange(themeOptions);
    }
    
    console.log('[ThemeSynchronizer] Theme synchronized successfully');
    
    // Return all relevant data for use in the component
    return {
      normalizedTheme,
      enhancedColors,
      themeOptions,
      muiTheme
    };
  } catch (error) {
    console.error('[ThemeSynchronizer] Failed to synchronize theme:', error);
    throw error;
  }
};

/**
 * Gets the current theme from CSS variables
 * 
 * @returns {Object} Current theme data extracted from CSS variables
 */
export const getThemeFromCssVars = () => {
  return {
    primaryColor: getRootStylePropertyValue('--theme-primary-color'),
    accentColor: getRootStylePropertyValue('--theme-accent-color'),
    backgroundColor: getRootStylePropertyValue('--theme-background-color'),
    textColor: getRootStylePropertyValue('--theme-text-color'),
    neutralColor: getRootStylePropertyValue('--theme-neutral-color')
  };
};

export default {
  synchronizeTheme,
  normalizeThemeData,
  updateCssVariables,
  createMuiThemeOptions,
  getThemeFromCssVars
};
