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
  Container, Grid, Paper, Typography, Box, Button,
  Card, CardContent, CardHeader, Divider, List, ListItem,
  ListItemText, ListItemIcon, CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  VideoCall as VideoIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  QuestionAnswer as QuestionIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { InterviewService, AdminService } from '../../services';

const InterviewerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    activeTokens: 0
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // These would be actual API calls in a real implementation
        const interviews = await InterviewService.getInterview();
        const tokens = await AdminService.getAllTokens();
        
        // Process the data
        setStats({
          totalInterviews: interviews?.length || 0,
          completedInterviews: interviews?.filter(i => i.completed)?.length || 0,
          pendingInterviews: interviews?.filter(i => !i.completed)?.length || 0,
          activeTokens: tokens?.length || 0
        });
        
        setRecentInterviews(interviews?.slice(0, 5) || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateTo = (path) => () => {
    navigate(path);
  };

  const ActionButton = ({ icon, text, onClick, color = 'primary' }) => (
    <Button
      variant="contained"
      color={color}
      startIcon={icon}
      onClick={onClick}
      fullWidth
      sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
    >
      {text}
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={600} sx={{ mb: 4 }}>
        Interviewer Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<AddIcon />} 
                text="Create Interview"
                onClick={navigateTo('/interviewer/create')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<VideoIcon />} 
                text="Manage Interviews"
                onClick={navigateTo('/interviewer/interviews')}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<QuestionIcon />} 
                text="Manage Questions"
                onClick={navigateTo('/interviewer/questions')}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                icon={<AssessmentIcon />} 
                text="View Analytics"
                onClick={navigateTo('/interviewer/analytics')}
                color="success"
              />
            </Grid>
          </Grid>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Total Interviews', value: stats.totalInterviews, icon: <VideoIcon color="primary" /> },
              { label: 'Completed', value: stats.completedInterviews, icon: <AssessmentIcon color="success" /> },
              { label: 'Pending', value: stats.pendingInterviews, icon: <PeopleIcon color="warning" /> },
              { label: 'Active Tokens', value: stats.activeTokens, icon: <QuestionIcon color="info" /> }
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%'
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
              </Grid>
            ))}
          </Grid>

          {/* Recent Interviews */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Recent Interviews" 
                  action={
                    <Button 
                      size="small" 
                      onClick={navigateTo('/interviewer/interviews')}
                    >
                      View All
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  {recentInterviews.length > 0 ? (
                    <List>
                      {recentInterviews.map((interview, index) => (
                        <React.Fragment key={interview.id}>
                          <ListItem button onClick={() => navigate(`/interviewer/interviews/${interview.id}`)}>
                            <ListItemIcon>
                              <VideoIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary={interview.title} 
                              secondary={`Created: ${new Date(interview.created_at).toLocaleDateString()}`} 
                            />
                          </ListItem>
                          {index < recentInterviews.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography color="text.secondary">
                        No interviews created yet. Create your first interview to get started.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                        onClick={navigateTo('/interviewer/create')}
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
    </Container>
  );
};

export default InterviewerDashboard;