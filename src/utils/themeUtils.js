/**
 * Theme Utilities
 * 
 * Helper functions for working with theme and styling across components
 */

import { alpha } from '@mui/material/styles';
import { componentColors } from '../styles/theme';

/**
 * Generate styles for a card element that will override global CSS
 * and ensure the card is visible regardless of theme settings
 * 
 * @param {Object} options - Styling options
 * @param {string} options.backgroundColor - Optional custom background color 
 * @param {string} options.padding - Optional padding (defaults to 4)
 * @param {number} options.borderRadius - Optional border radius (defaults to 3)
 * @param {string} options.boxShadow - Optional custom box shadow
 * @returns {Object} MUI sx props object for a Paper or Card component
 */
export const getCardStyles = (options = {}) => {
  const {
    backgroundColor = componentColors.cardBackground,
    padding = 4,
    borderRadius = 3,
    boxShadow = '0 4px 24px 0 rgba(80,86,96,0.10)'
  } = options;

  return {
    p: padding,
    borderRadius: borderRadius,
    bgcolor: `${backgroundColor} !important`, // Using !important to override global styling
    boxShadow: boxShadow
  };
};

/**
 * Generate styles for form input elements to match theme
 * 
 * @param {Object} options - Styling options
 * @param {string} options.labelColor - Color for labels
 * @param {string} options.backgroundColor - Background color for inputs
 * @param {string} options.focusColor - Color for input focus states
 * @returns {Object} MUI sx props object for inputs like TextField
 */
export const getInputStyles = (options = {}) => {
  const {
    labelColor = componentColors.labelColor,
    backgroundColor = componentColors.labelBackground,
    focusColor = componentColors.buttonBackground
  } = options;

  return {
    mb: 4,
    '& .MuiInputLabel-root': { 
      color: labelColor 
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: focusColor,
      }
    },
    '& .MuiInputBase-root': {
      bgcolor: alpha(backgroundColor, 0.3),
      '&:hover': {
        bgcolor: alpha(backgroundColor, 0.5),
      },
      '&.Mui-focused': {
        bgcolor: componentColors.cardBackground,
      }
    }
  };
};

/**
 * Generate styles for a button that match the theme
 * 
 * @param {Object} options - Styling options
 * @param {string} options.backgroundColor - Background color for button
 * @param {string} options.textColor - Text color for button
 * @returns {Object} MUI sx props object for Button component
 */
export const getButtonStyles = (options = {}) => {
  const {
    backgroundColor = componentColors.buttonBackground,
    textColor = componentColors.buttonColor
  } = options;

  // Ensure colors are valid strings
  const validateColor = (color, defaultColor) => {
    if (!color || typeof color !== 'string') {
      return defaultColor;
    }
    return color;
  };

  const bgColor = validateColor(backgroundColor, '#091326');
  const txtColor = validateColor(textColor, '#ffffff');

  // Use direct color values for hover and disabled states to avoid alpha issues
  const hoverBgColor = '#1a233a'; // Lighter variant
  const disabledBgColor = '#394056'; // Semi-transparent variant

  return {
    py: 1.5,
    borderRadius: 2,
    fontSize: '1rem',
    bgcolor: bgColor,
    color: txtColor,
    '&:hover': {
      bgcolor: hoverBgColor
    },
    '&.Mui-disabled': {
      bgcolor: disabledBgColor
    }
  };
};

export default {
  getCardStyles,
  getInputStyles,
  getButtonStyles
};
