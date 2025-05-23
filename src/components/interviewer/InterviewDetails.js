/**
 * Interview Details Component
 * 
 * Provides a dedicated page for interview details with:
 * - Back navigation to interviews list
 * - Questions, results, and tokens tabs
 * - Detailed information about the interview
 * - Actions for managing interview content
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {  Box, Typography, Card, CardContent, CardHeader, Grid, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,  Chip, CircularProgress, Alert, useTheme, alpha, Button, IconButton,
  Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, Collapse, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, FormHelperText, OutlinedInput, InputAdornment,
  Snackbar
} from '@mui/material';

import {
  ArrowBack as BackIcon,  VideoLibrary as InterviewsIcon,
  QuestionAnswer as QuestionsIcon,
  Link as TokensIcon,
  Assessment as ResultsIcon, 
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  ContentCopy,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  Videocam as VideocamIcon,
  Save as SaveIcon
} from '@mui/icons-material';

import interviewerAPI from '../../api/domains/interviewer';
import { 
  componentColors,
  getStandardCardStyles,
  getStandardCardHeaderStyles,
  getPrimaryButtonStyles,
  getSecondaryButtonStyles,
  getStandardTableContainerStyles,
  getStandardTableHeaderStyles
} from '../../styles/theme';
import PageContainer from './PageContainer';

const InterviewDetails = () => {
  const { interviewId } = useParams();
  const location = useLocation();
  const [interview, setInterview] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    questions: [],
    tokens: [],
    results: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const [activeTab, setActiveTab] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tokenGenerating, setTokenGenerating] = useState(false);
  const [questionData, setQuestionData] = useState({
    text: '',
    preparation_time: 30,
    responding_time: 60,
    category: 'Behavioral'
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Fallback style if StyledComponents are not available
  const fallbackStyles = {
    borderRadius: 2,
    p: 0,
    overflow: 'hidden',
    border: '1px solid',
    borderColor: 'divider'
  };
  // Fetch interview details when component mounts
  useEffect(() => {
    if (interviewId) {
      fetchInterview(interviewId);
      fetchInterviewDetails(interviewId);
    }
    
    // Check if we have a message from redirect and set the active tab
    if (location.state?.activeTab !== undefined) {
      setActiveTab(location.state.activeTab);
    }
    
    // Show any messages passed through location state
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: 'info'
      });
      
      // Clear the location state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [interviewId, location]);

  // Fetch the specific interview
  const fetchInterview = async (id) => {
    try {
      const response = await interviewerAPI.getInterview(id);
      setInterview(response);
    } catch (err) {
      setError(`Error loading interview: ${err.message || 'Unknown error'}`);
      console.error('Failed to fetch interview:', err);
    }
  };
  
  // Fetch details for the interview
  const fetchInterviewDetails = async (id) => {
    setLoading(true);
    try {
      // Fetch questions
      const questionsResponse = await interviewerAPI.getQuestionsByInterview(id);
      
      // Fetch tokens
      const tokensResponse = await interviewerAPI.getTokensByInterview(id);
      
      // Fetch results
      const resultsResponse = await interviewerAPI.getInterviewResults(id);
      
      // Deduplicate results based on token_value
      const uniqueResults = Array.isArray(resultsResponse) 
        ? resultsResponse.reduce((acc, result) => {
            // Skip if this token_value has already been added
            if (!result.token_value || acc.some(r => r.token_value === result.token_value)) {
              return acc;
            }
            acc.push(result);
            return acc;
          }, [])
        : [];
      
      setInterviewDetails({
        questions: questionsResponse || [],
        tokens: tokensResponse || [],
        results: uniqueResults
      });
      
      setError(null);
    } catch (err) {
      setError(`Error loading interview details: ${err.message || 'Unknown error'}`);
      console.error('Failed to fetch interview details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle question expansion
  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Format date for readability
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Navigate back to interview list
  const handleBackClick = () => {
    navigate('/interviewer/interviews');
  };
  
  // Handle opening the add question dialog
  const handleOpenDialog = () => {
    setQuestionData({
      text: '',
      preparation_time: 30,
      responding_time: 60,
      category: 'Behavioral'
    });
    setDialogOpen(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle input changes for the question form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prev => ({
      ...prev,
      [name]: name === 'preparation_time' || name === 'responding_time' 
        ? parseInt(value) 
        : value
    }));
  };

  // Handle saving a new question
  const handleSaveQuestion = async () => {
    if (!questionData.text.trim()) {
      setSnackbar({
        open: true,
        message: 'Question text cannot be empty',
        severity: 'error'
      });
      return;
    }

    setSaving(true);

    try {
      // Make API call to add the question
      await interviewerAPI.addQuestion({
        interviewName: interviewId,
        text: questionData.text,
        preparation_time: questionData.preparation_time,
        responding_time: questionData.responding_time
      });
      
      // Refresh interview details to show the new question
      await fetchInterviewDetails(interviewId);
      
      setSnackbar({
        open: true,
        message: 'Question added successfully',
        severity: 'success'
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to add question:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add question',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle generating a new token
  const handleGenerateToken = async () => {
    setTokenGenerating(true);
    try {
      await interviewerAPI.generateToken(interviewId);
      
      // Refresh interview details to show the new token
      await fetchInterviewDetails(interviewId);
      
      setSnackbar({
        open: true,
        message: 'Token generated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to generate token:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate token',
        severity: 'error'
      });
    } finally {
      setTokenGenerating(false);
    }
  };
    // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle duplicating interview
  const handleDuplicateInterview = async () => {
    if (interviewId) {
      try {
        // This is a placeholder - you'll need to implement your interview duplication API
        // const duplicatedInterview = await interviewerAPI.duplicateInterview(interviewId);
        
        // For now just create a notification - connect to your actual API endpoint
        setSnackbar({
          open: true,
          message: 'Interview duplication started',
          severity: 'info'
        });
        
        // Refresh interview list after duplication
        // navigate('/interviewer/interviews');
      } catch (error) {
        console.error('Failed to duplicate interview:', error);
        setSnackbar({
          open: true,
          message: 'Failed to duplicate interview',
          severity: 'error'
        });
      }
    }
  };

  return (
    <PageContainer
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleBackClick}
            sx={{ mr: 1, color: 'primary.main' }}
          >
            <BackIcon />
          </IconButton>
          Interview Details
        </Box>
      }
      icon={<InterviewsIcon />}
      actions={
        interview && (
          <>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => navigate(`/interviewer/interviews/${interviewId}/edit`)}
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>            <Button
              startIcon={<DuplicateIcon />}
              variant="outlined"
              onClick={handleDuplicateInterview}
              sx={{ borderRadius: 2 }}
            >
              Duplicate
            </Button>
          </>
        )
      }
    >
      {loading && !interview ? (
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
            Loading interview details...
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
            <Button color="inherit" size="small" onClick={() => {
              fetchInterview(interviewId);
              fetchInterviewDetails(interviewId);
            }}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : interview ? (
        <>          {/* Interview Summary Card */}
          <Card
            elevation={0} 
            sx={{
              ...(typeof getStandardCardStyles === 'function' ? getStandardCardStyles() : fallbackStyles),
              mb: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <CardHeader
              title={interview.title}
              subheader={`Created: ${formatDate(interview.created_at)}`}
              sx={{
                ...getStandardCardHeaderStyles(),
                borderLeft: '4px solid',
                borderLeftColor: 'primary.main'
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Chip 
                  icon={<QuestionsIcon />}
                  label={`${interviewDetails.questions.length} Questions`} 
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  icon={<TokensIcon />}
                  label={`${interviewDetails.tokens.filter(t => !t.is_used).length} Active Tokens`}
                  color="success"
                  variant="outlined"
                />
                <Chip 
                  icon={<ResultsIcon />}
                  label={`${interviewDetails.results.length} Results`}
                  color="info"
                  variant="outlined"
                />
              </Box>
              {interview.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {interview.description}
                </Typography>
              )}
            </CardContent>
          </Card>          {/* Tabs for Questions, Results, Tokens */}
          <Card
            elevation={0} 
            sx={{
              ...(typeof getStandardCardStyles === 'function' ? getStandardCardStyles() : fallbackStyles),
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ 
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: 2
              }}
            >
              <Tab icon={<QuestionsIcon />} iconPosition="start" label="Questions" />
              <Tab icon={<ResultsIcon />} iconPosition="start" label="Results" />
              <Tab icon={<TokensIcon />} iconPosition="start" label="Tokens" />
            </Tabs>            {/* Questions Tab */}
            <Box hidden={activeTab !== 0} sx={{ p: 2 }}>
              {/* Remove the top button - we're moving it to the bottom */}
              
              {!Array.isArray(interviewDetails.questions) || interviewDetails.questions.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>No questions have been added to this interview.</Alert>
              ) : (
                <List>
                  {interviewDetails.questions.map((question) => (
                    question && question.id ? (
                      <Paper 
                        key={question.id}
                        elevation={0}
                        sx={{ 
                          mb: 2, 
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <ListItem
                          secondaryAction={
                            <IconButton onClick={() => toggleQuestionExpand(question.id)}>
                              {expandedQuestions[question.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          }
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <InfoIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Question ${question.order || '?'}: ${question.text || 'No question text'}`}
                            secondary={`Preparation: ${question.preparation_time || 0}s | Response: ${question.responding_time || 0}s`}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                        <Collapse in={expandedQuestions[question.id]} timeout="auto">
                          <Box sx={{ p: 2, pt: 0, pl: 9, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Preparation Time:</strong> {question.preparation_time || 0} seconds
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Response Time:</strong> {question.responding_time || 0} seconds
                            </Typography>
                          </Box>
                        </Collapse>
                      </Paper>
                    ) : null
                  ))}
                </List>
              )}              <Box sx={{ textAlign: 'center', mt: 2 }}>
                {/* Replaced "Manage Questions" with "Add Question" button */}
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ borderRadius: 2 }}
                >
                  Add Question
                </Button>
              </Box>
            </Box>            {/* Results Tab */}
            <Box hidden={activeTab !== 1} sx={{ p: 2 }}>
              {!Array.isArray(interviewDetails.results) || interviewDetails.results.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>No results available for this interview yet.</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Session</TableCell>
                        <TableCell>Token</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                        <TableCell>Recordings</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interviewDetails.results.map((result) => (
                        <TableRow 
                          key={result.session_id}
                          hover
                          onClick={() => navigate(`/interviewer/interviews/${interviewId}/results/${result.session_id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{result.session_id}</TableCell>
                          <TableCell>
                            <Chip size="small" label={result.token_value && result.token_value.substring(0, 8) + '...'} />
                          </TableCell>
                          <TableCell>{result.start_time && new Date(result.start_time).toLocaleString()}</TableCell>
                          <TableCell>
                            {result.end_time ? new Date(result.end_time).toLocaleString() : 'Incomplete'}
                          </TableCell>
                          <TableCell>{result.recordings?.length || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>              )}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                {/* Button to view all results */}
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate(`/interviewer/interviews/${interviewId}/results`)}
                  sx={{ borderRadius: 2 }}
                >
                  View All Results
                </Button>
              </Box>
            </Box>            {/* Tokens Tab */}
            <Box hidden={activeTab !== 2} sx={{ p: 2 }}>
              {/* Remove the top button - we're moving it to the bottom */}              {!Array.isArray(interviewDetails.tokens) || interviewDetails.tokens.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>No tokens have been generated for this interview.</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: '100%', overflow: 'hidden', mb: 1, borderRadius: 1 }}>
                  <Table size="small"
                    sx={{
                      tableLayout: 'fixed',
                      '& .MuiTableCell-root': {
                        py: 1.5, // Add more vertical padding
                        px: 2    // Add more horizontal padding
                      }
                    }}
                  >
                    <TableHead>                      <TableRow>
                        <TableCell width="30%">Token</TableCell>
                        <TableCell width="15%">Created</TableCell>
                        <TableCell width="15%">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interviewDetails.tokens.map((token) => (
                        <TableRow key={token.token_value}>
                          <TableCell 
                            sx={{ 
                              fontFamily: 'monospace', 
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              maxWidth: '60%',
                              wordBreak: 'break-all',
                              position: 'relative',
                              pr: 5
                            }}
                          >
                            {token.token_value}
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                navigator.clipboard.writeText(token.token_value);
                                setSnackbar({
                                  open: true,
                                  message: 'Token copied to clipboard',
                                  severity: 'success'
                                });
                              }}
                              sx={{ 
                                position: 'releative',
                                right: 1,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'primary.main'
                              }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>{token.created_at && formatDate(token.created_at)}</TableCell>
                          <TableCell>
                            <Chip 
                              size="small" 
                              color={token.is_used ? "default" : "success"}
                              label={token.is_used ? `Used ${token.used_at ? '(' + formatDate(token.used_at) + ')' : ''}` : "Available"}
                              sx={{ 
                                maxWidth: '100%', 
                                '& .MuiChip-label': { 
                                  whiteSpace: 'normal',
                                  overflow: 'visible',
                                  textOverflow: 'clip'
                                }
                              }}
                            />
                          </TableCell>                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}              <Box sx={{ textAlign: 'center', mt: 2 }}>
                {/* Replaced "Manage Tokens" with "Generate Token" button */}
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleGenerateToken}
                  disabled={tokenGenerating}
                  sx={{ borderRadius: 2 }}
                >
                  {tokenGenerating ? 'Generating...' : 'Generate Token'}
                </Button>
              </Box>
            </Box>
          </Card>        </>
      ) : (
        <Alert severity="error">Interview not found</Alert>
      )}
      
      {/* Add Question Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            overflow: 'hidden' 
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 2,
            pt: 3,
            px: 4,
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Add New Question</span>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ p: 1 }}
          >
            <ExpandLessIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Question Text
            </Typography>
            <TextField
              autoFocus
              name="text"
              placeholder="Enter your interview question here..."
              fullWidth
              variant="outlined"
              value={questionData.text}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  Preparation Time
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                  <OutlinedInput
                    id="preparation_time"
                    name="preparation_time"
                    type="number"
                    value={questionData.preparation_time}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, step: 10 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    }
                    sx={{ borderRadius: 2 }}
                  />
                  <FormHelperText>
                    Time in seconds for preparation
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  Response Time
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                  <OutlinedInput
                    id="responding_time"
                    name="responding_time"
                    type="number"
                    value={questionData.responding_time}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, step: 10 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <VideocamIcon fontSize="small" color="action" />
                      </InputAdornment>
                    }
                    sx={{ borderRadius: 2 }}
                  />
                  <FormHelperText>
                    Maximum answering time in seconds
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            px: 4, 
            py: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: 2
          }}
        >
          <Button 
            onClick={handleCloseDialog} 
            color="inherit" 
            variant="outlined"
            size="large"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuestion} 
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            disabled={!questionData.text.trim() || saving}
            size="large"
            sx={{ px: 3 }}
          >
            {saving ? 'Saving...' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          elevation={1}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default InterviewDetails;
