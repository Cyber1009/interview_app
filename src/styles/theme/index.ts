/**
 * Theme Package Entry Point
 * Centralized exports for theme system
 */

// Export CSS variables
import './variables.css';

// Export colors and components
export { colors, components } from './colors';

// Re-export everything from theme.js
export { createThemeOptions, theme } from '../theme';

// Export default theme
export { default } from '../theme';
