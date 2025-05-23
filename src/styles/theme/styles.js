/**
 * Common Component Styles
 * Provides reusable style generators for components
 */

import { colors, components } from './colors';
import { alpha } from '@mui/material/styles';

/**
 * Generate styles for a card element
 */
export const getCardStyles = (options = {}) => {
  const {
    backgroundColor = components.surface,
    padding = 4,
    borderRadius = 3,
    boxShadow = `0 4px 24px 0 ${alpha(colors.text, 0.1)}`
  } = options;

  return {
    p: padding,
    borderRadius: borderRadius,
    bgcolor: 'var(--color-surface)',
    boxShadow: boxShadow
  };
};

/**
 * Generate styles for form input elements
 */
export const getInputStyles = (options = {}) => {
  const {
    labelColor = colors.text,
    backgroundColor = colors.surface,
    focusColor = colors.primary
  } = options;

  return {
    mb: 4,
    '& .MuiInputLabel-root': { 
      color: 'var(--color-text)'
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-primary)',
      }
    },
    '& .MuiInputBase-root': {
      bgcolor: 'var(--color-surface)',
      '&:hover': {
        bgcolor: alpha(backgroundColor, 0.8),
      },
      '&.Mui-focused': {
        bgcolor: 'var(--color-surface)',
      }
    }
  };
};

/**
 * Generate styles for buttons
 */
export const getButtonStyles = (options = {}) => {
  const {
    backgroundColor = colors.primary,
    textColor = colors.surface
  } = options;

  return {
    py: 1.5,
    borderRadius: 2,
    fontSize: '1rem',
    bgcolor: 'var(--color-primary)',
    color: 'var(--color-surface)',
    '&:hover': {
      bgcolor: alpha(backgroundColor, 0.9)
    }
  };
};

/**
 * Standard card styles used across interviewer panel
 */
export const getStandardCardStyles = (props = {}) => ({
  elevation: 0,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: 'var(--color-surface)',
  mb: 2,
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
  ...props
});

/**
 * Standard card header styles
 */
export const getStandardCardHeaderStyles = (props = {}) => ({
  p: 1.5,
  px: 2,
  borderBottom: '1px solid',
  borderColor: 'divider',
  bgcolor: 'var(--color-surface)',  
  '& .MuiCardHeader-title': {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-primary)'
  },  
  ...props
});

export const getStandardTableHeaderStyles = (props = {}) => ({
  bgcolor: 'var(--color-surface)',
  borderBottom: '2px solid',
  borderColor: 'divider',
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: 'var(--color-primary)',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  ...props
});