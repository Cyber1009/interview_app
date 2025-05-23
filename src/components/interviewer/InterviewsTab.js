/**
 * InterviewsTab Component
 * 
 * A new implementation of the interviews tab that:
 * 1. Lists all interviews with search functionality
 * 2. Clicking on an interview navigates to a dedicated interview details page
 * 3. Shows summary information about questions, results, and tokens
 * 4. Includes filtering and search capabilities
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardHeader, Grid, Container,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, Tooltip, CircularProgress, Alert, useTheme, alpha, Button,
  TextField, InputAdornment, Divider
} from '@mui/material';

import {
  VideoLibrary as InterviewsIcon,
  QuestionAnswer as QuestionsIcon,
  Link as TokensIcon,
  Assessment as ResultsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { interviewerAPI } from '../../api';
// Fix the imports - use direct path to styles.js
import { 
  getStandardCardStyles,
  getStandardCardHeaderStyles
} from '../../styles/theme/styles';
import { componentColors } from '../../styles/theme';

const InterviewsTab = () => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch all interviews when component mounts
  useEffect(() => {
    fetchInterviews();
  }, []);

  // Filter interviews when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInterviews(interviews);
    } else {
      const filtered = interviews.filter(interview => 
        interview.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterviews(filtered);
    }
  }, [searchTerm, interviews]);
  
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

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchInterviews();
    setTimeout(() => setRefreshing(false), 1000); // Ensure UI feedback
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Handle interview selection - navigate to a dedicated page
  // Use the slug attribute returned from backend for URL navigation
  const handleInterviewSelect = (interview) => {
    console.log('Selected interview:', interview); // Debug log
    
    if (!interview || !interview.slug) {
      console.error('Interview missing slug field:', interview);
      // Fallback to ID if slug is not available
      if (interview.id) {
        navigate(`/interviewer/interviews/id/${interview.id}`);
      }
      return;
    }
    
    console.log('Navigating to slug:', interview.slug); // Debug log
    navigate(`/interviewer/interviews/${interview.slug}`);
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
    <Container maxWidth="lg" sx={{ 
      py: 4,
      position: 'relative',
      backgroundColor: 'transparent'
    }}>
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        p: 3,
        borderRadius: 2,
        backgroundColor: 'transparent',
        transition: 'all 0.2s ease-in-out'
      }}>
        {/* Header with title and icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InterviewsIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
          <Typography 
            variant="h5" 
            component="h1"
            fontWeight={600}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Interview Templates
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />

        {/* Search Section */}
        <Card elevation={0} sx={{ 
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'var(--theme-background-paper, white)'
        }}>
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search interviews by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }
              }}
            />
          </Box>
        </Card>

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 12,
            gap: 3
          }}>
            <CircularProgress size={48} />
            <Typography color="text.secondary" variant="h6" fontWeight={400}>
              Loading interviews...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'error.light',
              p: 3
            }}
            action={
              <Button color="inherit" size="small" onClick={fetchInterviews}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <Card
            elevation={0} 
            sx={{
              ...getStandardCardStyles(),
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              bgcolor: 'var(--theme-background-paper, white)'
            }}
          >
            <CardHeader
              title="My Interviews"
              sx={{
                ...getStandardCardHeaderStyles(),
                p: 3,
                borderLeft: '4px solid',
                borderLeftColor: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.02)
              }}
            />
            <CardContent sx={{ p: 0 }}>
              {filteredInterviews.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, px: 4 }}>
                  <InterviewsIcon 
                    sx={{ 
                      fontSize: 80,
                      color: 'action.disabled',
                      opacity: 0.6,
                      mb: 3
                    }} 
                  />
                  <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={500}>
                    {searchTerm ? 'No interviews found' : 'No interviews created yet'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first interview template to get started'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateInterview}
                    size="large"
                    sx={{ 
                      borderRadius: 3,
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      boxShadow: 3
                    }}
                  >
                    Create Interview Template
                  </Button>
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ 
                    '& .MuiTable-root': {
                      '& .MuiTableCell-root': {
                        py: 2.5,
                        px: 3
                      }
                    }
                  }}>
                    <Table>
                      <TableHead sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderBottom: '2px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                      }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, py: 3 }}>Interview Title</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 3 }}>Created</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 3 }}>Questions</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 3 }}>Access Tokens</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 3 }}>Results</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredInterviews.map(interview => (
                          <TableRow 
                            key={interview.id} 
                            hover
                            onClick={() => handleInterviewSelect(interview)}
                            sx={{ 
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {interview.title}
                                </Typography>
                                {(interview.active_tokens_count || 0) > 0 && (
                                  <Chip 
                                    size="small" 
                                    color="success" 
                                    label="Active" 
                                    sx={{ 
                                      borderRadius: 2,
                                      height: 24,
                                      fontSize: '0.75rem',
                                      fontWeight: 500
                                    }} 
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(interview.created_at)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                color="primary" 
                                label={`${interview.questions?.length || 0} Questions`} 
                                variant="outlined"
                                sx={{ 
                                  borderRadius: 2,
                                  '& .MuiChip-label': { fontWeight: 500 }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                icon={<TokensIcon sx={{ fontSize: '0.9rem !important' }} />}
                                label={`${interview.active_tokens_count || 0}/${interview.tokens_count || 0} Active`} 
                                color={interview.active_tokens_count > 0 ? "success" : "default"}
                                variant="outlined"
                                sx={{ 
                                  borderRadius: 2,
                                  '& .MuiChip-label': { fontWeight: 500 }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                icon={<ResultsIcon sx={{ fontSize: '0.9rem !important' }} />}
                                label={`${interview.completed_sessions_count || 0} Complete`} 
                                color="info"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Add Interview Button at the bottom of the table */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateInterview}
                      size="large"
                      sx={{ 
                        py: 2,
                        px: 5,
                        borderRadius: 3,
                        boxShadow: 3,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      Create New Interview
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
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