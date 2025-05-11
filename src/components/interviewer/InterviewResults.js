import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Tooltip,
  Button,
  Alert,
  Tabs,
  Tab,
  Divider,
  Rating,
  TextField,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ExpandMore as ExpandMoreIcon,
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Notes as NotesIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

// Import API services
import { interviewAPI } from '../../services/api';

const InterviewResults = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, [interviewId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get interview details
      const interviewResponse = await interviewAPI.getInterview(interviewId);
      setInterview(interviewResponse.data);
      
      // Get results for this interview
      const resultsResponse = await interviewAPI.getInterviewResults(interviewId);
      setResults(resultsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load interview results. Please try again.');
      setLoading(false);
    }
  };

  const handleOpenDetail = async (result) => {
    setCurrentResult(result);
    setDetailDialogOpen(true);
    setActiveTab(0);
    setNotes(result.notes || '');
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setCurrentResult(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDeleteClick = (result) => {
    setResultToDelete(result);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setResultToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!resultToDelete) return;
    
    try {
      await interviewAPI.deleteResult(resultToDelete.id);
      setDeleteConfirmOpen(false);
      setResultToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  const handleStarToggle = async (result) => {
    try {
      await interviewAPI.updateResultStatus(result.id, { isStarred: !result.isStarred });
      fetchData();
    } catch (error) {
      console.error('Error updating result star status:', error);
    }
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSaveNotes = async () => {
    if (!currentResult) return;
    
    try {
      await interviewAPI.updateResultStatus(currentResult.id, { notes });
      // Update the local state
      setResults(results.map(r => 
        r.id === currentResult.id ? { ...r, notes } : r
      ));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (durationMinutes) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} min`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Interview Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {interview ? `Viewing responses for "${interview.title}"` : 'Loading interview details...'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Completion</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  results.map((result) => (
                    <TableRow key={result.id} hover>
                      <TableCell padding="checkbox">
                        <IconButton
                          size="small"
                          onClick={() => handleStarToggle(result)}
                          color={result.isStarred ? "warning" : "default"}
                        >
                          {result.isStarred ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {result.candidateName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Token: {result.token}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(result.completedAt)}</TableCell>
                      <TableCell>{formatDuration(result.duration)}</TableCell>
                      <TableCell>
                        <Rating 
                          value={result.score / 2} 
                          precision={0.5} 
                          readOnly 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={`${result.answeredQuestions}/${result.totalQuestions}`} 
                          color={result.answeredQuestions === result.totalQuestions ? "success" : "primary"} 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDetail(result)}
                            sx={{ mr: 1 }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Result">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(result)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No interview results available yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Result Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetail} maxWidth="lg" fullWidth>
        {currentResult && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {currentResult.candidateName}'s Interview
                </Typography>
                <IconButton
                  onClick={() => handleStarToggle(currentResult)}
                  color={currentResult.isStarred ? "warning" : "default"}
                >
                  {currentResult.isStarred ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Submitted
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(currentResult.completedAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDuration(currentResult.duration)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Score
                    </Typography>
                    <Box>
                      <Rating 
                        value={currentResult.score / 2} 
                        precision={0.5} 
                        readOnly 
                      />
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="result tabs">
                  <Tab 
                    icon={<VideocamIcon fontSize="small" />} 
                    iconPosition="start" 
                    label="Responses" 
                  />
                  <Tab 
                    icon={<ChatIcon fontSize="small" />}
                    iconPosition="start" 
                    label="Transcripts" 
                  />
                  <Tab 
                    icon={<NotesIcon fontSize="small" />}
                    iconPosition="start" 
                    label="Notes" 
                  />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <Box>
                  {currentResult.answers.map((answer, index) => (
                    <Accordion key={answer.questionId} defaultExpanded={index === 0}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${answer.questionId}-content`}
                        id={`panel-${answer.questionId}-header`}
                      >
                        <Typography fontWeight={500}>
                          Q{index + 1}: {answer.questionText}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          {answer.videoUrl ? (
                            <Box component="video" 
                              controls 
                              width="100%" 
                              sx={{ maxHeight: 300, backgroundColor: '#000' }}
                              src={answer.videoUrl}
                            />
                          ) : (
                            <Alert severity="warning">
                              Video recording not available
                            </Alert>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  {currentResult.answers.map((answer, index) => (
                    <Box key={answer.questionId} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Q{index + 1}: {answer.questionText}
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                          {answer.transcription || "No transcription available"}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <TextField
                    label="Interviewer Notes"
                    multiline
                    rows={10}
                    value={notes}
                    onChange={handleNotesChange}
                    variant="outlined"
                    fullWidth
                    placeholder="Add your notes about this candidate..."
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleSaveNotes}>
                      Save Notes
                    </Button>
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {resultToDelete?.candidateName}'s interview result? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InterviewResults;