/**
 * Enhanced Theme Preview Component
 * 
 * Displays a comprehensive preview of theme colors and branding across multiple UI elements.
 * 
 * Features:
 * - Real-time theme visualization
 * - Preview of sidebar, content area, and interactive elements
 * - Sample UI elements with applied theme
 * - Visual representation of color contrast and accessibility
 */

import React from 'react';
import { Box, Typography, Button, Divider, Paper, Tooltip, Badge } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { componentColors } from '../../../styles/theme';
import { 
  adjustColorLuminance, 
  calculateLuminance, 
  hexToRgb 
} from '../../../utils/colorUtils';

const ThemePreview = ({ 
  colors = {
    primary: componentColors.buttonBackground,
    secondary: componentColors.headerColor, 
    background: componentColors.background,
    text: componentColors.labelColor
  },
  themeOptions = null,
  logo = null
}) => {
  // Use enhanced theme options if available
  const sidebarBg = themeOptions?.sidebar?.background || colors.primary;
  const sidebarText = themeOptions?.sidebar?.text || '#ffffff';
  const sidebarSelected = themeOptions?.sidebar?.selectedItem || lightenOrDarken(sidebarBg, isDark(sidebarBg) ? 0.2 : -0.2);
  const sidebarHover = themeOptions?.sidebar?.hoverItem || lightenOrDarken(sidebarBg, isDark(sidebarBg) ? 0.1 : -0.1);
  
  const buttonPrimary = themeOptions?.buttons?.primary || colors.secondary;
  const buttonSecondary = themeOptions?.buttons?.secondary || colors.primary;
  const buttonText = themeOptions?.buttons?.text || '#ffffff';
  
  const contentBg = colors.background;
  const contentText = colors.text;
  const contentTextSecondary = themeOptions?.palette?.text?.secondary || lightenOrDarken(contentText, 0.3);
  const dividerColor = themeOptions?.palette?.divider || `rgba(${isDark(contentBg) ? '255,255,255' : '0,0,0'}, 0.12)`;
  
  // Get palette variants if available
  const primaryLight = themeOptions?.palette?.primary?.light || lightenOrDarken(colors.primary, 0.2);
  const primaryDark = themeOptions?.palette?.primary?.dark || lightenOrDarken(colors.primary, -0.2);
  const secondaryLight = themeOptions?.palette?.secondary?.light || lightenOrDarken(colors.secondary, 0.2);
  const secondaryDark = themeOptions?.palette?.secondary?.dark || lightenOrDarken(colors.secondary, -0.2);
  
  // Determine if we're in dark mode
  const isDarkMode = isDark(contentBg);
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: 320, // Ensure a good preview height
      }}>
        {/* Sidebar Preview */}
        <Box sx={{ 
          width: '30%',
          bgcolor: sidebarBg,
          color: sidebarText,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          {logo && (
            <Box sx={{ 
              mb: 2, 
              display: 'flex',
              justifyContent: 'center',
              p: 1
            }}>
              <img
                src={logo}
                alt="Preview Logo"
                style={{
                  maxWidth: '90%',
                  maxHeight: 40,
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}
          
          {/* Sidebar Menu Items */}
          <SidebarItem 
            icon={<HomeIcon fontSize="small" />} 
            text="Dashboard" 
            selected={true} 
            textColor={sidebarText}
            selectedBg={sidebarSelected}
          />
          <SidebarItem 
            icon={<PeopleIcon fontSize="small" />} 
            text="Interviews" 
            textColor={sidebarText}
            hoverBg={sidebarHover}
          />
          <SidebarItem 
            icon={<SettingsIcon fontSize="small" />} 
            text="Settings" 
            textColor={sidebarText}
            hoverBg={sidebarHover}
          />
          
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Typography variant="caption" sx={{ 
              opacity: 0.7, 
              fontSize: '0.75rem',
              px: 1.5
            }}>
              Theme Preview
            </Typography>
            <SidebarItem 
              icon={<ColorLensIcon fontSize="small" />} 
              text="Customize" 
              textColor={sidebarText}
              hoverBg={sidebarHover}
            />
          </Box>
        </Box>
        
        {/* Content Preview */}
        <Box sx={{ 
          flex: 1,
          bgcolor: contentBg,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {/* Header area */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: contentText,
                fontWeight: 600,
              }}
            >
              Dashboard
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Tooltip title="Notifications">
                <Badge 
                  badgeContent={2} 
                  color="secondary" 
                  sx={{
                    '.MuiBadge-badge': {
                      bgcolor: colors.secondary,
                      color: isDark(colors.secondary) ? '#fff' : '#000'
                    }
                  }}
                >
                  <NotificationsIcon sx={{ color: contentText }} />
                </Badge>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider sx={{ borderColor: dividerColor }} />
          
          {/* Content cards */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Status card */}
            <Box sx={{ 
              p: 1.5, 
              bgcolor: isDarkMode ? lightenOrDarken(contentBg, 0.1) : '#ffffff', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: dividerColor,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ color: contentText, fontWeight: 500, fontSize: '0.875rem' }}>
                  Interview Status
                </Typography>
                <CheckCircleIcon sx={{ color: buttonPrimary, fontSize: '1.2rem' }} />
              </Box>
              <Typography sx={{ color: contentTextSecondary, fontSize: '0.75rem' }}>
                All systems ready
              </Typography>
            </Box>
            
            {/* Time card */}
            <Box sx={{ 
              p: 1.5, 
              bgcolor: isDarkMode ? lightenOrDarken(contentBg, 0.1) : '#ffffff', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: dividerColor,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ color: contentText, fontWeight: 500, fontSize: '0.875rem' }}>
                  Time Remaining
                </Typography>
                <AccessTimeIcon sx={{ color: secondaryLight, fontSize: '1.2rem' }} />
              </Box>
              <Typography sx={{ color: contentTextSecondary, fontSize: '0.75rem' }}>
                45:00 minutes
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography 
              sx={{ 
                color: contentText,
                mb: 1,
                fontWeight: 500
              }}
            >
              Interview Session
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: isDarkMode ? lightenOrDarken(contentBg, 0.1) : '#ffffff', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: dividerColor,
              mb: 2
            }}>
              <Typography 
                sx={{ 
                  color: contentText,
                  mb: 1.5,
                  fontSize: '0.875rem'
                }}
              >
                How would you implement this feature?
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  size="small"
                  sx={{ 
                    bgcolor: 'transparent',
                    color: buttonPrimary,
                    border: `1px solid ${buttonPrimary}`,
                    '&:hover': { 
                      bgcolor: `${buttonPrimary}22`
                    }
                  }}
                >
                  Skip
                </Button>
                <Button 
                  size="small"
                  variant="contained"
                  sx={{ 
                    bgcolor: buttonPrimary, 
                    color: buttonText,
                    '&:hover': { 
                      bgcolor: buttonPrimary,
                      opacity: 0.9
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            mt: 'auto',
            display: 'flex',
            gap: 1
          }}>
            <Button
              variant="outlined"
              sx={{ 
                borderColor: buttonSecondary,
                color: buttonSecondary,
                '&:hover': { 
                  borderColor: buttonSecondary,
                  bgcolor: `${buttonSecondary}11`  
                },
                flex: 1,
                py: 0.75
              }}
            >
              Secondary
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                bgcolor: buttonPrimary, 
                color: buttonText,
                '&:hover': { 
                  bgcolor: buttonPrimary,
                  opacity: 0.9  
                },
                flex: 1,
                py: 0.75
              }}
            >
              Primary Action
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Color Chips Row */}
      <Box sx={{ 
        display: 'flex',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}>
        <ColorChip color={colors.primary} label="Primary" variant="base" />
        <ColorChip color={primaryLight} label="Primary Light" tooltip="primaryLight" />
        <ColorChip color={primaryDark} label="Primary Dark" tooltip="primaryDark" />
        <ColorChip color={colors.secondary} label="Secondary" variant="base" />
      </Box>
      
      {/* Additional color variants */}
      <Box sx={{ 
        display: 'flex',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}>
        <ColorChip color={secondaryLight} label="Secondary Light" tooltip="secondaryLight" />
        <ColorChip color={secondaryDark} label="Secondary Dark" tooltip="secondaryDark" />
        <ColorChip color={sidebarBg} label="Sidebar" tooltip="sidebar.background" />
        <ColorChip color={sidebarSelected} label="Selected" tooltip="sidebar.selectedItem" />
      </Box>
    </Paper>
  );
};

// Helper component for sidebar items
const SidebarItem = ({ icon, text, selected = false, textColor, selectedBg, hoverBg }) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 1.5,
      py: 1,
      borderRadius: 1,
      bgcolor: selected ? selectedBg : 'transparent',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
      '&:hover': {
        bgcolor: selected ? selectedBg : (hoverBg || 'rgba(255,255,255,0.08)')
      }
    }}>
      {icon}
      <Typography sx={{ 
        fontSize: '0.875rem',
        fontWeight: selected ? 500 : 400,
        color: textColor,
        flexGrow: 1
      }}>
        {text}
      </Typography>
    </Box>
  );
};

