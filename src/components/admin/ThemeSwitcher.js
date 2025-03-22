// src/components/ThemeSwitcher.js
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
} from '@mui/material';
import { Palette } from '@mui/icons-material';
import { themeConfigs } from '../../styles/themeConfigs';

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (themeKey) => {
    onThemeChange(themeKey);
    handleClose();
  };

  return (
    <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1200 }}>
      <Tooltip title="Change Theme">
        <IconButton
          onClick={handleClick}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <Palette />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
          },
        }}
      >
        {Object.entries(themeConfigs).map(([key, theme]) => (
          <MenuItem
            key={key}
            onClick={() => handleThemeSelect(key)}
            selected={currentTheme === key}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: theme.gradients.primary,
                }}
              />
            </ListItemIcon>
            <ListItemText primary={theme.name} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ThemeSwitcher;