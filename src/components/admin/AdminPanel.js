import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  useTheme,
  Grid,
  alpha,
  LinearProgress,
  Divider,
  InputBase,
  IconButton,
  Tooltip,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  Avatar,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  DataObject as DatabaseIcon,
  CloudDone as CloudIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  PendingActions as PendingIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import UserManagement, { UserDataContext, UserDataProvider } from './UserManagement';
import SystemStatus from './SystemStatus';
import PendingAccounts from './PendingAccounts';
import RequireAdminAuth from '../core/auth/RequireAdminAuth';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../services/adminService';
import { componentColors } from '../../styles';

/**
 * AdminPanel Component
 * 
 * Reorganized admin dashboard with layout matching sample.html:
 * - Left card: Admin Panel title and info
 * - Top right: Search bar
 * - Middle right: User list
 * - Bottom: System status cards
 */
const AdminPanel = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [pendingError, setPendingError] = useState(null);
  const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    company: '',
    role: 'user'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminUsername, setAdminUsername] = useState('Admin');
  const [lastLoginTime, setLastLoginTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStartTime, setSessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState('0m');
  
  useEffect(() => {
    // Get admin username from localStorage
    const storedUsername = localStorage.getItem('adminUsername') || localStorage.getItem('adminUser');
    if (storedUsername) {
      setAdminUsername(storedUsername);
    }
    
    // Set or retrieve session start time
    let startTime;
    if (!sessionStorage.getItem('adminSessionStartTime')) {
      startTime = new Date();
      sessionStorage.setItem('adminSessionStartTime', startTime.toISOString());
    } else {
      startTime = new Date(sessionStorage.getItem('adminSessionStartTime'));
    }
    setSessionStartTime(startTime);
    
    // Update session duration every minute
    const calculateDuration = () => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000); // difference in seconds
      
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      
      if (hours > 0) {
        setSessionDuration(`${hours}h ${minutes}m`);
      } else {
        setSessionDuration(`${minutes}m`);
      }
    };
    
    // Calculate initial duration
    calculateDuration();
    
    // Set up interval to update duration
    const durationInterval = setInterval(calculateDuration, 60000); // update every minute
    
    return () => clearInterval(durationInterval);
  }, []);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    // Redirect to admin login page
    navigate('/admin/login');
  };

  // Fetch pending users count
  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        setIsLoadingPending(true);
        
        // Get pending accounts
        const pendingResponse = await AdminService.getPendingAccounts();
        if (pendingResponse && pendingResponse.data) {
          setPendingCount(pendingResponse.data.length || 0);
        } else {
          setPendingCount(0);
        }
        
        setPendingError(null);
      } catch (err) {
        console.error("Error fetching pending user data:", err);
        setPendingError("Failed to fetch pending user information");
        setPendingCount(0);
      } finally {
        setIsLoadingPending(false);
      }
    };

    fetchPendingData();
    
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(fetchPendingData, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle opening the pending accounts dialog
  const handlePendingAccountsClick = () => {
    setPendingDialogOpen(true);
  };
  
  // Handle closing the pending accounts dialog
  const handleClosePendingDialog = () => {
    setPendingDialogOpen(false);
    refreshPendingCount();
  };
  
  // Refresh the count of pending accounts
  const refreshPendingCount = async () => {
    try {
      const response = await AdminService.getPendingAccounts();
      if (response && response.data) {
        setPendingCount(response.data.length || 0);
      } else {
        setPendingCount(0);
      }
    } catch (err) {
      console.error("Error refreshing pending accounts count:", err);
    }
  };

  // Handle opening the Add User dialog
  const handleAddUserClick = () => {
    setAddUserDialogOpen(true);
  };

  // Handle closing the Add User dialog
  const handleCloseAddUserDialog = () => {
    setAddUserDialogOpen(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      company: '',
      role: 'user'
    });
  };

  // Handle submitting the new user form
  const handleAddUserSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await AdminService.createUser(newUser);
      if (response && response.data) {
        setSnackbar({
          open: true,
          message: 'User added successfully',
          severity: 'success'
        });
        handleCloseAddUserDialog();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to add user',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setSnackbar({
        open: true,
        message: 'Error adding user',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAdminAuth>
      <UserDataProvider>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: '100vh',
            bgcolor: alpha(componentColors.background, 0.4),
            p: { xs: '2vw 1vw', md: '3vw 2vw' },
            boxSizing: 'border-box',
            gap: { xs: '1.5rem', md: '2vw' },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            position: 'relative'
          }}
        >
          <Tooltip 
            title="Logout" 
            placement="right"
            TransitionComponent={Zoom}
            arrow
          >
            <Box
              sx={{ 
                position: 'fixed',
                left: { xs: '20px', md: '30px' },
                bottom: { xs: '20px', md: '30px' },
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: theme.palette.error.main,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
                zIndex: 1000,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 14px rgba(0, 0, 0, 0.3)'
                }
              }}
              onClick={handleLogout}
            >
              <LogoutIcon fontSize="medium" />
            </Box>
          </Tooltip>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: '1.5rem', md: '2rem' },
            position: 'relative',
            width: { xs: '100%', md: '340px' },
            minWidth: { xs: '0', md: '240px' },
            flexShrink: 0,
          }}>
            <Card
              sx={{ 
                flex: { xs: 'none', md: '1 0 auto' },
                maxWidth: { xs: '100%', md: '340px' },
                minWidth: { xs: '0', md: '240px' },
                borderRadius: '18px',
                boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)',
                p: '1.2rem 1.5rem 1.2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                justifyContent: 'flex-start',
                boxSizing: 'border-box',
                overflow: 'hidden',
                height: { xs: 'auto', md: 'auto' },
                mb: { xs: '5rem', md: '5rem' },
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(9,19,38,0.03) 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 32px 0 rgba(80,86,96,0.18)'
                }
              }}
            >
              <Box 
                sx={{
                  position: 'relative',
                  mt: '3rem',
                  mb: '0.5rem',
                  zIndex: 1
                }}
              >
                <Box 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '16px', 
                    bgcolor: alpha(componentColors.buttonBackground, 0.08),
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: '1.5rem',
                    boxShadow: '0 4px 12px rgba(9,19,38,0.06)',
                    border: '1px solid',
                    borderColor: alpha(componentColors.buttonBackground, 0.15),
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 28, color: componentColors.buttonBackground }} />
                </Box>

                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    mb: '0.4em',
                    color: componentColors.headerColor,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      bottom: '-0.1em',
                      width: '6em',
                      height: '0.07em',
                      borderRadius: '1px',
                      background: `linear-gradient(90deg, ${alpha(componentColors.buttonBackground, 0.8)} 0%, ${alpha(componentColors.buttonBackground, 0.3)} 100%)`
                    }
                  }}
                >
                  Admin Panel
                </Typography>
                
                <Typography 
                  sx={{
                    color: componentColors.labelColor,
                    fontSize: '1.1rem',
                    maxWidth: '90%',
                    lineHeight: 1.4,
                    mb: 2.5
                  }}
                >
                  Manage users and monitor system health
                </Typography>
              </Box>
              
              {/* Decorative elements */} 
              <Box
                sx={{
                  position: 'absolute',
                  width: '180px',
                  height: '180px',
                  borderRadius: '16px',
                  transform: 'rotate(45deg)',
                  background: `linear-gradient(135deg, ${alpha(componentColors.buttonBackground, 0.04)} 0%, rgba(255,255,255,0) 70%)`,
                  bottom: '-90px',
                  right: '-50px',
                  zIndex: 0
                }}
              />
              
              {/* Date and time information moved down */}
                <Box sx={{
                    position: 'relative',
                    zIndex: 1,
                    // mt: 'auto',
                    pt: 2,
                  }}>
                <Box sx={{ 
                  p: 1.5,
                  bgcolor: alpha(componentColors.buttonBackground, 0.03),
                  borderRadius: '12px',
                  border: `1px solid ${alpha(componentColors.buttonBackground, 0.05)}`
                  }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarIcon sx={{ fontSize: 18, color: alpha(componentColors.buttonBackground, 0.7) }} />
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: componentColors.headerColor }}>
                    {lastLoginTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: alpha(componentColors.buttonBackground, 0.7) }} />
                    <Typography sx={{ fontSize: '0.95rem', color: alpha(componentColors.labelColor, 0.9) }}>
                      Current Session Time: {sessionDuration}
                    </Typography>
                  </Box>
                  
                  {pendingCount > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <PendingIcon sx={{ fontSize: 18, color: '#ff9800' }} />
                      <Typography sx={{ 
                        fontSize: '0.95rem', 
                        color: '#ff9800',
                        fontWeight: 500
                      }}>
                        {pendingCount} pending account{pendingCount !== 1 ? 's' : ''} to review
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  transform: 'rotate(35deg)',
                  background: alpha(componentColors.buttonBackground, 0.12),
                  top: '22%',
                  right: '18%',
                  zIndex: 0
                }}
              />
              
              <Box
                sx={{
                  position: 'absolute',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: alpha(componentColors.buttonBackground, 0.15),
                  top: '38%',
                  right: '25%',
                  zIndex: 0
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  width: '85px',
                  height: '85px',
                  borderRadius: '12px',
                  border: `1.5px dashed ${alpha(componentColors.buttonBackground, 0.08)}`,
                  transform: 'rotate(-12deg)',
                  top: '15px',
                  right: '20px',
                  zIndex: 0
                }}
              />
              





              
              {/* <Box
                sx={{
                  position: 'absolute',
                  width: '40px',
                  height: '3px',
                  background: alpha(componentColors.buttonBackground, 0.06),
                  bottom: '25%',
                  left: '10%',
                  borderRadius: '4px',
                  zIndex: 0
                }}
              /> */}

  
            </Card>
          </Box>
          
          <Box 
            sx={{ 
              flex: '1 1 0',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '1.5rem', md: '2vw' },
              minWidth: 0
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: '0.75rem', md: '1vw' },
                height: { xs: 'auto', md: '70%' }
              }}
            >
              <Card
                sx={{ 
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)',
                  p: '1.3rem 1.5rem',
                  minHeight: '90px',
                  position: 'relative',
                  flex: { xs: 'auto', md: '0 0 auto' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  height: { xs: 'auto', md: 'auto' },
                  boxSizing: 'border-box',
                  mb: '0.5rem'
                }}
              >
                <Typography
                  className="card-label"
                  sx={{
                    display: 'block',
                    fontWeight: 600,
                    color: componentColors.headerColor,
                    mb: '0.8rem'
                  }}
                >
                  User Management
                </Typography>
                
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1em'
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      flexGrow: 1,
                      maxWidth: '1000px',
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: componentColors.searchBackground,
                      borderRadius: '2em',
                      p: '0.4em 1em',
                      border: `1px solid ${componentColors.searchBorder}`,
                      boxSizing: 'border-box',
                      height: '2.4em'
                    }}
                  >
                    <SearchIcon sx={{ width: '1.2em', height: '1.2em', color: '#8a9198', mr: '0.5em' }} />
                    <InputBase
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        border: 'none',
                        bgcolor: 'transparent',
                        outline: 'none',
                        fontSize: '1rem',
                        width: '100%',
                        p: '0.3em 0.5em',
                        color: '#222',
                        height: '1.6em'
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: componentColors.buttonBackground,
                      color: componentColors.buttonColor,
                      borderRadius: '2em',
                      padding: '0.4em 1.2em',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px 0 rgba(9,19,38,0.08)',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: alpha(componentColors.buttonBackground, 0.9)
                      }
                    }}
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddUserClick}
                  >
                    Add User
                  </Button>
                </Box>
              </Card>
              
              <Card
                sx={{ 
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)',
                  p: '1rem 1.5rem 1.5rem 1.5rem',
                  minHeight: 0,
                  position: 'relative',
                  flex: '1 1 0',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >              
                <Box 
                  sx={{ 
                    mt: '0.5em',
                    overflowY: 'auto',
                    flex: '1 1 0',
                    maxHeight: '420px',
                    pr: '0.5em',
                  }}
                >
                  <UserManagement searchTerm={searchTerm} />
                </Box>
              </Card>
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex',
                gap: { xs: '1.5rem', md: '2vw' },
                height: { xs: 'auto', md: '30%' },
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: { xs: 'auto', md: '200px' }
              }}
            >
              <Card
                sx={{ 
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)',
                  p: '1.5rem 1.5rem',
                  flex: '1 1 0',
                  minWidth: 0,
                  minHeight: 0,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  justifyContent: 'flex-start'
                }}
              >
                <Typography
                  className="card-label"
                  sx={{
                    display: 'block',
                    fontWeight: 600,
                    color: componentColors.headerColor,
                    mb: '0.7rem'
                  }}
                >
                  System Status
                </Typography>
                
                <Box 
                  sx={{ 
                    flex: '1 1 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    width: '100%'
                  }}
                >
                  <SystemStatusCards />
                </Box>
              </Card>
              
              <Card
                sx={{ 
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)',
                  p: '1.5rem 1.5rem',
                  flex: '1 1 0',
                  minWidth: 0,
                  minHeight: 0,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  justifyContent: 'flex-start'
                }}
              >
                <Typography
                  className="card-label"
                  sx={{
                    display: 'block',
                    fontWeight: 600,
                    color: componentColors.headerColor,
                    mb: '0.7rem'
                  }}
                >
                  User Statistics
                </Typography>
                
                <Box 
                  sx={{ 
                    flex: '1 1 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    width: '100%'
                  }}
                >
                  <UserDataContext.Consumer>
                    {({ totalUsers, activeUsers }) => (
                      isLoadingPending ? (
                        <LinearProgress sx={{ width: '100%', mb: 2 }} />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 2
                          }}>
                            <Box>
                              <Typography 
                                sx={{ 
                                  fontSize: '1.75rem',
                                  fontWeight: 700,
                                  color: componentColors.headerColor,
                                  lineHeight: 1.2,
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                {totalUsers || 0} users
                                <Chip
                                  icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                                  label={`${activeUsers || 0} active`}
                                  size="small"
                                  sx={{ 
                                    height: '24px',
                                    bgcolor: theme.palette.admin.successBg, // Using theme color instead of hardcoded '#ade8b0'
                                    color: '#fff',
                                    '& .MuiChip-label': { 
                                      px: 1,
                                      fontSize: '0.85rem',
                                      fontWeight: 600
                                    },
                                    '& .MuiChip-icon': {
                                      color: '#fff'
                                    }
                                  }}
                                />
                              </Typography>
                            </Box>
                            
                            <Button
                              variant="contained"
                              startIcon={<PendingIcon />}
                              onClick={handlePendingAccountsClick}
                              size="small"
                              sx={{
                                bgcolor: componentColors.buttonBackground,
                                color: componentColors.buttonColor,
                                borderRadius: '2em',
                                padding: '0.4em 1.2em',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px 0 rgba(9,19,38,0.08)',
                                minWidth: 'auto',
                                alignSelf: 'flex-start',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                  bgcolor: alpha(componentColors.buttonBackground, 0.9)
                                }
                              }}
                            >
                              Pending Accounts
                            </Button>
                          </Box>
                          
                          {pendingCount > 0 && (
                            <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #e5eaf1' }}>
                              <Typography 
                                sx={{ 
                                  color: '#ff9800', 
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <PendingIcon sx={{ fontSize: 16 }} />
                                {pendingCount} pending approval
                              </Typography>
                            </Box>
                          )}
                          
                          {pendingError && (
                            <Typography 
                              sx={{ 
                                color: '#e53935', 
                                fontSize: '0.8rem',
                                fontStyle: 'italic',
                                mt: pendingCount > 0 ? 1 : 'auto',
                                pt: pendingCount > 0 ? 0 : 1.5,
                                borderTop: pendingCount > 0 ? 'none' : '1px solid #e5eaf1'
                              }}
                            >
                              {pendingError}
                            </Typography>
                          )}
                        </Box>
                      )
                    )}
                  </UserDataContext.Consumer>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
        
        <Dialog
          open={pendingDialogOpen}
          onClose={handleClosePendingDialog}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '18px',
              maxHeight: '80vh',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: componentColors.buttonBackground,
            color: componentColors.buttonColor,
            px: 3,
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PendingIcon />
              <Typography variant="h6">Pending Account Requests</Typography>
            </Box>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleClosePendingDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <PendingAccounts onAccountApproved={handleClosePendingDialog} />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(componentColors.labelColor, 0.1)}` }}>
            <Button 
              onClick={handleClosePendingDialog}
              variant="outlined"
              sx={{ 
                color: componentColors.buttonBackground,
                borderColor: componentColors.buttonBackground,
                '&:hover': {
                  borderColor: componentColors.buttonBackground,
                  bgcolor: alpha(componentColors.buttonBackground, 0.05)
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={addUserDialogOpen}
          onClose={handleCloseAddUserDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '18px',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: componentColors.buttonBackground,
            color: componentColors.buttonColor,
            px: 3,
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon />
              <Typography variant="h6">Add New User</Typography>
            </Box>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleCloseAddUserDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                fullWidth
              />
              <TextField
                label="Company"
                value={newUser.company}
                onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                fullWidth
              />
              {/* Role selection commented out
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <FormHelperText>Select the role for the new user</FormHelperText>
              </FormControl>
              */}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(componentColors.labelColor, 0.1)}` }}>
            <Button 
              onClick={handleCloseAddUserDialog}
              variant="outlined"
              sx={{ 
                color: componentColors.buttonBackground,
                borderColor: componentColors.buttonBackground,
                '&:hover': {
                  borderColor: componentColors.buttonBackground,
                  bgcolor: alpha(componentColors.buttonBackground, 0.05)
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUserSubmit}
              variant="contained"
              disabled={isSubmitting}
              sx={{ 
                bgcolor: componentColors.buttonBackground,
                color: componentColors.buttonColor,
                '&:hover': {
                  bgcolor: alpha(componentColors.buttonBackground, 0.9)
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Add User'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </UserDataProvider>
    </RequireAdminAuth>
  );
};

const SystemStatusCards = () => {
  const [statusData, setStatusData] = useState({
    status: "loading",
    database: "loading",
    storage: "loading",
    processors: {
      transcription: "loading",
      analysis: "loading"
    },
    uptime: "loading",
    version: "loading"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setIsLoading(true);
        const response = await AdminService.getSystemStatus();
        setStatusData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching system status:", err);
        setError("Failed to fetch system status information");
        setStatusData({
          status: "error",
          database: "unknown",
          storage: "unknown",
          processors: {
            transcription: "unknown",
            analysis: "unknown"
          },
          uptime: "unknown",
          version: "unknown"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemStatus();
    
    const intervalId = setInterval(fetchSystemStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatUptime = (uptimeString) => {
    if (!uptimeString || uptimeString === "unknown" || uptimeString === "loading") {
      return "Unknown";
    }
    
    try {
      if (!isNaN(uptimeString)) {
        const uptime = parseInt(uptimeString);
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        if (days > 0) {
          return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${minutes}m`;
        }
      }
      
      return uptimeString;
    } catch (e) {
      return uptimeString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#757575';
    
    switch(status.toLowerCase()) {
      case 'online':
      case 'operational':
      case 'connected':
      case 'ok':
      case 'available':
        return '#43a047';
      case 'warning':
      case 'degraded':
        return '#ff9800';
      case 'offline':
      case 'error':
      case 'unavailable':
        return '#e53935';
      case 'unknown':
        return '#757575';
      case 'loading':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'online':
      case 'operational':
      case 'connected':
      case 'ok':
      case 'available':
        return <CheckCircleIcon sx={{ color: '#a0efa5', fontSize: 18 }} />;
      case 'warning':
      case 'degraded':
        return <WarningIcon sx={{ color: '#efd0a1', fontSize: 18 }} />;
      case 'offline':
      case 'error':
      case 'unavailable':
        return <ErrorIcon sx={{ color: '#e3a5a4', fontSize: 18 }} />;
      default:
        return <InfoIcon sx={{ color: '#757575', fontSize: 18 }} />;
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isLoading ? (
        <LinearProgress sx={{ mb: 2, width: '100%' }} />
      ) : (
        <>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {/* Database Status */}
            <Grid item xs={6}>
              <Box sx={{ 
                p: 1.2,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: alpha(getStatusColor(statusData.database), 0.2),
                bgcolor: alpha(getStatusColor(statusData.database), 0.05),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Typography sx={{ 
                  color: componentColors.labelColor, 
                  fontSize: '0.8rem',
                  mb: 0.5
                }}>
                  Database
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(statusData.database)}
                  <Typography sx={{ 
                    color: getStatusColor(statusData.database), 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    ml: 0.5
                  }}>
                    {statusData.database?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Storage Status */}
            <Grid item xs={6}>
              <Box sx={{ 
                p: 1.2,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: alpha(getStatusColor(statusData.storage), 0.2),
                bgcolor: alpha(getStatusColor(statusData.storage), 0.05),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Typography sx={{ 
                  color: componentColors.labelColor, 
                  fontSize: '0.8rem',
                  mb: 0.5
                }}>
                  Storage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(statusData.storage)}
                  <Typography sx={{ 
                    color: getStatusColor(statusData.storage), 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    ml: 0.5
                  }}>
                    {statusData.storage?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Transcription Status */}
            <Grid item xs={6}>
              <Box sx={{ 
                p: 1.2,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: alpha(getStatusColor(statusData.processors?.transcription), 0.2),
                bgcolor: alpha(getStatusColor(statusData.processors?.transcription), 0.05),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Typography sx={{ 
                  color: componentColors.labelColor, 
                  fontSize: '0.8rem',
                  mb: 0.5
                }}>
                  Transcription
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(statusData.processors?.transcription)}
                  <Typography sx={{ 
                    color: getStatusColor(statusData.processors?.transcription), 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    ml: 0.5
                  }}>
                    {statusData.processors?.transcription?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Analysis Status */}
            <Grid item xs={6}>
              <Box sx={{ 
                p: 1.2,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: alpha(getStatusColor(statusData.processors?.analysis), 0.2),
                bgcolor: alpha(getStatusColor(statusData.processors?.analysis), 0.05),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Typography sx={{ 
                  color: componentColors.labelColor, 
                  fontSize: '0.8rem',
                  mb: 0.5
                }}>
                  Analysis
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(statusData.processors?.analysis)}
                  <Typography sx={{ 
                    color: getStatusColor(statusData.processors?.analysis), 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    ml: 0.5
                  }}>
                    {statusData.processors?.analysis?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 1.5,
            borderTop: `1px solid ${alpha(componentColors.labelColor, 0.15)}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ color: componentColors.labelColor, fontSize: 16, mr: 0.5 }} />
              <Typography sx={{ color: componentColors.labelColor, fontSize: '0.85rem' }}>
                Uptime: <span style={{ fontWeight: 500 }}>{formatUptime(statusData.uptime)}</span>
              </Typography>
            </Box>
            
            <Button
              size="small"
              variant="contained"
              sx={{
                bgcolor: componentColors.buttonBackground,
                color: componentColors.buttonColor,
                borderRadius: '2em',
                padding: '0.4em 1.2em',
                fontSize: '0.8rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px 0 rgba(9,19,38,0.08)',
                minWidth: 'auto',
                '&:hover': {
                  bgcolor: alpha(componentColors.buttonBackground, 0.9)
                }
              }}
              onClick={() => window.open('/admin/system-status', '_blank')}
            >
              Details
            </Button>
          </Box>
          
          {error && (
            <Typography 
              sx={{ 
                color: '#e53935', 
                mt: 2, 
                fontSize: '0.85rem',
                fontStyle: 'italic'
              }}
            >
              {error}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default AdminPanel;