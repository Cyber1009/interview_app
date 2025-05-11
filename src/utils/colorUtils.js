/**
 * Color Utility Functions
 * 
 * A collection of utility functions for color manipulation, contrast checking,
 * and accessibility improvements in the interview application UI.
 */

/**
 * Converts hex color string to RGB object
 * @param {string} hex - Hex color string (e.g., "#RRGGBB")
 * @returns {Object|null} RGB color object {r, g, b} or null if invalid
 */
export const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle both 3-digit and 6-digit formats
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse hex to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
};

/**
 * Convert RGB to hexadecimal string
 * @param {object} rgb - RGB color object {r: 0-255, g: 0-255, b: 0-255}
 * @returns {string} Hexadecimal color string (#RRGGBB)
 */
export const rgbToHex = ({ r, g, b }) => {
  return '#' + [r, g, b]
    .map(x => Math.round(x).toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Calculate relative luminance of an RGB color (WCAG formula)
 * @param {Object} rgb - RGB color object {r, g, b}
 * @returns {number} Luminance value (0-1)
 */
export const calculateLuminance = (rgb) => {
  if (!rgb) return 0.5; // Default to mid-luminance if invalid
  
  // Normalize RGB values to 0-1
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  // Convert to sRGB
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance using WCAG formula
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
};

/**
 * Calculates contrast ratio between two luminance values
 * @param {number} lum1 - First luminance value (0-1)
 * @param {number} lum2 - Second luminance value (0-1)
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (lum1, lum2) => {
  const lighterLum = Math.max(lum1, lum2);
  const darkerLum = Math.min(lum1, lum2);
  return (lighterLum + 0.05) / (darkerLum + 0.05);
};

/**
 * Creates a contrasting color (for text) based on background luminance
 * @param {string} backgroundColor - Hex color string
 * @returns {string} Hex color string
 */
export const getContrastColor = (backgroundColor) => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  const luminance = calculateLuminance(rgb);
  // Use white text on dark backgrounds, black text on light backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Adjusts a color's luminance by a factor
 * @param {string} hexColor - Hex color string
 * @param {number} factor - Factor to adjust by (negative darkens, positive lightens)
 * @returns {string} Adjusted hex color
 */
export const adjustColorLuminance = (hexColor, factor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;
  
  // Adjust RGB values
  const adjustValue = (value) => {
    return Math.max(0, Math.min(255, Math.round(value + (factor * 255))));
  };
  
  const newR = adjustValue(rgb.r);
  const newG = adjustValue(rgb.g);
  const newB = adjustValue(rgb.b);
  
  // Convert back to hex
  return `#${(newR).toString(16).padStart(2, '0')}${(newG).toString(16).padStart(2, '0')}${(newB).toString(16).padStart(2, '0')}`;
};

/**
 * Creates a palette with adjusted colors to ensure proper contrast
 * @param {string} primaryColor - Primary color hex
 * @param {string} secondaryColor - Secondary color hex
 * @param {string} bgColor - Background color hex
 * @param {string} textColor - Text color hex
 * @returns {object} Enhanced color palette with contrast-optimized colors
 */
export const createContrastEnsuredPalette = (primaryColor, secondaryColor, bgColor, textColor) => {
  // Default colors if none provided
  const primary = primaryColor || '#3f51b5';
  const secondary = secondaryColor || '#f50057';
  
  // Calculate luminance of primary color to determine if it's light or dark
  const primaryRgb = hexToRgb(primary);
  const primaryLuminance = calculateLuminance(primaryRgb);
  
  // For very light primary colors (e.g., white), create a slightly darker version
  const adjustedPrimary = primaryLuminance > 0.9 
    ? adjustColorLuminance(primary, -0.2) // Darken very light colors
    : (primaryLuminance > 0.7 
       ? adjustColorLuminance(primary, -0.1) // Slightly darken light colors
       : primary);
  
  // Create appropriate background color
  // If user defined background is very light or white, tint it slightly with primary color
  let background = bgColor || '#ffffff';
  const bgRgb = hexToRgb(background);
  const bgLuminance = calculateLuminance(bgRgb);
  
  if (bgLuminance > 0.9) {
    // For very light backgrounds, add a very subtle tint of the primary color
    background = adjustColorLuminance(
      `#${Math.round(primaryRgb.r*0.05 + 245).toString(16).padStart(2,'0')}${
        Math.round(primaryRgb.g*0.05 + 245).toString(16).padStart(2,'0')}${
        Math.round(primaryRgb.b*0.05 + 245).toString(16).padStart(2,'0')}`,
      0
    );
  }
  
  // Adjust text color based on background luminance
  let text = textColor || '#000000';
  if (!textColor) {
    text = bgLuminance > 0.65 ? '#222222' : '#ffffff';
  }
  
  // Create contrasting selection color
  const selectionColor = primaryLuminance > 0.6
    ? adjustColorLuminance(primary, -0.3) // Darker selection for light primary
    : adjustColorLuminance(primary, 0.3);  // Lighter selection for dark primary
  
  // Create hover effects
  const hoverLight = adjustColorLuminance(primary, 0.1);
  const hoverDark = adjustColorLuminance(primary, -0.1);
  
  return {
    primary,
    adjustedPrimary,
    secondary,
    background,
    text,
    selectionColor,
    hoverLight,
    hoverDark,
    contrastText: getContrastColor(adjustedPrimary)
  };
};

/**
 * Checks if a color is very light (close to white)
 * @param {string} hexColor - Hex color string
 * @returns {boolean} True if color is very light
 */
export const isVeryLightColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return false;
  
  const luminance = calculateLuminance(rgb);
  return luminance > 0.85;
};

/**
 * Checks if a color is very dark (close to black) 
 * @param {string} hexColor - Hex color string
 * @returns {boolean} True if color is very dark
 */
export const isVeryDarkColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return false;
  
  const luminance = calculateLuminance(rgb);
  return luminance < 0.1;
};
