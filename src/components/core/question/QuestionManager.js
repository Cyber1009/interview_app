import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CardContent,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Grid,
  Paper,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragHandleIcon,
  QuestionAnswer as QuestionIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';

// Import API services
import { questionAPI, interviewAPI } from '../../../services/api';

/**
 * QuestionManager Component
 * 
 * A shared component for managing interview questions.
 * Can be used by both admin and interviewer interfaces.
 * 
 * @param {Object} props
 * @param {string} props.role - Role of the current user ('admin' or 'interviewer')
 * @param {string} props.interviewId - ID of the interview whose questions are being managed
 * @param {boolean} props.readOnly - Whether the question list is read-only
 */
const QuestionManager = ({ 
  role = 'interviewer', 
  interviewIdProp, 
  readOnly = false 
}) => {
  const theme = useTheme();
  const [questions, setQuestions] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const { interviewId: interviewIdParam } = useParams();
  
  // Use prop interviewId if provided, otherwise use the one from URL params
  const interviewId = interviewIdProp || interviewIdParam;
  
  const [formData, setFormData] = useState({
    text: '',
    preparationTime: 60,
    recordingTime: 120,
    interviewId: null
  });

  useEffect(() => {
    if (interviewId) {
      fetchData();
    }
  }, [interviewId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get interview details
      const interviewResponse = await interviewAPI.getInterview(interviewId);
      setInterview(interviewResponse.data);
      
      // Get questions for this interview
      const questionsResponse = await questionAPI.getQuestionsByInterview(interviewId);
      const sortedQuestions = [...questionsResponse.data].sort((a, b) => a.order - b.order);
      setQuestions(sortedQuestions);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load questions. Please try again.');
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      text: '',
      preparationTime: 60,
      recordingTime: 120,
      interviewId: interviewId
    });
    setEditQuestion(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditQuestion = (question) => {
    setFormData({
      text: question.text,
      preparationTime: question.preparationTime,
      recordingTime: question.recordingTime,
      interviewId: interviewId
    });
    setEditQuestion(question);
    setOpenDialog(true);
  };

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setQuestionToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    
    try {
      await questionAPI.deleteQuestion(questionToDelete.id);
      // Refresh questions after deletion
      fetchData();
      setDeleteConfirmOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error('Error deleting question:', error);
      // Show error notification
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'text' ? value : parseInt(value, 10)
    });
  };

  const handleSaveQuestion = async (event) => {
    event.preventDefault();
    
    try {
      if (editQuestion) {
        // Update existing question
        await questionAPI.updateQuestion(editQuestion.id, formData);
      } else {
        // Create new question
        await questionAPI.createQuestion(formData);
      }
      
      handleCloseDialog();
      fetchData(); // Refresh the questions list
    } catch (error) {
      console.error('Error saving question:', error);
      // Show error notification
    }
  };
  
  // Handle drag and drop reordering
  const onDragEnd = async (result) => {
    if (readOnly) return; // Don't allow reordering in read-only mode
    
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    const reorderedQuestions = reorder(
      questions,
      result.source.index,
      result.destination.index
    );
    
    setQuestions(reorderedQuestions);
    
    try {
      // Update the order in the backend
      const updates = reorderedQuestions.map((question, index) => ({
        id: question.id,
        order: index
      }));
      
      await questionAPI.updateQuestionOrder(updates);
    } catch (error) {
      console.error('Error updating question order:', error);
      // Show error notification
      fetchData(); // Revert to original order
    }
  };
  
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 4
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '0.01em',
              color: 'text.primary'
            }}>
              Questions for {interview?.title || 'Interview'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {interview?.description ? interview.description : 'Manage your interview questions here.'}
            </Typography>
          </Box>
          {!readOnly && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ py: 1, px: 3 }}
            >
              Add Question
            </Button>
          )}
        </Box>
      
        {questions.length === 0 ? (
          <Paper elevation={0} sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'background.default'
          }}>
            <QuestionIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              No Questions Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
              This interview doesn't have any questions yet.
              {!readOnly && " Add your first question to get started."}
            </Typography>
            {!readOnly && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{ mt: 1 }}
              >
                Add First Question
              </Button>
            )}
          </Paper>
        ) : (
          <DragDropContext onDragEnd={readOnly ? () => {} : onDragEnd}>
            <Droppable droppableId="questions-list">
              {(provided) => (
                <List 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ 
                    py: 0,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden'
                  }}
                  disablePadding
                >
                  {questions.map((question, index) => (
                    <Draggable 
                      key={question.id} 
                      draggableId={`q-${question.id}`} 
                      index={index}
                      isDragDisabled={readOnly}
                    >
                      {(provided) => (
                        <React.Fragment>
                          {index > 0 && <Divider />}
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            secondaryAction={
                              !readOnly ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Tooltip title="Edit Question">
                                    <IconButton 
                                      edge="end" 
                                      onClick={() => handleEditQuestion(question)}
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Question">
                                    <IconButton 
                                      edge="end" 
                                      onClick={() => handleDeleteClick(question)}
                                      size="small"
                                      color="error"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ) : null
                            }
                            sx={{ 
                              py: 1.5,
                              px: 2,
                              bgcolor: 'background.paper',
                              '&:hover': {
                                bgcolor: 'background.default',
                              }
                            }}
                          >
                            <ListItemIcon {...provided.dragHandleProps} sx={{ cursor: readOnly ? 'default' : 'grab' }}>
                              <DragHandleIcon color={readOnly ? "disabled" : "action"} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Chip 
                                    label={`Q${index + 1}`} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                    sx={{ mr: 2, fontWeight: 600 }}
                                  />
                                  <Typography sx={{ fontWeight: 500 }}>
                                    {question.text}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                  <Chip 
                                    size="small" 
                                    label={`Preparation: ${question.preparationTime}s`} 
                                    icon={<AccessTimeIcon fontSize="small" />} 
                                    variant="outlined"
                                  />
                                  <Chip 
                                    size="small" 
                                    label={`Response: ${question.recordingTime}s`} 
                                    icon={<VideocamIcon fontSize="small" />} 
                                    variant="outlined"
                                  />
                                </Box>
                              }
                              primaryTypographyProps={{ component: 'div' }}
                              secondaryTypographyProps={{ component: 'div' }}
                            />
                          </ListItem>
                        </React.Fragment>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Paper>

      {!readOnly && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.info.main, 0.05)
        }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'info.main' }}>
            <InfoIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'text-bottom' }} />
            Tips for Creating Effective Interview Questions
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Be clear and specific with your questions to get focused answers.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Provide adequate preparation time for complex technical questions.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              For behavioral questions, allow more response time (2-3 minutes).
            </Typography>
            <Typography component="li" variant="body2">
              Arrange questions in a logical sequence, from easier to more challenging.
            </Typography>
          </Box>
        </Paper>
      )}
      
      {/* Question Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <form onSubmit={handleSaveQuestion}>
            <TextField
              autoFocus
              margin="dense"
              id="text"
              name="text"
              label="Question Text"
              fullWidth
              variant="outlined"
              value={formData.text}
              onChange={handleFormChange}
              multiline
              rows={3}
              required
              sx={{ mb: 3 }}
            />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="preparationTime">Preparation Time (seconds)</InputLabel>
                  <OutlinedInput
                    id="preparationTime"
                    name="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={handleFormChange}
                    label="Preparation Time (seconds)"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" />
                      </InputAdornment>
                    }
                    inputProps={{
                      min: 0,
                      step: 10
                    }}
                  />
                  <FormHelperText>
                    Time for candidate to prepare before answering
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="recordingTime">Recording Time (seconds)</InputLabel>
                  <OutlinedInput
                    id="recordingTime"
                    name="recordingTime"
                    type="number"
                    value={formData.recordingTime}
                    onChange={handleFormChange}
                    label="Recording Time (seconds)"
                    startAdornment={
                      <InputAdornment position="start">
                        <VideocamIcon fontSize="small" />
                      </InputAdornment>
                    }
                    inputProps={{
                      min: 0,
                      step: 10
                    }}
                  />
                  <FormHelperText>
                    Maximum time allowed for the answer
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuestion} 
            variant="contained"
            startIcon={editQuestion ? <SaveIcon /> : <AddIcon />}
            disabled={!formData.text.trim()}
          >
            {editQuestion ? 'Save Changes' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
            <WarningIcon sx={{ mr: 1 }} />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this question? This action cannot be undone.
          </Typography>
          {questionToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                "{questionToDelete.text}"
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel} color="inherit" variant="outlined">
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

export default QuestionManager;