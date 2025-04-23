import React, { useState } from 'react';
import { 
  Box, Tabs, Tab, Container, AppBar, Toolbar, 
  Typography, Button, IconButton 
} from '@mui/material';
import { Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AccessToken from './AccessToken';
import SetQuestion from './SetQuestion';
import SetTheme from './SetTheme';
import InterviewResults from './InterviewResults';
import { AuthService } from '../../services';

const InterviewerPanel = ({ onThemeChange, onLogoChange, logo }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/interviewer/login');
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Interviewer Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{ bgcolor: 'background.paper' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Access Tokens" />
          <Tab label="Questions" />
          <Tab label="Theme" />
          <Tab label="Results" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {currentTab === 0 && <AccessToken />}
        {currentTab === 1 && <SetQuestion />}
        {currentTab === 2 && <SetTheme onThemeChange={onThemeChange} onLogoChange={onLogoChange} logo={logo} />}
        {currentTab === 3 && <InterviewResults />}
      </Container>
    </Box>
  );
};

export default InterviewerPanel;