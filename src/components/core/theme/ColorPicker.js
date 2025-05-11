/**
 * Color Picker Component
 * 
 * Provides a color input field with preview and labels.
 * 
 * Features:
 * - Native color picker integration
 * - Color preview swatch
 * - Optional disabled state
 */

import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const ColorPicker = ({ 
  label, 
  color, 
  onChange, 
  disabled = false 
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box 
          sx={{ 
            width: 36, 
            height: 36, 
            borderRadius: 1, 
            bgcolor: color, 
            mr: 2, 
            border: '1px solid',
            borderColor: 'divider',
            opacity: disabled ? 0.5 : 1
          }} 
        />
        
        <TextField
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: '100%' }}
          inputProps={{ 
            style: { padding: '8px', height: '24px' },
          }}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

export default ColorPicker;