// Helper component for color chips
const ColorChip = ({ color, label, tooltip, variant }) => {
  const textColor = isDark(color) ? '#fff' : '#000';
  
  const content = (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 1,
      bgcolor: color,
      color: textColor,
      fontSize: '0.75rem',
      fontWeight: 500,
      position: 'relative',
      ...(variant === 'base' && {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '0.25rem',
          right: '0.25rem',
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          backgroundColor: textColor,
          opacity: 0.5
        }
      })
    }}>
      {label}
      {tooltip && <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.6rem' }}>
        {tooltip}
      </Typography>}
    </Box>
  );
  
  return content;
};

// Helper function to check if a color is dark - using imported utility
const isDark = (color) => {
  if (!color) return false;
  
  // For hex colors, use the utility function
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (rgb) {
      const luminance = calculateLuminance(rgb);
      return luminance < 0.5;
    }
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    const parts = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (parts) {
      const rgb = {
        r: parseInt(parts[1], 10),
        g: parseInt(parts[2], 10),
        b: parseInt(parts[3], 10)
      };
      const luminance = calculateLuminance(rgb);
      return luminance < 0.5;
    }
  }
  
  return false;
};

// Helper function to lighten or darken a color - using imported utility
const lightenOrDarken = (color, amount) => {
  if (!color) return color;
  return adjustColorLuminance(color, amount);
};

export default ThemePreview;