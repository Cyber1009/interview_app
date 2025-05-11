import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  LinearProgress,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Alert,
  useTheme
} from '@mui/material';
import { 
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import AdminService from '../../services/adminService';

/**
 * Admin Dashboard Component
 * 
 * A modern, data-rich admin dashboard with:
 * - Key metrics visualization
 * - System status indicators
 * - Recent activity feed
 * - Resource utilization graphs
 */
const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingAccounts: 0,
    systemHealth: 'healthy'
  });
  
  // Recent activity data
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch system status
        const status = await AdminService.getSystemStatus();
        setSystemStatus(status);
        
        // Simulate fetching other data
        // In a real app, this would come from API calls
        setStats({
          totalUsers: 186,
          activeSubscriptions: 142,
          pendingAccounts: 3,
          systemHealth: status?.status || 'unknown'
        });
        
        // Simulated recent activity
        setRecentActivity([
          { 
            id: 1, 
            type: 'new_user', 
            description: 'New user registered', 
            userName: 'John Doe', 
            time: '10 minutes ago' 
          },
          { 
            id: 2, 
            type: 'subscription', 
            description: 'Premium subscription purchased', 
            userName: 'Emily Johnson', 
            time: '2 hours ago' 
          },
          { 
            id: 3, 
            type: 'system', 
            description: 'System backup completed', 
            time: '4 hours ago' 
          },
          { 
            id: 4, 
            type: 'warning', 
            description: 'High memory usage detected', 
            time: 'Yesterday' 
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Prepare data for components
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'operational':
        return 'success';
      case 'degraded':
      case 'warning':
        return 'warning';
      case 'offline':
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of system performance, user statistics, and recent activity
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                boxShadow: theme.shadows[2],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.totalUsers}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 18, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +12% from last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Active Subscriptions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                boxShadow: theme.shadows[2],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Active Subscriptions
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.activeSubscriptions}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 18, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +5% from last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: 'success.main',
                    width: 48,
                    height: 48
                  }}
                >
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pending Accounts */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                boxShadow: theme.shadows[2],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Pending Accounts
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.pendingAccounts}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowDownwardIcon sx={{ fontSize: 18, color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="caption" color="warning.main">
                      Requires attention
                    </Typography>
                  </Box>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: 'warning.main',
                    width: 48,
                    height: 48
                  }}
                >
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* System Health */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                boxShadow: theme.shadows[2],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    System Status
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.systemHealth === 'healthy' ? 'Healthy' : 'Attention'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      size="small"
                      color={getStatusColor(stats.systemHealth)}
                      label={stats.systemHealth}
                    />
                  </Box>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: getStatusColor(stats.systemHealth) + '.main',
                    width: 48,
                    height: 48
                  }}
                >
                  {stats.systemHealth === 'healthy' ? 
                    <CheckCircleIcon /> : <WarningIcon />
                  }
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resource Utilization */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  System Resources
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {/* CPU Usage */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    CPU Usage
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    62%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={62} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 5,
                    bgcolor: 'rgba(0,0,0,0.09)' 
                  }} 
                />
              </Box>
              
              {/* Memory Usage */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Memory Usage
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    45%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={45}
                  color="success"
                  sx={{ 
                    height: 6, 
                    borderRadius: 5,
                    bgcolor: 'rgba(0,0,0,0.09)' 
                  }}
                />
              </Box>
              
              {/* Storage Usage */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Storage Usage
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    78%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={78}
                  color="warning"
                  sx={{ 
                    height: 6, 
                    borderRadius: 5,
                    bgcolor: 'rgba(0,0,0,0.09)'
                  }}
                />
              </Box>
              
              {/* Network Traffic */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Network Traffic
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    28%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={28}
                  color="info"
                  sx={{ 
                    height: 6, 
                    borderRadius: 5,
                    bgcolor: 'rgba(0,0,0,0.09)'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Recent Activity
                </Typography>
                <Button size="small">View All</Button>
              </Box>
              
              <List sx={{ px: 0 }}>
                {recentActivity.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem 
                      disablePadding 
                      sx={{ 
                        py: 1.5,
                        px: 0
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: activity.type === 'warning' ? 'warning.main' : 
                                  activity.type === 'system' ? 'info.main' :
                                  activity.type === 'new_user' ? 'primary.main' : 'success.main'
                        }}
                      >
                        {activity.type === 'warning' ? <WarningIcon /> : 
                         activity.type === 'system' ? <AssessmentIcon /> :
                         activity.type === 'new_user' ? <PeopleIcon /> : <TrendingUpIcon />}
                      </Avatar>
                      <ListItemText 
                        primary={activity.description}
                        secondary={
                          <>
                            {activity.userName && (
                              <Typography component="span" variant="body2" color="text.primary">
                                {activity.userName} • 
                              </Typography>
                            )}
                            {" "}
                            <Typography component="span" variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ my: 0.5 }} />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System component statuses */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card 
            elevation={0}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ mb: 3 }}>
                System Component Status
              </Typography>
              
              <Grid container spacing={2}>
                {systemStatus && systemStatus.components ? (
                  Object.entries(systemStatus.components).map(([name, status], index) => {
                    const statusColor = typeof status === 'string' ? 
                      getStatusColor(status) : 
                      getStatusColor(status.status || 'unknown');
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box 
                          sx={{ 
                            p: 2, 
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <Typography variant="body2" textTransform="capitalize">
                              {name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {typeof status === 'string' ? status : JSON.stringify(status)}
                            </Typography>
                          </Box>
                          <Chip 
                            size="small"
                            color={statusColor}
                            label={typeof status === 'string' ? status : status.status || 'unknown'} 
                          />
                        </Box>
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No system component status information available.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;