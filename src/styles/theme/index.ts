/**
 * Theme Package Entry Point
 * Centralized exports for theme system
 */

// Export CSS variables (ensure this file exists)
import './variables.css';

// Export colors and components (verify this file exists)
export { colors, components } from './colors';

// Check if these imports are correct - should they be from current directory?
export { createThemeOptions, theme } from './theme';

// Export default theme
export { default } from './theme';