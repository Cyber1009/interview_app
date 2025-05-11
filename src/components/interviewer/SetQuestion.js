// filepath: c:\Users\yuanz\vsproject\interview_app\src\components\interviewer\SetQuestion.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
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
  ListItemSecondaryAction,
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Import API services
import { questionAPI, interviewAPI } from '../../services/api';

const SetQuestion = () => {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    text: '',
    preparationTime: 60,
    recordingTime: 120,
    interviewId: null
  });

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
    setDeleteConfirmOpen(false);
    setQuestionToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    
    try {
      await questionAPI.deleteQuestion(questionToDelete.id);
      setDeleteConfirmOpen(false);
      setQuestionToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'text' ? value : parseInt(value, 10)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editQuestion) {
        await questionAPI.updateQuestion(editQuestion.id, formData);
      } else {
        await questionAPI.addQuestion({
          ...formData,
          interviewId: interviewId
        });
      }
      
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const reorderedItems = Array.from(questions);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    
    // Update the local state first for immediate feedback
    setQuestions(reorderedItems);
    
    try {
      // Send the updated order to the backend
      await questionAPI.reorderQuestions(
        interviewId, 
        reorderedItems.map(q => q.id)
      );
    } catch (error) {
      console.error('Error updating question order:', error);
      // If there was an error, fetch the data again to reset
      fetchData();
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
          Interview Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {interview ? `Managing questions for "${interview.title}"` : 'Loading interview details...'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Question
        </Button>
      </Box>

      <Card>
        <CardContent>
          {questions.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <List {...provided.droppableProps} ref={provided.innerRef}>
                    {questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                        {(provided) => (
                          <React.Fragment>
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{ 
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                mb: 1,
                                boxShadow: 1
                              }}
                            >
                              <Box {...provided.dragHandleProps} sx={{ mr: 2, cursor: 'grab' }}>
                                <DragIcon color="action" />
                              </Box>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                    {question.text}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    Preparation: {question.preparationTime}s • Recording: {question.recordingTime}s
                                  </Typography>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleEditQuestion(question)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleDeleteClick(question)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < questions.length - 1 && <Box sx={{ my: 1 }} />}
                          </React.Fragment>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No questions added yet. Click "Add Question" to create one.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Question Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Question Text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              required
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Preparation Time (seconds)"
                  name="preparationTime"
                  type="number"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Recording Time (seconds)"
                  name="recordingTime"
                  type="number"
                  value={formData.recordingTime}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{ inputProps: { min: 10 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editQuestion ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this question? This action cannot be undone.
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

export default SetQuestion;