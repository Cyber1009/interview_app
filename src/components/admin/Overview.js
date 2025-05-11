import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Stack,
  Paper,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  OpenInNew as OpenInNewIcon,
  Circle as CircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';

// Chart placeholder components - in a real app, you'd use a library like recharts
const LineChartPlaceholder = ({ height = 120 }) => (
  <Box
    sx={{
      height,
      width: '100%',
      bgcolor: 'background.default',
      borderRadius: 1,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* Simulated line chart with gradient */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.7,
        background: 'linear-gradient(180deg, rgba(63, 81, 181, 0.2) 0%, rgba(63, 81, 181, 0) 100%)',
        clipPath: 'polygon(0 70%, 10% 60%, 20% 65%, 30% 50%, 40% 60%, 50% 40%, 60% 50%, 70% 30%, 80% 40%, 90% 20%, 100% 30%, 100% 100%, 0 100%)'
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          clipPath: 'polygon(0 70%, 10% 60%, 20% 65%, 30% 50%, 40% 60%, 50% 40%, 60% 50%, 70% 30%, 80% 40%, 90% 20%, 100% 30%)'
        }
      }}
    />
  </Box>
);

/**
 * Admin Overview/Dashboard Component
 * 
 * A modern dashboard with:
 * - Key stats and metrics
 * - System health indicators
 * - Recent activity
 * - Quick actions
 */
