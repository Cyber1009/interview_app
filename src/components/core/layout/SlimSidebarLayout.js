/**
 * SlimSidebarLayout Component
 * 
 * Provides a clean, icon-only sidebar layout with:
 * - Thin sidebar navigation with only icons
 * - No app bar for a cleaner interface
 * - Logout button at the bottom of the sidebar
 * - Consistent styling with candidate pages
 * - Tooltip support for icon-only navigation
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import { componentColors, colors } from '../../../styles/theme';
import { layout } from '../../../styles/spacing';
import { MainContentArea, getDrawerPaperStyles } from './LayoutUtils';

// Styled drawer width - much thinner since we only show icons
const drawerWidth = layout.slimDrawerWidth || 60; // Use centralized value with fallback

const SlimSidebarLayout = ({ 
  children, 
  navItems, 
  logoData,
  onLogout,
  headerButton
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  // Render a navigation item (icon only with tooltip)
  const renderNavItem = (item) => {
    const isActive = isPathActive(item.path);
    
    return (
      <Tooltip title={item.text} placement="right" key={item.path}>        <ListItem 
          button 
          onClick={() => handleMenuClick(item.path)}
          sx={{
            py: 1.25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px', // Updated to match the profile/logout button radius
            my: 0.5, // Slightly increased vertical margin for better spacing
            mx: 0.75, // Adjusted horizontal margin for better alignment
            minWidth: 'auto', // Prevent expanding beyond parent width
            height: '40px', // Fixed height for consistency with bottom buttons
            width: '40px', // Fixed width for consistency with bottom buttons
            bgcolor: isActive 
              ? alpha(componentColors.buttonBackground, 0.15)
              : 'transparent',            color: isActive 
              ? componentColors.buttonBackground
              : 'var(--theme-text-color, #212121)',
            '&:hover': {
              bgcolor: isActive 
                ? alpha(componentColors.buttonBackground, 0.2)
                : alpha(theme.palette.primary.main, 0.08) // Updated to match profile/logout hover effect
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '25%',
              height: '50%',
              width: isActive ? 3 : 0,
              backgroundColor: componentColors.buttonBackground,
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
              transition: 'all 0.2s'
            }
          }}
        >          {item.icon && (
            <ListItemIcon sx={{ 
              minWidth: 'auto',
              width: '24px', // Fixed width
              height: '24px', // Fixed height
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.25rem', // Match with default IconButton size
              color: isActive 
                ? componentColors.buttonBackground
                : 'inherit'
            }}>
              {React.cloneElement(item.icon, { 
                fontSize: 'inherit' // Ensure consistent icon sizing
              })}
            </ListItemIcon>
          )}
        </ListItem>
      </Tooltip>
    );
  };
  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%', // Ensure box takes full width of drawer
      overflow: 'hidden' // Prevent overflow
    }}>      {/* Logo at the top */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 1.5, // Increased padding for more space
        pb: 1.75, // Additional bottom padding
        width: '100%' // Ensure box takes full width
      }}>
        {logoData && (
          <Box 
            component="img" 
            src={logoData} 
            alt="Logo"
            sx={{ 
              height: 28, // Slightly increased height
              maxWidth: '100%', // Ensure logo doesn't overflow
              objectFit: 'contain'
            }}
          />
        )}
      </Box>
      
      <Divider sx={{ mb: 1.25 }} /> {/* Added bottom margin to divider */}
        {/* Navigation Items */}
      <List sx={{ 
        flexGrow: 1, 
        px: 0.5, // Added small horizontal padding
        py: 1, // Added vertical padding
        width: '100%', // Ensure list takes full width
        overflow: 'hidden', // Prevent overflow
        display: 'flex',
        flexDirection: 'column',
        gap: 0.25 // Added small gap between items
      }}>
        {navItems.map(item => renderNavItem(item))}
      </List>
        {/* Bottom area with profile and logout */}        <Box sx={{ 
        px: 0.5, // Match padding with navigation list
        pb: 1.75, // Slightly increased bottom padding
        pt: 0.5, // Added top padding
        width: '100%', // Ensure box takes full width
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Divider sx={{ my: 1.25, width: '80%' }} /> {/* Increased vertical margin */}
        
        {/* User profile button - moved to bottom */}
        {headerButton && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1.25 }}>
            <Tooltip title={headerButton.tooltip || ''} placement="right">              <IconButton
                onClick={headerButton.onClick}
                sx={{
                  borderRadius: '8px',
                  p: 1, // Added explicit padding
                  bgcolor: 'transparent',
                  width: '40px', // Fixed width to match navigation items
                  height: '40px', // Fixed height to match navigation items
                  fontSize: '1.25rem', // Consistent icon size
                  '&:hover': {
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                {React.cloneElement(headerButton.icon, { fontSize: 'inherit' })}
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        <Tooltip title="Logout" placement="right">          <IconButton 
            onClick={onLogout}
            sx={{
              color: theme.palette.error.main,
              opacity: 0.7,
              borderRadius: '8px',
              p: 1, // Added explicit padding
              mb: 0.5,
              width: '40px', // Fixed width to match navigation items
              height: '40px', // Fixed height to match navigation items
              fontSize: '1.25rem', // Consistent icon size
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
                opacity: 1
              }
            }}
          >
            <LogoutIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>      {/* Mobile drawer */}      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}        sx={{          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': getDrawerPaperStyles(drawerWidth),
        }}
      >
        {drawerContent}
      </Drawer>      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{          width: drawerWidth,
          flexShrink: 0,          '& .MuiDrawer-paper': getDrawerPaperStyles(drawerWidth),
        }}
        open
      >
        {drawerContent}      </Drawer>      {/* Main content */}
      <MainContentArea drawerWidth={drawerWidth}>
        {children}
      </MainContentArea>
    </Box>
  );
};

export default SlimSidebarLayout;
