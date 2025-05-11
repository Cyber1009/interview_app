/**
 * Styles Export Index
 * 
 * Central export point for all theme-related functionality:
 * - Theme object for Material-UI ThemeProvider
 * - Color palettes for direct component usage
 * - Theme utility functions for creating custom themes
 * - Component-specific color sets
 */

// Export the default theme
export { default as theme } from './theme';

// Export named color collections
export { 
  // Core color palettes
  colors, 
  statusColors,
  componentColors,
  
  // Theme creation utilities
  createPalette,
  createThemeOptions,
  makeTheme
} from './theme';

// Export spacing constants (if you want to add them later)
export * from './spacing';
