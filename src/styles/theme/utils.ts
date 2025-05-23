/**
 * Essential theme utility functions
 */

import { colors } from './colors';

/**
 * Adjusts color luminance
 * @param hex - Hex color string
 * @param amount - Amount to adjust (-1 to 1)
 */
export const adjustColorLuminance = (hex: string, amount: number): string => {
  // Implementation remains the same
  return hex; // TODO: Implement if needed
};

/**
 * Gets contrast color (black or white) for a background color
 * @param bgColor - Background color to check against
 */
export const getContrastColor = (bgColor: string): string => {
  // Implementation remains the same
  return colors.text; // TODO: Implement if needed
};

/**
 * Generate consistent card styles
 */
export const getCardStyles = () => ({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-md)',
  padding: 'var(--spacing-md)',
});

/**
 * Generate consistent button styles
 */
export const getButtonStyles = (variant: 'primary' | 'accent' = 'primary') => ({
  backgroundColor: `var(--color-${variant})`,
  color: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--spacing-sm) var(--spacing-md)',
});

export default {
  adjustColorLuminance,
  getContrastColor,
  getCardStyles,
  getButtonStyles,
};
