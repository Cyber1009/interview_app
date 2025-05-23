/**
 * Centralized Color Definitions
 * Single source of truth for all colors used in the application
 */

// Core colors - minimal set for the application
export const colors = {
  // Base colors
  primary: '#091326',    // Main brand color for buttons, headers
  accent: '#52606d',     // Secondary actions (previously gray)
  background: '#b6c2c9', // Main app background (previously grayMedium)
  surface: '#ffffff',    // Card/component background (previously white)
  text: '#52606d',       // Main text color (previously gray)
  
  // Status colors (unchanged)
  success: '#7bae7e',
  warning: '#ff9800',
  error: '#e75552',
  info: '#a4cae5',
};

// Component mapping (simplified)
export const components = {
  background: colors.background,
  surface: colors.surface,
  text: colors.text,
  buttonPrimary: colors.primary,
  buttonAccent: colors.accent,
  
  // Add missing properties that components are using
  labelBackground: colors.accent,     // For background of labels
  labelColor: colors.text,           // For label text
  headerColor: colors.primary,       // For headers
  buttonBackground: colors.primary,  // For button backgrounds
  buttonColor: colors.surface,       // For button text
  cardBackground: colors.surface,    // For card backgrounds
};

// Status colors alias for backward compatibility
export const statusColors = {
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
};

// Theme colors alias for backward compatibility
export const themeColors = colors;

// Component colors alias for backward compatibility
export const componentColors = components;

// Legacy color aliases for backward compatibility
export const gray = colors.accent;
export const grayMedium = colors.background;
export const white = colors.surface;

export default colors;