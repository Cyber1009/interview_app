import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
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
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  QuestionAnswer as QuestionIcon,
  Token as TokenIcon,
  Settings as SettingsIcon,
  BarChart as ChartIcon,
  Palette as PaletteIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

// Import admin components
import SetQuestion from './SetQuestion';
import SetTheme from './SetTheme';
import AccessToken from './AccessToken';
import InterviewResults from './InterviewResults';
import ConfigManager from './ConfigManager';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const AdminPanel = ({ onThemeChange, onLogoChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logo, setLogo] = useState(() => localStorage.getItem('companyLogo'));
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    handleProfileMenuClose();
  };

  const handleThemeChange = (newTheme) => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const handleLogoChange = (newLogo) => {
    setLogo(newLogo);
    if (onLogoChange) {
      onLogoChange(newLogo);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Questions', icon: <QuestionIcon />, path: '/admin/questions' },
    { text: 'Access Tokens', icon: <TokenIcon />, path: '/admin/tokens' },
    { text: 'Results', icon: <ChartIcon />, path: '/admin/results' },
    { text: 'Theme', icon: <PaletteIcon />, path: '/admin/theme' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    const item = menuItems.find(item => location.pathname === item.path);
    return item ? item.text : 'Admin Dashboard';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open} elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} color="inherit" sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>A</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
      >
        <DrawerHeader>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '100%', 
            py: 1 
          }}>
            {logo ? (
              <img 
                src={logo} 
                alt="Company Logo" 
                style={{ 
                  maxWidth: '80%',
                  maxHeight: 50, 
                  objectFit: 'contain' 
                }} 
              />
            ) : (
              <Typography variant="h6" color="primary" fontWeight={700}>
                Interview Admin
              </Typography>
            )}
          </Box>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding
              onClick={() => navigate(item.path)}
            >
              <ListItemButton
                selected={isActive(item.path)}
                sx={{
                  py: 1.5,
                  borderLeft: isActive(item.path) ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary' 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Paper elevation={0} sx={{ p: 0 }}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/questions" element={<SetQuestion />} />
              <Route path="/tokens" element={<AccessToken />} />
              <Route path="/results" element={<InterviewResults />} />
              <Route path="/theme" element={
                <SetTheme 
                  onThemeChange={handleThemeChange} 
                  logo={logo} 
                  onLogoChange={handleLogoChange}
                />
              } />
              <Route path="/settings" element={<ConfigManager />} />
            </Routes>
          </Paper>
        </Container>
      </Main>
    </Box>
  );
};

// Simple overview component for the dashboard
const Overview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const dashboardItems = [
    { title: 'Questions', path: '/admin/questions', description: 'Manage your interview questions and categories.' },
    { title: 'Access Tokens', path: '/admin/tokens', description: 'Generate and manage interview access tokens.' },
    { title: 'Theme Settings', path: '/admin/theme', description: 'Customize the appearance of your interview platform.' },
    { title: 'Interview Results', path: '/admin/results', description: 'View and analyze interview outcomes.' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Welcome to the Interview Admin Dashboard
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
        {dashboardItems.map((item) => (
          <Paper 
            key={item.title}
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 2,
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate(item.path)}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>{item.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default AdminPanel;