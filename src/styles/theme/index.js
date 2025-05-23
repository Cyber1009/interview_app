/**
 * Theme Package Entry Point
 * Exports all theme-related configuration and utilities
 */

// Re-export everything from colors
export * from './colors';

// Re-export everything from theme
export * from '../theme';

// Export component styles
export { 
  getCardStyles,
  getInputStyles,
  getButtonStyles,
  getStandardCardStyles,
  getStandardCardHeaderStyles,
  getStandardTableHeaderStyles
} from './styles';

// Export componentColors alias for backward compatibility
export { components as componentColors } from './colors';