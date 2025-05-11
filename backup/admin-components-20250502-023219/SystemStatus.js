import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, Grid,
  CircularProgress, Alert, Divider, alpha, Tooltip,
  ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText,
  ListItemIcon, Button, Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { adminAPI } from '../../services/api';

/**
 * SystemStatus Component
 * 
 * Admin component for monitoring system health and performance.
 * This aligns with the MonitoringMetricsResponse schema from the backend.
 * 
 * Features:
 * - System health indicators
 * - Resource utilization charts
 * - API usage metrics
 * - Error rate monitoring
 */
const SystemStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchSystemStatus();
  }, [timeRange]);

  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the admin API
      // const response = await adminAPI.getSystemStatus(timeRange);
      // setMetrics(response.data);
      
      // Simulate API call for demo with mock data
      setTimeout(() => {
        setMetrics({
          status: 'healthy',
          uptime: 259200, // 3 days in seconds
          serverTime: new Date().toISOString(),
          services: {
            database: { status: 'healthy', responseTime: 15 },
            storage: { status: 'healthy', responseTime: 28 },
            authentication: { status: 'healthy', responseTime: 45 },
            analytics: { status: 'degraded', responseTime: 350 }
          },
          resources: {
            cpu: 42,
            memory: 68,
            disk: 37,
            network: 25
          },
          apiUsage: {
            totalRequests: 15482,
            averageResponseTime: 120,
            errorRate: 0.8,
            requestsByEndpoint: {
              '/auth': 3254,
              '/interviews': 8745,
              '/recordings': 2103,
              '/admin': 1380
            }
          },
          userMetrics: {
            totalUsers: 548,
            activeToday: 127,
            activeSessions: 18
          },
          errorLogs: [
            {
              timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
              level: 'ERROR',
              service: 'analytics',
              message: 'Connection timeout after 5000ms'
            },
            {
              timestamp: new Date(Date.now() - 145 * 60000).toISOString(),
              level: 'WARNING',
              service: 'storage',
              message: 'High latency detected (350ms)'
            },
            {
              timestamp: new Date(Date.now() - 210 * 60000).toISOString(),
              level: 'ERROR',
              service: 'database',
              message: 'Query execution timeout for user_sessions'
            }
          ],
          charts: {
            responseTimeHistory: [
              { time: '00:00', value: 95 },
              { time: '03:00', value: 102 },
              { time: '06:00', value: 118 },
              { time: '09:00', value: 135 },
              { time: '12:00', value: 142 },
              { time: '15:00', value: 125 },
              { time: '18:00', value: 115 },
              { time: '21:00', value: 108 },
              { time: 'Now', value: 120 }
            ],
            requestsHistory: [
              { time: '00:00', value: 423 },
              { time: '03:00', value: 297 },
              { time: '06:00', value: 178 },
              { time: '09:00', value: 895 },
              { time: '12:00', value: 1245 },
              { time: '15:00', value: 1102 },
              { time: '18:00', value: 865 },
              { time: '21:00', value: 654 },
              { time: 'Now', value: 432 }
            ]
          }
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setError('Failed to load system status data. Please try again.');
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'degraded':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'down':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'ERROR':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'WARNING':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'INFO':
        return <CheckCircleIcon sx={{ color: 'info.main' }} />;
      default:
        return <CheckCircleIcon sx={{ color: 'info.main' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSystemStatus}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '0.01em',
          color: 'text.primary'
        }}>
          System Status
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="6h">6h</ToggleButton>
            <ToggleButton value="24h">24h</ToggleButton>
            <ToggleButton value="7d">7d</ToggleButton>
            <ToggleButton value="30d">30d</ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchSystemStatus}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {/* System Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getStatusIcon(metrics.status)}
                <Typography variant="h5" sx={{ ml: 1, fontWeight: 600 }}>
                  {metrics.status === 'healthy' ? 'Healthy' : 
                   metrics.status === 'degraded' ? 'Degraded' : 'Down'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                As of {new Date(metrics.serverTime).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                System Uptime
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {formatUptime(metrics.uptime)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Since last restart
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                API Requests (24h)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {metrics.apiUsage.totalRequests.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Avg Response: {metrics.apiUsage.averageResponseTime}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {metrics.userMetrics.activeToday}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {metrics.userMetrics.activeSessions} active sessions now
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Service Health */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="Service Health"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {Object.entries(metrics.services).map(([service, data]) => (
                  <Grid item xs={12} sm={6} key={service}>
                    <Paper 
                      variant="outlined" 
                      sx={{ p: 2, borderRadius: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {service}
                        </Typography>
                        {getStatusIcon(data.status)}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Response: {data.responseTime}ms
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Resource Utilization */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="Resource Utilization"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <BarChart
                height={220}
                series={[
                  {
                    data: [
                      metrics.resources.cpu,
                      metrics.resources.memory,
                      metrics.resources.disk,
                      metrics.resources.network
                    ],
                    label: 'Utilization %',
                    color: (theme) => theme.palette.primary.main,
                  }
                ]}
                xAxis={[
                  {
                    data: ['CPU', 'Memory', 'Disk', 'Network'],
                    scaleType: 'band',
                  }
                ]}
                yAxis={[
                  {
                    max: 100,
                  }
                ]}
                layout="horizontal"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* API Usage Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="API Usage & Performance"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    Request Volume
                  </Typography>
                  <LineChart
                    height={250}
                    series={[
                      {
                        data: metrics.charts.requestsHistory.map(item => item.value),
                        label: 'API Requests',
                        area: true,
                        showMark: false,
                        color: (theme) => theme.palette.primary.main,
                      }
                    ]}
                    xAxis={[
                      {
                        data: metrics.charts.requestsHistory.map(item => item.time),
                        scaleType: 'point',
                      }
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Requests by Endpoint
                  </Typography>
                  <List dense>
                    {Object.entries(metrics.apiUsage.requestsByEndpoint).map(([endpoint, count]) => (
                      <ListItem key={endpoint} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={endpoint} 
                          secondary={`${count.toLocaleString()} requests`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Error Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 600, 
                          color: metrics.apiUsage.errorRate < 1 ? 'success.main' : 'error.main'
                        }}
                      >
                        {metrics.apiUsage.errorRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        of all requests
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Error Logs */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <CardHeader 
              title="Recent Error Logs"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'text.primary'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <List>
                {metrics.errorLogs.map((log, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <Divider component="li" sx={{ my: 1 }} />
                    )}
                    <ListItem sx={{ px: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getLogIcon(log.level)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight={500}>
                              {log.service}
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                              {new Date(log.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={log.message}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="text" size="small">
                  View All Logs
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemStatus;