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
  Card,
  CardContent,
  Grid,
  Button,
  Badge,
  LinearProgress,
  Chip,
  Stack,
  Tabs,
  Tab,
  List as MuiList,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  VideoLabel as InterviewsIcon,
  Token as TokenIcon,
  Settings as SettingsIcon,
  AssessmentOutlined as ResultsIcon,
  PeopleOutlined as CandidatesIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  CheckCircleOutline as CompletedIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  PlayCircleOutline as StartIcon,
  AccessTime as ClockIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

// Import components
import SetTheme from '../admin/SetTheme';
import AccessToken from '../admin/AccessToken';
import InterviewResults from '../admin/InterviewResults';
import ConfigManager from '../admin/ConfigManager';
import InterviewManager from './InterviewManager';
import UserProfile from './UserProfile';

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

const InterviewerPanel = ({ onThemeChange, onLogoChange }) => {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    handleProfileMenuClose();
    navigate('/interviewer/login');
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/interviewer/profile');
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

  // Updated menu items with interviews instead of separate questions
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/interviewer/dashboard' },
    { text: 'Interviews', icon: <InterviewsIcon />, path: '/interviewer/interviews', badge: 3 },
    { text: 'Candidates', icon: <CandidatesIcon />, path: '/interviewer/candidates', badge: 5 },
    { text: 'Results', icon: <ResultsIcon />, path: '/interviewer/results' },
    { text: 'Access Tokens', icon: <TokenIcon />, path: '/interviewer/tokens' },
    { text: 'Theme', icon: <PaletteIcon />, path: '/interviewer/theme' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/interviewer/settings' },
  ];

  const isActive = (path) => {
    if (path === '/interviewer/dashboard') {
      return location.pathname === '/interviewer' || location.pathname === '/interviewer/' || location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getPageTitle = () => {
    if (location.pathname === '/interviewer' || location.pathname === '/interviewer/') {
      return 'Interviewer Dashboard';
    }
    
    if (location.pathname.startsWith('/interviewer/interviews/')) {
      return 'Interview Details';
    }
    
    const item = menuItems.find(item => location.pathname.startsWith(item.path));
    return item ? item.text : 'Interviewer Dashboard';
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
          
          <Tooltip title="Help">
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} color="inherit" sx={{ ml: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>I</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileClick}>
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
                Interview Platform
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
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
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
        
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subscription Status
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              Pro Plan
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Renews on May 23, 2025
            </Typography>
          </Paper>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Paper elevation={0} sx={{ p: 0 }}>
            <Routes>
              <Route path="/" element={<InterviewerDashboard />} />
              <Route path="/dashboard" element={<InterviewerDashboard />} />
              <Route path="/interviews/:interviewId?" element={<InterviewManager />} />
              <Route path="/candidates" element={<CandidatesList />} />
              <Route path="/tokens" element={<AccessToken />} />
              <Route path="/results/:interviewId?" element={<InterviewResults />} />
              <Route path="/profile" element={<UserProfile />} />
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

// Dashboard component
const InterviewerDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  
  const stats = [
    { label: 'Active Interviews', value: 3, color: 'primary.main' },
    { label: 'Pending Candidates', value: 12, color: 'info.main' },
    { label: 'Completed Interviews', value: 28, color: 'success.main' },
  ];

  const upcomingInterviews = [
    { 
      id: 1, 
      position: 'Senior Frontend Developer', 
      candidate: 'Sarah Johnson', 
      time: '10:30 AM', 
      progress: 'Ready',
      statusColor: 'success.main'
    },
    { 
      id: 2, 
      position: 'UX Designer', 
      candidate: 'Michael Chen', 
      time: '1:00 PM', 
      progress: 'Scheduled',
      statusColor: 'primary.main'
    },
    { 
      id: 3, 
      position: 'Product Manager', 
      candidate: 'Erica Williams',
      time: 'Tomorrow', 
      progress: 'Confirmed',
      statusColor: 'info.main'
    },
  ];

  const recentInterviews = [
    { 
      id: 1, 
      name: 'Frontend Developer', 
      candidates: 5, 
      completed: 2,
      date: '2025-04-21',
      progress: 40
    },
    { 
      id: 2, 
      name: 'UX Designer', 
      candidates: 8, 
      completed: 4,
      date: '2025-04-15',
      progress: 50
    },
    { 
      id: 3, 
      name: 'Product Manager', 
      candidates: 3, 
      completed: 1,
      date: '2025-04-10',
      progress: 33
    }
  ];

  const recentActivity = [
    { action: "New candidate applied", template: "Frontend Developer", time: "2 hours ago" },
    { action: "Interview completed", template: "UX Designer", time: "Yesterday" },
    { action: "Access token created", template: "Product Manager", time: "2 days ago" },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '-0.01em',
            color: 'text.primary'
          }}>
            Welcome back, Interviewer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/interviewer/interviews')}
          >
            Find Interview
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/interviewer/interviews')}
          >
            Create Interview
          </Button>
        </Stack>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 600,
                  color: stat.color,
                  mb: 1
                }}
              >
                {stat.value}
              </Typography>
              <Typography color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Interviews Section */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Today's Schedule
            </Typography>
          </Box>
          <Button size="small" onClick={() => navigate('/interviewer/candidates')}>
            View All
          </Button>
        </Box>
        
        <Box>
          {upcomingInterviews.map((interview, index) => (
            <React.Fragment key={interview.id}>
              {index > 0 && <Divider />}
              <Box 
                sx={{ 
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    bgcolor: 'background.default',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => navigate(`/interviewer/candidates`)}
              >
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {interview.candidate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {interview.position}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ClockIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.time}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={interview.progress} 
                    size="small"
                    sx={{ 
                      bgcolor: `${interview.statusColor}15`, 
                      color: interview.statusColor,
                      fontWeight: 500
                    }}
                  />
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<StartIcon />}
                    color="primary"
                  >
                    Begin
                  </Button>
                </Box>
              </Box>
            </React.Fragment>
          ))}
          
          {upcomingInterviews.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No interviews scheduled for today
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Tabs for Templates and Recent Activity */}
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minWidth: 0,
              px: 3,
            },
          }}
        >
          <Tab label="Interview Templates" />
          <Tab label="Recent Activity" />
        </Tabs>
      </Box>

      {/* Recent Interview Templates */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {recentInterviews.map((interview) => (
            <Grid item xs={12} md={4} key={interview.id}>
              <Card 
                elevation={0}
                sx={{ 
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
                onClick={() => navigate(`/interviewer/interviews/${interview.id}`)}
              >
                <CardContent sx={{ pb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {interview.name}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                      Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={interview.progress} 
                      sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {interview.completed} completed
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {interview.candidates} candidates
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Chip 
                      size="small" 
                      label={`Created: ${new Date(interview.date).toLocaleDateString()}`}
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    
                    <Button 
                      size="small" 
                      variant="text" 
                      color="primary"
                    >
                      Manage
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Recent Activity Feed */}
      {activeTab === 1 && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <List sx={{ p: 0 }}>
            {recentActivity.map((activity, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem sx={{ px: 3, py: 2 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {activity.action}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="body2">
                          {activity.template}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

// Simple placeholder for Candidates List
const CandidatesList = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Candidates
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          This is where you can manage and view candidate information.
        </Typography>
      </Paper>
    </Box>
  );
};

export default InterviewerPanel;