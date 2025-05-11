import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Tabs, 
  Tab,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  useTheme,
  TextField,
  Grid,
  alpha
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  QuestionAnswer as QuestionsIcon,
  Link as TokensIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Assessment as ResultsIcon,
  ArrowForward as ArrowRight
} from '@mui/icons-material';
import InterviewDataProvider from './shared/InterviewDataProvider';
import { interviewerAPI } from '../../api';

/**
 * InterviewManager Component - Single interview management interface
 * 
 * Features:
 * - View and edit interview details
 * - Navigation to questions, tokens, and results
 * - Delete interview
 */
const InterviewManager = () => {
  const { interviewId } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditToggle = (interview) => {
    if (isEditing) {
      // Cancel edit
      setIsEditing(false);
    } else {
      // Start edit
      setEditedTitle(interview?.title || '');
      setIsEditing(true);
    }
  };

  const handleNavigateToQuestions = () => {
    navigate(`/interviewer/interviews/${interviewId}/questions`);
  };

  const handleNavigateToTokens = () => {
    navigate(`/interviewer/interviews/${interviewId}/tokens`);
  };

  const handleNavigateToResults = () => {
    navigate(`/interviewer/interviews/${interviewId}/results`);
  };

  const handleBackToList = () => {
    navigate('/interviewer/interviews');
  };

  const handleSaveChanges = async (interview, updateInterview) => {
    if (!editedTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'Interview title cannot be empty',
        severity: 'error'
      });
      return;
    }

    setSaving(true);

    try {
      const response = await updateInterview(interviewId, { title: editedTitle });
      
      if (response) {
        setSnackbar({
          open: true,
          message: 'Interview updated successfully',
          severity: 'success'
        });
        setIsEditing(false);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update interview',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInterview = async (interview, deleteInterview) => {
    if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await deleteInterview(interviewId);
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Interview deleted successfully',
          severity: 'success'
        });
        
        // Navigate back to the interview list after a brief delay
        setTimeout(() => {
          navigate('/interviewer/interviews');
        }, 1500);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete interview',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <InterviewDataProvider interviewId={interviewId}>
      {({ 
        interview, 
        loading, 
        error, 
        refreshData,
        updateInterview,
        deleteInterview
      }) => (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToList}
                sx={{ mr: 2, borderRadius: 2 }}
              >
                Back to List
              </Button>
              {!isEditing ? (
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight={600} 
                  sx={{ 
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {loading ? 'Loading...' : interview?.title || 'Interview Details'}
                </Typography>
              ) : (
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    variant="outlined"
                    size="medium"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    label="Interview Title"
                    fullWidth
                    sx={{ 
                      minWidth: 300,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                    autoFocus
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshData}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditToggle(interview)}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleEditToggle(interview)}
                    disabled={saving}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    onClick={() => handleSaveChanges(interview, updateInterview)}
                    disabled={saving}
                    sx={{ borderRadius: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: 1
              }}
              action={
                <Button color="inherit" size="small" onClick={refreshData}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8 
            }}>
              <CircularProgress />
            </Box>
          ) : interview ? (
            <>
              <Paper 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  mb: 4
                }}
              >
                <Box sx={{ p: 2, bgcolor: 'background.subtle' }}>
                  <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }
                    }}
                  >
                    <Tab label="Overview" />
                    <Tab label="Details" />
                    <Tab label="Configuration" />
                  </Tabs>
                </Box>
                
                <Divider />
                
                <Box sx={{ p: 3 }}>
                  {currentTab === 0 && (
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 3,
                        mb: 4 
                      }}>
                        <Button
                          variant="contained"
                          startIcon={<QuestionsIcon />}
                          onClick={handleNavigateToQuestions}
                          color="primary"
                          sx={{ 
                            py: 2,
                            px: 4,
                            borderRadius: 2,
                            flexGrow: 1,
                            boxShadow: 2
                          }}
                        >
                          Manage Questions
                        </Button>
                        
                        <Button
                          variant="contained"
                          startIcon={<TokensIcon />}
                          onClick={handleNavigateToTokens}
                          color="secondary"
                          sx={{ 
                            py: 2,
                            px: 4,
                            borderRadius: 2,
                            flexGrow: 1,
                            boxShadow: 2
                          }}
                        >
                          Access Tokens
                        </Button>
                        
                        <Button
                          variant="contained"
                          startIcon={<ResultsIcon />}
                          onClick={handleNavigateToResults}
                          color="info"
                          sx={{ 
                            py: 2,
                            px: 4,
                            borderRadius: 2,
                            flexGrow: 1,
                            boxShadow: 2
                          }}
                        >
                          View Results
                        </Button>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Interview Summary
                        </Typography>
                      </Box>

                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                          <Paper
                            elevation={0}
                            sx={{ 
                              p: 3, 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              height: '100%'
                            }}
                          >
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Interview Details
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Created On
                              </Typography>
                              <Typography variant="body1">
                                {new Date(interview.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Questions
                              </Typography>
                              <Typography variant="body1">
                                {interview.questions?.length || 0} questions
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Active Tokens
                              </Typography>
                              <Typography variant="body1">
                                {interview.active_tokens_count || 0} of {interview.tokens_count || 0}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper
                            elevation={0}
                            sx={{ 
                              p: 3, 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              height: '100%'
                            }}
                          >
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Results Overview
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Completed Sessions
                              </Typography>
                              <Typography variant="body1">
                                {interview.completed_sessions_count || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Total Responses
                              </Typography>
                              <Typography variant="body1">
                                {interview.total_responses_count || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <Button 
                                size="small"
                                variant="text"
                                endIcon={<ArrowRight />}
                                onClick={handleNavigateToResults}
                              >
                                View All Results
                              </Button>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  {currentTab === 1 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Interview Settings
                      </Typography>
                      {/* Interview details content */}
                    </Box>
                  )}
                  
                  {currentTab === 2 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Advanced Configuration
                      </Typography>
                      {/* Configuration content */}
                    </Box>
                  )}
                </Box>
              </Paper>
              
              <Paper
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  backgroundColor: alpha(theme.palette.error.light, 0.05),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.error.main, 0.2),
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                      Danger Zone
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deleting an interview will remove all associated questions, tokens, and results.
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteInterview(interview, deleteInterview)}
                    sx={{ borderRadius: 2 }}
                  >
                    Delete Interview
                  </Button>
                </Box>
              </Paper>
            </>
          ) : (
            <Alert severity="warning">Interview not found or was deleted.</Alert>
          )}
          
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity} 
              elevation={6}
              variant="filled"
              sx={{ borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      )}
    </InterviewDataProvider>
  );
};

export default InterviewManager;