const Overview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingAccounts: 0,
    systemStatus: 'operational',
    cpuUsage: 12,
    memoryUsage: 45,
    diskUsage: 28,
    lastChecked: new Date().toISOString()
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch system status
        const systemStatus = await adminService.getSystemStatus();
        
        // Fetch users
        const users = await adminService.getAllUsers();
        const activeUsers = users.filter(user => 
          user.is_active && user.subscription_status === 'active'
        );
        
        // Fetch pending accounts
        const pendingAccounts = await adminService.getPendingAccounts();
        
        setStats({
          totalUsers: users.length || 0,
          activeUsers: activeUsers.length || 0,
          pendingAccounts: pendingAccounts.accounts?.length || 0,
          systemStatus: systemStatus?.status || 'unknown',
          cpuUsage: Math.round(Math.random() * 30) + 10, // Simulated values for demo
          memoryUsage: Math.round(Math.random() * 40) + 20,
          diskUsage: Math.round(Math.random() * 20) + 20,
          lastChecked: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Define stat cards
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.primary.main,
      onClick: () => navigate('/admin/user-management'),
      change: '+3.2%',
      changePositive: true
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <AssignmentIcon fontSize="large" />,
      color: theme.palette.success.main,
      onClick: () => navigate('/admin/user-management?status=active'),
      change: '+5.1%',
      changePositive: true
    },
    {
      title: 'Pending Accounts',
      value: stats.pendingAccounts,
      icon: <PersonAddIcon fontSize="large" />,
      color: theme.palette.warning.main,
      onClick: () => navigate('/admin/pending-accounts'),
      change: '-12%',
      changePositive: false
    },
    {
      title: 'System Health',
      value: stats.systemStatus === 'operational' ? 'Good' : 'Check',
      icon: <SpeedIcon fontSize="large" />,
      color: stats.systemStatus === 'operational' 
        ? theme.palette.success.main 
        : theme.palette.warning.main,
      onClick: () => navigate('/admin/system-status'),
      change: stats.systemStatus === 'operational' ? 'All systems operational' : 'Issues detected',
      changePositive: stats.systemStatus === 'operational'
    }
  ];

  // Simulated recent users (would come from API)
  const recentUsers = [
    { id: 1, username: 'jane_smith', company: 'Acme Inc.', status: 'active', time: '2 hours ago' },
    { id: 2, username: 'john_doe', company: 'TechCorp', status: 'pending', time: '5 hours ago' },
    { id: 3, username: 'alex_wilson', company: 'StartupX', status: 'active', time: '1 day ago' },
  ];

  // System resource utilization
  const resources = [
    { name: 'CPU', usage: stats.cpuUsage, icon: <MemoryIcon />, color: theme.palette.info.main },
    { name: 'Memory', usage: stats.memoryUsage, icon: <StorageIcon />, color: theme.palette.warning.main },
    { name: 'Disk', usage: stats.diskUsage, icon: <StorageIcon />, color: theme.palette.success.main }
  ];

  // Status indicators to show system health
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return theme.palette.success.main;
      case 'degraded':
        return theme.palette.warning.main;
      case 'offline':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of system status and user statistics
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/admin/user-management/create')}
          >
            Create User
          </Button>
        </Box>
      </Box>

      {/* Stat Cards Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                }
              }}
              onClick={card.onClick}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: card.color + '20', // 20% opacity
                      color: card.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: card.changePositive ? 'success.main' : 'warning.main',
                    mt: 1
                  }}
                >
                  {card.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        {/* System Resources */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  System Resources
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current resource utilization
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                {resources.map((resource) => (
                  <Box key={resource.name} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{ 
                            width: 24, 
                            height: 24,
                            mr: 1,
                            bgcolor: resource.color + '20', // 20% opacity
                            color: resource.color
                          }}
                        >
                          {resource.icon}
                        </Avatar>
                        <Typography variant="body2">{resource.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {resource.usage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={resource.usage} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: theme.palette.background.default,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: resource.color
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={() => navigate('/admin/system-status')}
                >
                  View Detailed Status
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Activity and User Registration Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    User Registration Trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New user signups over time
                  </Typography>
                </Box>
                <Box>
                  <Chip 
                    label="Last 30 days" 
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              {/* Placeholder for chart - would be replaced with actual chart component */}
              <Box sx={{ mt: 3, height: 250 }}>
                <LineChartPlaceholder height={250} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Users
                </Typography>
                <Button
                  size="small"
                  endIcon={<OpenInNewIcon />}
                  onClick={() => navigate('/admin/user-management')}
                >
                  View All
                </Button>
              </Box>
              
              <List>
                {recentUsers.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <ListItem 
                      alignItems="flex-start"
                      secondaryAction={
                        <Chip 
                          size="small"
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      }
                      sx={{ px: 0 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={600}>
                            {user.username}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span">
                              {user.company}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="div">
                              {user.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentUsers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                System Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip 
                    icon={
                      <CircleIcon 
                        sx={{ 
                          fontSize: '0.8rem !important',
                          color: getStatusColor(stats.systemStatus) + ' !important'
                        }} 
                      />
                    }
                    label={`Status: ${stats.systemStatus === 'operational' ? 'All Systems Operational' : 'Attention Required'}`}
                    variant="outlined"
                    sx={{ borderColor: getStatusColor(stats.systemStatus) }}
                  />
                  <Chip 
                    label={`Last Updated: ${new Date(stats.lastChecked).toLocaleTimeString()}`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>
              
              <Box>
                {['API Service', 'Database', 'Storage', 'Background Tasks'].map((service) => {
                  // Randomly assign status for demo - in real app would come from backend
                  const status = Math.random() > 0.85 ? 'degraded' : 'operational';
                  return (
                    <Paper 
                      key={service} 
                      elevation={0}
                      sx={{ 
                        p: 1.5,
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: theme.palette.background.default,
                        borderLeft: '3px solid',
                        borderColor: getStatusColor(status)
                      }}
                    >
                      <Typography variant="body2">
                        {service}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {status !== 'operational' && (
                          <Tooltip title="Attention required">
                            <WarningIcon 
                              color="warning"
                              fontSize="small"
                              sx={{ mr: 1, fontSize: 16 }}
                            />
                          </Tooltip>
                        )}
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: getStatusColor(status),
                            fontWeight: 500
                          }}
                        >
                          {status === 'operational' ? 'Operational' : 'Degraded'}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
              
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={() => navigate('/admin/system-status')}
                >
                  View Full System Status
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;