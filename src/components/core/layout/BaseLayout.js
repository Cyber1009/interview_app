/**
 * BaseLayout Component
 * 
 * Provides a consistent layout structure with:
 * - Responsive navigation drawer with collapsible menu items
 * - App bar with customizable title and user actions
 * - Logo display support
 * - Theme integration
 * - Nested navigation rendering
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Menu,
  MenuItem
} from '@mui/material';
import { colors } from '../../../styles/theme';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Styled drawer width
const drawerWidth = 240;

const BaseLayout = ({ 
  children, 
  navItems, 
  title, 
  logoData, 
  profilePath, 
  settingsPath, 
  userInitial,
  onThemeChange,
  onLogout
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [menuStates, setMenuStates] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  
  const handleSubMenuToggle = (key) => {
    setMenuStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Check if any child in a parent menu is active
  const isAnyChildActive = (children) => {
    if (!children) return false;
    return children.some(child => isPathActive(child.path));
  };
  
  // Initialize expanded state based on active path
  React.useEffect(() => {
    const newMenuStates = {};
    navItems.forEach(item => {
      if (item.children) {
        const shouldBeOpen = isPathActive(item.path) || isAnyChildActive(item.children);
        newMenuStates[item.path] = shouldBeOpen;
      }
    });
    setMenuStates(prev => ({
      ...prev,
      ...newMenuStates
    }));
  }, [location.pathname, navItems]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    // Use the custom logout handler if provided, otherwise use default behavior
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem('token');
      navigate('/login');
    }
    
    // Close menu after logout action
    handleMenuClose();
  };
  
  // Render a navigation item
  const renderNavItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isPathActive(item.path);
    const isOpen = menuStates[item.path];
    
    return (
      <React.Fragment key={item.path}>
        <ListItem 
          button 
          onClick={() => hasChildren ? handleSubMenuToggle(item.path) : handleMenuClick(item.path)}          sx={{            pl: 2 + (depth * 2),            bgcolor: isActive 
              ? (function() {
                  const selColor = theme.custom?.selectionColor || theme.palette.primary.main;
                  // Check if selection color is very light
                  if (selColor === '#ffffff' || selColor === 'white' || 
                      (selColor.startsWith('#') && parseInt(selColor.substr(1), 16) > 0xefefef)) {
                    return alpha('#1976d2', 0.2); // Use blue background for better visibility
                  }
                  return alpha(selColor, 0.15);
                })()
              : 'transparent',
            color: isActive 
              ? (function() {
                  const selColor = theme.custom?.selectionColor || theme.palette.primary.main;
                  // Check if selection color is very light
                  if (selColor === '#ffffff' || selColor === 'white' ||
                      (selColor.startsWith('#') && parseInt(selColor.substr(1), 16) > 0xefefef)) {
                    return '#1976d2'; // Use blue for better visibility with white primary
                  }
                  return selColor;
                })()
              : theme.palette.text.primary,            '&:hover': {
              bgcolor: isActive 
                ? (function() {
                    const selColor = theme.custom?.selectionColor || theme.palette.primary.main;
                    // Check if selection color is very light
                    if (selColor === '#ffffff' || selColor === 'white' || 
                        (selColor.startsWith('#') && parseInt(selColor.substr(1), 16) > 0xefefef)) {
                      return alpha('#1976d2', 0.1); // Use blue with alpha for hover with white primary
                    }
                    return alpha(selColor, 0.15);
                  })()
                : alpha(theme.palette.primary.main, 0.04)
            },borderLeft: isActive 
              ? (function() {
                  const selColor = theme.custom?.selectionColor || theme.palette.primary.main;
                  // Check if selection color is very light
                  if (selColor === '#ffffff' || selColor === 'white' || 
                      (selColor.startsWith('#') && parseInt(selColor.substr(1), 16) > 0xefefef)) {
                    return '4px solid #1976d2'; // Use blue for better visibility with white primary
                  }
                  return `4px solid ${selColor}`;
                })()
              : '4px solid transparent',
          }}
        >
          {item.icon && (          <ListItemIcon sx={{ 
              minWidth: 40, 
              color: isActive 
                ? (function() {
                    const selColor = theme.custom?.selectionColor || theme.palette.primary.main;
                    // Check if selection color is very light
                    if (selColor === '#ffffff' || selColor === 'white' || 
                        (selColor.startsWith('#') && parseInt(selColor.substr(1), 16) > 0xefefef)) {
                      return '#1976d2'; // Use blue for better visibility with white primary
                    }
                    return selColor;
                  })()
                : 'inherit'
            }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.text} />
          {hasChildren && (
            isOpen ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box>
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1,
      }}>
        {logoData ? (
          <Box 
            component="img" 
            src={logoData} 
            alt="Logo"
            sx={{ 
              height: 40, 
              maxWidth: '80%',
              objectFit: 'contain', 
              mr: 1 
            }}
          />
        ) : (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
        )}
        <IconButton onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {navItems.map(item => renderNavItem(item))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1,
          // Use adjusted primary color for better contrast if available
          bgcolor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.custom?.contrastText || theme.palette.primary.contrastText
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit"
              onClick={handleMenuOpen}
              size="small"
            >
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                // Use accent color for better visibility if available
                bgcolor: (theme) => theme.custom?.accentColor || theme.palette.secondary.main,
                color: (theme) => {
                  const bgColor = theme.custom?.accentColor || theme.palette.secondary.main;
                  // Calculate if we need light or dark text
                  if (bgColor.startsWith('#')) {
                    const hex = bgColor.substring(1);
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    return brightness > 128 ? '#000000' : '#FFFFFF';
                  }
                  return theme.palette.secondary.contrastText;
                }
              }}>
                {userInitial}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate(settingsPath);
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            // Use consistent styling with desktop drawer
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e2d' : '#f5f7fa',
            color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#333333'
          },
        }}
      >
        {drawerContent}
      </Drawer>      {/* Desktop drawer */}      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            boxShadow: 1,
            // Use a persistent background color for drawer for better usability
            backgroundColor: (theme) => {
              // Always use a reliable background color regardless of theme
              // Light mode gets light gray, dark mode gets dark gray
              return theme.palette.mode === 'dark' ? '#1e1e2d' : '#f5f7fa';
            },
            // Ensure text has good contrast
            color: (theme) => {
              // Always use a reliable text color for contrast
              return theme.palette.mode === 'dark' ? '#ffffff' : '#333333';
            }
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>        {/* Main content */}
      <Box
        component="main"
        className="main-content-area"
        sx={{
          flexGrow: 1,
          bgcolor: (theme) => 'var(--theme-background-color, ' + theme.palette.background.default + ')',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          pt: 8,
          transition: 'background-color 0.2s ease-in-out',
          position: 'relative',
          zIndex: 0
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BaseLayout;