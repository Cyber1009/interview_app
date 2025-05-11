/**
 * Interviewer Dashboard Component
 * Provides:
 * - Overview of interviews and results
 * - Quick access to key functions
 * - Analytics summary
 * - Recent activity
 */

import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Button,
  Card, CardContent, CardHeader, Divider, List, ListItem,
  ListItemText, ListItemIcon, CircularProgress, Alert, 
  Chip, Tooltip, useTheme
} from '@mui/material';
import { 
  Add as AddIcon,
  VideoCall as VideoIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  QuestionAnswer as QuestionIcon,
  Link as LinkIcon,
  BarChart as AnalyticsIcon,
  PlayArrow as StartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// Updated import to use the consolidated API
import { interviewerAPI } from '../../api';

const InterviewerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    activeTokens: 0,
    totalResults: 0,
    completionRate: 0
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch interviews data using interviewerAPI
        try {
          const response = await interviewerAPI.getAllInterviews();
          const interviews = response?.data || [];
          
          // Process interviews to calculate stats
          const completedCount = interviews.filter(i => i.status === 'completed').length;
          const pendingCount = interviews.length - completedCount;
          const completionRate = interviews.length > 0 
            ? Math.round((completedCount / interviews.length) * 100)
            : 0;
          
          setStats(prev => ({
            ...prev,
            totalInterviews: interviews.length,
            completedInterviews: completedCount,
            pendingInterviews: pendingCount,
            completionRate
          }));
          
          // Sort interviews by creation date (newest first) and take first 5
          const sortedInterviews = [...interviews].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          setRecentInterviews(sortedInterviews.slice(0, 5));
          
          // Get active tokens count across all interviews
          let activeTokensCount = 0;
          let totalResultsCount = 0;
          
          // For each interview, fetch tokens and calculate active tokens
          for (const interview of interviews) {
            try {
              // Fetch tokens for this interview
              const tokensResponse = await interviewerAPI.getTokensByInterview(interview.id);
              const tokens = tokensResponse?.data || [];
              
              activeTokensCount += tokens.filter(t => !t.is_used).length;
              
              // Fetch results for this interview
              const resultsResponse = await interviewerAPI.getInterviewResults(interview.id);
              const results = resultsResponse?.data || [];
              
              totalResultsCount += results.length;
              
            } catch (err) {
              console.warn(`Failed to load tokens/results for interview ${interview.id}:`, err);
            }
          }
          
          setStats(prev => ({
            ...prev,
            activeTokens: activeTokensCount,
            totalResults: totalResultsCount
          }));
          
        } catch (err) {
          console.error('Failed to load interviews:', err);
          setError('Failed to load interview data. Please try again.');
        }
      } catch (err) {
        console.error('Dashboard data loading failed:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update navigation paths to include the /interviewer prefix
  const navigateTo = (path) => () => {
    navigate(`/interviewer${path}`);
  };

  const ActionButton = ({ icon, text, onClick, color = 'primary' }) => (
    <Button
      variant="contained"
      color={color}
      startIcon={icon}
      onClick={onClick}
      fullWidth
      sx={{ 
        py: 1.8, 
        textTransform: 'none', 
        fontWeight: 500,
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {text}
    </Button>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          fontWeight={600} 
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Interviewer Dashboard
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={navigateTo('/interviews/create')}
          sx={{ borderRadius: 2 }}
        >
          New Interview
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Quick Actions */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<AddIcon />} 
                text="Create Interview"
                onClick={navigateTo('/interviews/create')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<VideoIcon />} 
                text="Manage Interviews"
                onClick={navigateTo('/interviews')}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<LinkIcon />} 
                text="Access Tokens"
                onClick={() => {
                  // Navigate to tokens page of the most recent interview,
                  // or the interviews list if no interviews exist
                  if (recentInterviews.length > 0) {
                    navigate(`/interviewer/interviews/${recentInterviews[0].id}/tokens`);
                  } else {
                    navigate('/interviewer/interviews');
                  }
                }}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<AnalyticsIcon />} 
                text="View Results"
                onClick={() => {
                  // Navigate to results page of the most recent interview,
                  // or the interviews list if no interviews exist
                  if (recentInterviews.length > 0) {
                    navigate(`/interviewer/interviews/${recentInterviews[0].id}/results`);
                  } else {
                    navigate('/interviewer/interviews');
                  }
                }}
                color="success"
              />
            </Grid>
          </Grid>

          {/* Stats Overview */}
          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 500 }}>
            Overview
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                label: 'Total Interviews', 
                value: stats.totalInterviews, 
                icon: <VideoIcon color="primary" />,
                color: 'primary.main',
                tooltip: 'Total number of interview templates you have created'
              },
              { 
                label: 'Interview Results', 
                value: stats.totalResults, 
                icon: <AssessmentIcon color="success" />,
                color: 'success.main',
                tooltip: 'Total number of completed interview sessions'
              },
              { 
                label: 'Active Tokens', 
                value: stats.activeTokens, 
                icon: <LinkIcon color="info" />,
                color: 'info.main',
                tooltip: 'Access tokens that have not been used yet'
              },
              { 
                label: 'Completion Rate', 
                value: `${stats.completionRate}%`, 
                icon: <AnalyticsIcon color="warning" />,
                color: 'warning.main',
                tooltip: 'Percentage of completed interviews'
              }
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Tooltip title={stat.tooltip} placement="top" arrow>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      borderRadius: 3,
                      borderTop: 3,
                      borderColor: stat.color,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Box sx={{ p: 1 }}>{stat.icon}</Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Tooltip>
              </Grid>
            ))}
          </Grid>

          {/* Recent Interviews */}
          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 500 }}>
            Recent Interviews
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardHeader 
                  title="Your Interview Templates" 
                  titleTypographyProps={{ variant: 'h6', fontWeight: 500 }}
                  action={
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={navigateTo('/interviews')}
                      sx={{ borderRadius: 2 }}
                    >
                      View All
                    </Button>
                  }
                  sx={{ backgroundColor: 'background.paper', py: 2 }}
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {recentInterviews.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {recentInterviews.map((interview, index) => (
                        <React.Fragment key={interview.id}>
                          <ListItem 
                            button 
                            onClick={() => navigate(`/interviewer/interviews/${interview.id}`)}
                            sx={{ 
                              py: 2,
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <VideoIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" fontWeight={500}>
                                    {interview.title}
                                  </Typography>
                                  {interview.status === 'active' && (
                                    <Chip 
                                      label="Active" 
                                      size="small" 
                                      color="success" 
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Box>
                              } 
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                    Created: {formatDate(interview.created_at)}
                                  </Typography>
                                  {interview.questions && (
                                    <Typography component="span" variant="caption" 
                                      sx={{ 
                                        bgcolor: 'primary.50', 
                                        color: 'primary.dark',
                                        px: 1, 
                                        py: 0.5, 
                                        borderRadius: 1,
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      {interview.questions.length} Questions
                                    </Typography>
                                  )}
                                </Box>
                              } 
                            />
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="primary"
                              startIcon={<StartIcon />}
                              sx={{ borderRadius: 2, minWidth: 100 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/interviewer/interviews/${interview.id}`);
                              }}
                            >
                              Manage
                            </Button>
                          </ListItem>
                          {index < recentInterviews.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary" paragraph>
                        No interviews created yet. Create your first interview to get started.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mt: 1, borderRadius: 2 }}
                        onClick={navigateTo('/interviews/create')}
                      >
                        Create Interview
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default InterviewerDashboard;