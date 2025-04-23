/**
 * Interview Analytics Component
 * Provides:
 * - Data visualization of interview results
 * - Insights from interviews
 * - Completion metrics
 * - Response time analysis
 */

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, 
  Card, CardContent, CardHeader, Divider,
  FormControl, InputLabel, Select, MenuItem,
  Tab, Tabs, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { InterviewService, RecordingService } from '../../services';

const InterviewAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    interviews: [],
    totalSessions: 0,
    completedSessions: 0,
    averageCompletionTime: 0,
    performanceByQuestion: [],
    completionRate: 0,
  });
  const [selectedInterview, setSelectedInterview] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // In production, this would be an actual API call
        // For development, using mock data
        const mockData = {
          interviews: [
            { id: 1, title: "Frontend Developer Interview" },
            { id: 2, title: "Backend Developer Interview" },
            { id: 3, title: "Full Stack Developer Interview" }
          ],
          totalSessions: 125,
          completedSessions: 98,
          averageCompletionTime: 1230, // seconds
          performanceByQuestion: [
            { 
              question_id: 1, 
              text: "Tell me about yourself", 
              average_response_time: 95, 
              expected_time: 120,
              completion_rate: 0.98
            },
            { 
              question_id: 2, 
              text: "What's your greatest professional achievement?", 
              average_response_time: 110, 
              expected_time: 120,
              completion_rate: 0.94
            },
            { 
              question_id: 3, 
              text: "Describe a challenging problem you've solved", 
              average_response_time: 150, 
              expected_time: 120,
              completion_rate: 0.88
            },
            { 
              question_id: 4, 
              text: "Why do you want to work for our company?", 
              average_response_time: 85, 
              expected_time: 120,
              completion_rate: 0.96
            }
          ],
          completionRate: 0.784 // 78.4%
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleInterviewChange = (event) => {
    setSelectedInterview(event.target.value);
    // In a real app, you'd fetch new analytics data here
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const KpiCard = ({ title, value, description, color = 'primary.main' }) => (
    <Card elevation={2}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ fontWeight: 600, color: color, mb: 1 }}
        >
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Interview</InputLabel>
          <Select
            value={selectedInterview}
            onChange={handleInterviewChange}
            label="Interview"
          >
            <MenuItem value="all">All Interviews</MenuItem>
            {analyticsData.interviews.map((interview) => (
              <MenuItem key={interview.id} value={interview.id}>
                {interview.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Total Sessions" 
            value={analyticsData.totalSessions} 
            description="Number of interview sessions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Completed" 
            value={analyticsData.completedSessions} 
            description="Fully completed interviews"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Completion Rate" 
            value={formatPercentage(analyticsData.completionRate)} 
            description="Sessions completed fully"
            color={analyticsData.completionRate < 0.7 ? 'error.main' : 'success.main'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Average Time" 
            value={formatTime(analyticsData.averageCompletionTime)} 
            description="Average completion time"
          />
        </Grid>
      </Grid>

      {/* Analytics Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Question Performance" />
            <Tab label="Completion Metrics" />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Question Response Analysis
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell align="right">Avg. Response Time</TableCell>
                        <TableCell align="right">Expected Time</TableCell>
                        <TableCell align="right">Difference</TableCell>
                        <TableCell align="right">Completion Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.performanceByQuestion.map((row) => {
                        const timeDiff = row.average_response_time - row.expected_time;
                        return (
                          <TableRow key={row.question_id}>
                            <TableCell component="th" scope="row">
                              {row.text}
                            </TableCell>
                            <TableCell align="right">
                              {formatTime(row.average_response_time)}
                            </TableCell>
                            <TableCell align="right">
                              {formatTime(row.expected_time)}
                            </TableCell>
                            <TableCell 
                              align="right"
                              sx={{ 
                                color: timeDiff > 0 ? 'error.main' : 'success.main',
                                fontWeight: 500
                              }}
                            >
                              {timeDiff > 0 ? '+' : ''}{formatTime(timeDiff)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPercentage(row.completion_rate)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
          {tabValue === 1 && (
            <Typography>
              Completion metrics visualization will be displayed here.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Additional Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Candidate Demographics" />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Demographic visualization will be displayed here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Time Distribution" />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Time distribution visualization will be displayed here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InterviewAnalytics;