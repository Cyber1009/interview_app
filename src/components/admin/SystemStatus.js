import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  LinearProgress,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  CloudDone as CloudIcon,
  Description as LogIcon,
  Code as CodeIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';
import AdminService from '../../services/adminService';
import { colors, statusColors, componentColors } from '../../styles';

/**
 * SystemStatus Component
 * 
 * A modern system health dashboard showing:
 * - Individual service status cards
 * - Overall health indicators
 * - Maintenance options
 */
const SystemStatus = ({ isCard = false }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    status: 'unknown',
    database: 'unknown',
    storage: 'unknown',
    processors: {
      transcription: 'unknown',
      analysis: 'unknown'
    },
    uptime: '0 seconds',
    version: '0.0.0',
    lastUpdated: new Date().toISOString()
  });
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch system status on load
  useEffect(() => {
    fetchSystemStatus();
  }, []);
  
  // Function to fetch system status data
  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      // Get system status from backend
      const response = await AdminService.getSystemStatus();
      
      // If we got a valid response, update state with the new format
      if (response) {
        setSystemStats({
          status: response.status || 'unknown',
          database: response.database || 'unknown',
          storage: response.storage || 'unknown',
          processors: response.processors || {
            transcription: 'unknown',
            analysis: 'unknown'
          },
          uptime: response.uptime || '0 seconds',
          version: response.version || '0.0.0',
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      // Set some fallback data if API call fails
      setSystemStats({
        status: 'degraded',
        database: 'unknown',
        storage: 'unknown',
        processors: {
          transcription: 'unknown',
          analysis: 'unknown'
        },
        uptime: '0 seconds',
        version: '0.0.0',
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSystemStatus();
    setRefreshing(false);
  };

  // Run maintenance task
  const handleRunMaintenance = async () => {
    try {
      await AdminService.fixInvalidQuestions();
      alert('Maintenance task completed successfully');
    } catch (error) {
      console.error('Failed to run maintenance task:', error);
      alert('Maintenance task failed. See console for details.');
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return 'Unknown';
    }
  };
  
  // Get styled chip for status
  const getStatusChip = (status) => {
    let color, icon, label;
    
    switch (status) {
      case 'online':
      case 'operational':
      case 'connected':
      case 'available':
        color = 'success';
        icon = <CheckCircleIcon fontSize="small" />;
        label = 'Operational';
        break;
      case 'degraded':
      case 'warning':
        color = 'warning';
        icon = <WarningIcon fontSize="small" />;
        label = 'Degraded';
        break;
      case 'offline':
        color = 'error';
        icon = <ErrorIcon fontSize="small" />;
        label = 'Offline';
        break;
      default:
        color = 'info';
        icon = <InfoIcon fontSize="small" />;
        label = status || 'Unknown';
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
        sx={{ 
          fontWeight: 500,
          borderRadius: '16px',
          height: 24,
          '& .MuiChip-icon': { 
            fontSize: '0.875rem',
            marginLeft: '6px'
          }
        }}
      />
    );
  };

  // Card view with multiple small cards
  if (isCard) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2,
        bgcolor: 'transparent'
      }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        {/* Header with refresh button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 1.5
        }}>
          <Box>
            <Typography 
              variant="body2" 
              color={componentColors.labelColor}
              fontSize="0.75rem"
            >
              Last updated: {formatTimestamp(systemStats.lastUpdated)}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ display: 'block', mt: 0.5 }}
              color={componentColors.headerColor}
            >
              Version: {systemStats.version}
            </Typography>
          </Box>
          
          <Tooltip title="Refresh">
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              size="small"
              sx={{ 
                p: 0.5,
                color: theme.palette.admin.main
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Status Cards */}
        <Grid container spacing={1.2} sx={{ mb: 1.5 }}>
          {/* Database */}
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                p: 1.2,
                height: '100%',
                border: '1px solid',
                borderRadius: 1.5,
                borderColor: alpha(
                  systemStats.database === 'connected' 
                    ? theme.palette.success.main 
                    : theme.palette.warning.main, 
                  0.2
                ),
                bgcolor: alpha(
                  systemStats.database === 'connected' 
                    ? theme.palette.success.main 
                    : theme.palette.warning.main, 
                  0.05
                ),
              }}
            >
              <Typography 
                variant="caption" 
                fontSize="0.7rem" 
                fontWeight={500}
                sx={{ 
                  mb: 0.5, 
                  display: 'flex',
                  alignItems: 'center',
                  color: componentColors.labelColor
                }}
              >
                <MemoryIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                DATABASE
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between'
              }}>
                <Typography fontWeight={600} fontSize="0.85rem">
                  {systemStats.database === 'connected' ? 'Connected' : 'Disconnected'}
                </Typography>
                {getStatusChip(systemStats.database)}
              </Box>
            </Paper>
          </Grid>
          
          {/* Storage */}
          <Grid item xs={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              p: 2,
              bgcolor: theme.palette.admin.successBg,
              borderRadius: 2,
              border: `1px solid ${theme.palette.admin.successBorder}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Storage Service
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                System storage is operating normally
              </Typography>
            </Box>
          </Grid>
          
          {/* Processors */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 1.2,
                height: '100%',
                border: '1px solid',
                borderRadius: 1.5,
                borderColor: alpha(theme.palette.info.main, 0.2),
                bgcolor: alpha(theme.palette.info.main, 0.05),
              }}
            >
              <Typography 
                variant="caption" 
                fontSize="0.7rem" 
                fontWeight={500}
                sx={{ 
                  mb: 0.5, 
                  display: 'flex',
                  alignItems: 'center',
                  color: componentColors.labelColor
                }}
              >
                <MemoryIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                PROCESSORS
              </Typography>
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontSize="0.7rem" sx={{ mr: 0.5 }}>Transcription:</Typography>
                    {getStatusChip(systemStats.processors?.transcription)}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontSize="0.7rem" sx={{ mr: 0.5 }}>Analysis:</Typography>
                    {getStatusChip(systemStats.processors?.analysis)}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Uptime & Version */}
        <Box sx={{ mt: 'auto', pt: 1.2, borderTop: `1px solid ${alpha(componentColors.labelColor, 0.15)}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CodeIcon 
                fontSize="small"
                sx={{ color: componentColors.labelColor, mr: 0.7, fontSize: 16 }}
              />
              <Typography 
                fontSize="0.85rem" 
                sx={{ color: componentColors.headerColor, fontWeight: 500 }}
              >
                Uptime: {systemStats.uptime}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CodeIcon 
                fontSize="small"
                sx={{ color: componentColors.labelColor, mr: 0.7, fontSize: 16 }}
              />
              <Typography 
                fontSize="0.85rem" 
                sx={{ color: componentColors.headerColor, fontWeight: 500 }}
              >
                v{systemStats.version}
              </Typography>
            </Box>
          </Box>
          
          {/* Maintenance Button */}
          <Button
            variant="contained"
            startIcon={<SupportIcon fontSize="small" />}
            onClick={handleRunMaintenance}
            fullWidth
            size="small"
            sx={{ 
              fontSize: '0.75rem', 
              py: 0.8,
              bgcolor: theme.palette.admin.main,
              color: theme.palette.admin.contrastText,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: alpha(theme.palette.admin.main, 0.9),
              }
            }}
          >
            Run Maintenance
          </Button>
        </Box>
      </Box>
    );
  }

  // Standard view (full page view)
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: alpha(colors.background.default, 0.05) }}>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: componentColors.headerColor }}>
            System Status Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.8, color: componentColors.labelColor }}>
            Monitor system health and resource utilization
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{ 
            py: 0.8, 
            px: 2, 
            borderRadius: 2, 
            bgcolor: alpha(componentColors.labelBackground, 0.5),
            textAlign: 'center'
          }}>
            <Typography variant="caption" sx={{ display: 'block', color: componentColors.labelColor }}>
              Version
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: componentColors.headerColor }}>
              {systemStats.version}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ 
              bgcolor: theme.palette.admin.main,
              color: theme.palette.admin.contrastText,
              px: 2,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: alpha(theme.palette.admin.main, 0.9),
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {loading && <LinearProgress sx={{ mb: 3 }} />}
      
      {/* System Overview Card */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          border: '1px solid',
          borderColor: alpha(componentColors.labelColor, 0.15),
          backgroundColor: systemStats.status === 'operational' ? 
            alpha(theme.palette.success.light, 0.06) : alpha(theme.palette.warning.light, 0.06),
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {systemStats.status === 'operational' ? 
                <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: '2.5rem' }} /> : 
                <WarningIcon color="warning" sx={{ mr: 2, fontSize: '2.5rem' }} />
              }
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: componentColors.headerColor }}>
                  System {systemStats.status === 'operational' ? 'Operational' : 'Partially Degraded'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, color: componentColors.labelColor }}>
                  {systemStats.status === 'operational' ? 
                    'All services are running normally' : 
                    'Some services are experiencing issues'}
                </Typography>
              </Box>
            </Box>
            
            {/* Background decorative elements */}
            <Box sx={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: alpha(
                systemStats.status === 'operational' 
                  ? theme.palette.success.main 
                  : theme.palette.warning.main,
                0.03
              ),
              bottom: '-100px',
              left: '-50px',
              zIndex: 0
            }} />
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, md: 4 },
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              alignItems: 'center',
              mt: { xs: 2, md: 0 }
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: componentColors.labelColor, display: 'block', mb: 0.5 }}>
                  Last Updated
                </Typography>
                <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                  {formatTimestamp(systemStats.lastUpdated).split(',')[1]}
                </Typography>
              </Box>
              
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: componentColors.labelColor, display: 'block', mb: 0.5 }}>
                  Uptime
                </Typography>
                <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                  {systemStats.uptime}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
      
      {/* Service Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2.5 }}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ 
                color: componentColors.headerColor, 
                mb: 2,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 3,
                  backgroundColor: alpha(componentColors.buttonBackground, 0.2),
                  borderRadius: 1
                }
              }}
            >
              Core Services
            </Typography>
          </Box>
          
          <Grid container spacing={2.5}>
            {/* Database Status */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  border: '1px solid',
                  borderColor: systemStats.database === 'connected' ? 
                    alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                  backgroundColor: alpha(systemStats.database === 'connected' ? 
                    theme.palette.success.light : theme.palette.error.light, 0.05),
                  borderRadius: 3,
                  gap: 2
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(componentColors.labelColor, 0.08),
                    color: componentColors.labelColor
                  }}
                >
                  <StorageIcon fontSize="large" />
                </Box>
                
                <Box sx={{ flex: '1' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                    gap: { sm: 2 }
                  }}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: componentColors.headerColor }}>
                      Database
                    </Typography>
                    {getStatusChip(systemStats.database)}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 0.8, color: componentColors.labelColor }}>
                    SQL database service for data storage and retrieval
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  mt: { xs: 1, sm: 0 },
                  minWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor }}>
                    Status
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {systemStats.database === 'connected' ? 'Connected' : 'Disconnected'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            {/* Storage Status */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  border: '1px solid',
                  borderColor: systemStats.storage === 'available' ? 
                    alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                  backgroundColor: alpha(systemStats.storage === 'available' ? 
                    theme.palette.success.light : theme.palette.error.light, 0.05),
                  borderRadius: 3,
                  gap: 2
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(colors.background.default, 0.15),
                    color: colors.background.default
                  }}
                >
                  <CloudIcon fontSize="large" />
                </Box>
                
                <Box sx={{ flex: '1' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                    gap: { sm: 2 }
                  }}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: componentColors.headerColor }}>
                      Storage
                    </Typography>
                    {getStatusChip(systemStats.storage)}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 0.8, color: componentColors.labelColor }}>
                    File storage service for media and document storage
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  mt: { xs: 1, sm: 0 },
                  minWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor }}>
                    Status
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {systemStats.storage === 'available' ? 'Available' : 'Unavailable'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2.5 }}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ 
                color: componentColors.headerColor, 
                mb: 2,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 3,
                  backgroundColor: alpha(componentColors.buttonBackground, 0.2),
                  borderRadius: 1
                }
              }}
            >
              Processing Services
            </Typography>
          </Box>
          
          <Grid container spacing={2.5}>
            {/* Transcription Processor */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  border: '1px solid',
                  borderColor: systemStats.processors?.transcription === 'operational' ? 
                    alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.warning.main, 0.2),
                  backgroundColor: alpha(systemStats.processors?.transcription === 'operational' ? 
                    theme.palette.success.light : theme.palette.warning.light, 0.05),
                  borderRadius: 3,
                  gap: 2
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main
                  }}
                >
                  <LogIcon fontSize="large" />
                </Box>
                
                <Box sx={{ flex: '1' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                    gap: { sm: 2 }
                  }}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: componentColors.headerColor }}>
                      Transcription
                    </Typography>
                    {getStatusChip(systemStats.processors?.transcription || 'unknown')}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 0.8, color: componentColors.labelColor }}>
                    Audio transcription service for speech-to-text conversion
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  mt: { xs: 1, sm: 0 },
                  minWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor }}>
                    Status
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {systemStats.processors?.transcription === 'operational' ? 'Running' : 'Warning'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            {/* Analysis Processor */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  border: '1px solid',
                  borderColor: systemStats.processors?.analysis === 'operational' ? 
                    alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.warning.main, 0.2),
                  backgroundColor: alpha(systemStats.processors?.analysis === 'operational' ? 
                    theme.palette.success.light : theme.palette.warning.light, 0.05),
                  borderRadius: 3,
                  gap: 2
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main
                  }}
                >
                  <SupportIcon fontSize="large" />
                </Box>
                
                <Box sx={{ flex: '1' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                    gap: { sm: 2 }
                  }}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: componentColors.headerColor }}>
                      Analysis
                    </Typography>
                    {getStatusChip(systemStats.processors?.analysis || 'unknown')}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 0.8, color: componentColors.labelColor }}>
                    Data analysis service for processing interview information
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                  mt: { xs: 1, sm: 0 },
                  minWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor }}>
                    Status
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {systemStats.processors?.analysis === 'operational' ? 'Running' : 'Warning'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* System Information and Maintenance */}
      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: alpha(componentColors.labelColor, 0.15),
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ color: componentColors.headerColor, mb: 2 }}>
              System Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor, display: 'block', mb: 0.5 }}>
                    System Version
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {systemStats.version}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor, display: 'block', mb: 0.5 }}>
                    System Uptime
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {systemStats.uptime}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor, display: 'block', mb: 0.5 }}>
                    Last Status Update
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ color: componentColors.headerColor }}>
                    {formatTimestamp(systemStats.lastUpdated)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: componentColors.labelColor, display: 'block', mb: 0.5 }}>
                    Overall Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {getStatusChip(systemStats.status)}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: alpha(componentColors.labelColor, 0.15),
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ color: componentColors.headerColor, mb: 2 }}>
              System Actions
            </Typography>
            
            <Typography variant="body2" sx={{ color: componentColors.labelColor, mb: 2.5 }}>
              Perform system maintenance tasks to ensure optimal operation.
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<SupportIcon />}
              onClick={handleRunMaintenance}
              sx={{ 
                mt: 'auto',
                bgcolor: theme.palette.admin.main,
                color: theme.palette.admin.contrastText,
                py: 1.2,
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: alpha(theme.palette.admin.main, 0.9),
                }
              }}
            >
              Run System Maintenance
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemStatus;