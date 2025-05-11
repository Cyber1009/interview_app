/**
 * Spacing Constants
 * 
 * Provides standard spacing values for consistent layout
 * throughout the application.
 */

// Base unit for spacing (in pixels)
export const BASE_UNIT = 8;

// Standard spacing values
export const spacing = {
  xs: BASE_UNIT / 2,        // 4px
  sm: BASE_UNIT,            // 8px
  md: BASE_UNIT * 2,        // 16px
  lg: BASE_UNIT * 3,        // 24px
  xl: BASE_UNIT * 4,        // 32px
  xxl: BASE_UNIT * 6,       // 48px
};

// Layout specific spacing
export const layout = {
  pagePadding: spacing.lg,
  sectionMargin: spacing.xl,
  cardPadding: spacing.md,
  inputSpacing: spacing.md,
  buttonPadding: `${spacing.sm}px ${spacing.md}px`,
};

export default spacing;