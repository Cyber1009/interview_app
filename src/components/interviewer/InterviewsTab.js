/**
 * InterviewsTab Component
 * 
 * A new implementation of the interviews tab that:
 * 1. Lists all interviews
 * 2. Clicking on an interview navigates to a dedicated interview details page
 * 3. Shows summary information about questions, results, and tokens
 * 4. Avoids color.charAt errors by using proper color handling
 * 
 * Note: This component also serves as a replacement for the deprecated InterviewList component
 * and provides backward compatibility through exports.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardHeader, Grid, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, Tooltip, CircularProgress, Alert, useTheme, alpha, Button
} from '@mui/material';

import {
  VideoLibrary as InterviewsIcon,
  QuestionAnswer as QuestionsIcon,
  Link as TokensIcon,
  Assessment as ResultsIcon
} from '@mui/icons-material';

import { interviewerAPI } from '../../api';
import { 
  componentColors,
  getStandardCardStyles,
  getStandardCardHeaderStyles
} from '../../styles/theme';
import PageContainer from './PageContainer';

const InterviewsTab = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch all interviews when component mounts
  useEffect(() => {
    fetchInterviews();
  }, []);
  
  // Fetch all interviews
  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await interviewerAPI.getAllInterviews();
      // API returns data directly due to axios interceptor, no need for response.data
      setInterviews(response || []);
      setError(null);
    } catch (err) {
      setError(`Error loading interviews: ${err.message || 'Unknown error'}`);
      console.error('Failed to fetch interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle interview selection - navigate to a dedicated page
  const handleInterviewSelect = (interview) => {
    navigate(`/interviewer/interviews/${interview.id}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle create interview button click
  const handleCreateInterview = () => {
    navigate('/interviewer/interviews/create');
  };

  return (
    <PageContainer
      title="Interviews"
      icon={<InterviewsIcon />}      actions={
        <Button
          variant="contained"
          onClick={handleCreateInterview}
          startIcon={<Box component="span" sx={{ fontSize: 16 }}>+</Box>}
          sx={{ 
            borderRadius: 1,
            px: 1.75,
            py: 0.6,
            fontWeight: 500,
            boxShadow: 'none'
          }}
        >
          Create Interview
        </Button>
      }
    >
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          my: 8,
          gap: 2
        }}>
          <CircularProgress size={40} />
          <Typography color="text.secondary" variant="body2">
            Loading interviews...
          </Typography>
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: 1
          }}
          action={
            <Button color="inherit" size="small" onClick={fetchInterviews}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>      ) : (
        <Card
          elevation={0} 
          sx={{
            ...getStandardCardStyles(),
            mb: 1.5,
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}
        >
          <CardHeader
            title="My Interviews"
            sx={{
              ...getStandardCardHeaderStyles(),
              p: 1.25,
              borderLeft: '4px solid',              borderLeftColor: 'primary.main'
            }}
          />
          <CardContent sx={{ p: 0, py: 0.5 }}>
            {interviews.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No interviews found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first interview to get started
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleCreateInterview}
                  sx={{ borderRadius: 2 }}
                >
                  Create Interview
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
                    borderBottom: '2px solid',
                    borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                  }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Questions</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Tokens</TableCell>
                      <TableCell sx={{ fontWeight: 600, py: 2 }}>Results</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {interviews.map(interview => (
                      <TableRow 
                        key={interview.id} 
                        hover
                        onClick={() => handleInterviewSelect(interview)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                          }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={500}>
                            {interview.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {formatDate(interview.created_at)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            color="primary" 
                            label={`${interview.questions?.length || 0} Questions`} 
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            icon={<TokensIcon sx={{ fontSize: '0.8rem !important' }} />}
                            label={`${interview.active_tokens_count || 0} Active`} 
                            color={interview.active_tokens_count > 0 ? "success" : "default"}
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            icon={<ResultsIcon sx={{ fontSize: '0.8rem !important' }} />}
                            label={`${interview.completed_sessions_count || 0} Complete`} 
                            color="info"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
};

/**
 * @deprecated Use InterviewsTab directly instead
 * This is a compatibility wrapper for backward compatibility
 * with code that imports InterviewList
 */
export const InterviewList = (props) => {
  // If this is being loaded as a route, redirect to /interviews
  if (props.isRoute) {
    return <Navigate to="/interviews" replace />;
  }
  
  // Otherwise just render the InterviewsTab component
  return <InterviewsTab {...props} />;
};

export default InterviewsTab;
