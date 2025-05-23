import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
  Divider,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Updated import to use the consolidated API
import { interviewerAPI } from '../../../api';

/**
 * QuestionManager Component - Reusable component for managing questions in an interview
 * 
 * Features:
 * - List, add, edit, and delete questions
 * - Drag and drop reordering
 * - Question time settings (preparation and response time)
 */
const QuestionManager = ({ 
  interviewId, 
  interviewName,
  questions: initialQuestions = [], 
  loading = false,
  error = null,
  onQuestionsChange = () => {},
  onError = () => {}
}) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    preparation_time: 60,
    responding_time: 120
  });

  // Use interview name (slug) if available, otherwise use ID
  const identifier = interviewName || interviewId;

  // Update local state when props change
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      // Sort questions by order
      const sortedQuestions = [...initialQuestions].sort((a, b) => a.order - b.order);
      setQuestions(sortedQuestions);
    } else {
      setQuestions([]);
    }
  }, [initialQuestions]);

  // Add a new question
  const handleAddQuestion = async () => {
    if (!newQuestion.text.trim()) return;
    
    setIsSaving(true);
    try {
      const questionData = {
        interviewName: interviewName,
        interviewId: interviewId,
        text: newQuestion.text,
        preparation_time: Number(newQuestion.preparation_time) || 60,
        responding_time: Number(newQuestion.responding_time) || 120
      };
      
      const response = await interviewerAPI.addQuestion(questionData);
      
      if (response && response.data) {
        const updatedQuestions = [...questions, response.data];
        setQuestions(updatedQuestions);
        onQuestionsChange(updatedQuestions);
      }
      
      setNewQuestion({
        text: '',
        preparation_time: 60,
        responding_time: 120
      });
      setIsAddingQuestion(false);
    } catch (err) {
      console.error('Failed to add question:', err);
      onError('Failed to add question. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update an existing question
  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editingQuestion.text.trim()) return;
    
    setIsSaving(true);
    try {
      const response = await interviewerAPI.updateQuestion(
        identifier, 
        editingQuestion.id, 
        {
          text: editingQuestion.text,
          preparation_time: Number(editingQuestion.preparation_time) || 60,
          responding_time: Number(editingQuestion.responding_time) || 120
        }
      );
      
      if (response && response.data) {
        const updatedQuestions = questions.map(q => 
          q.id === editingQuestion.id ? response.data : q
        );
        setQuestions(updatedQuestions);
        onQuestionsChange(updatedQuestions);
      }
      
      setEditingQuestion(null);
    } catch (err) {
      console.error('Failed to update question:', err);
      onError('Failed to update question. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (questionId) => {
    setIsSaving(true);
    try {
      await interviewerAPI.deleteQuestion(identifier, questionId);
      
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(updatedQuestions);
      onQuestionsChange(updatedQuestions);
    } catch (err) {
      console.error('Failed to delete question:', err);
      onError('Failed to delete question. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder questions with drag and drop
  const handleDragEnd = async (result) => {
    // Dropped outside the list
    if (!result.destination) return;
    
    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);

    // Update local state immediately for smooth UX
    setQuestions(reorderedQuestions);
    
    // Create array of order updates for the API
    const orderUpdates = reorderedQuestions.map((q, index) => ({
      question_id: q.id,
      new_order: index + 1
    }));
    
    // Save the new order to the server
    try {
      await interviewerAPI.reorderQuestions(identifier, orderUpdates);
      onQuestionsChange(reorderedQuestions);
    } catch (err) {
      console.error('Failed to reorder questions:', err);
      onError('Failed to save the new question order. Please try again.');
    }
  };

  // Start editing a question
  const handleEditQuestion = (question) => {
    setEditingQuestion({ ...question });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Interview Questions
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setIsAddingQuestion(true)}
        >
          Add Question
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {questions.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" color="text.secondary" paragraph>
            No questions added yet. Create your first question to get started.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingQuestion(true)}
          >
            Add First Question
          </Button>
        </Paper>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questionsList">
              {(provided) => (
                <List
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ p: 0 }}
                >
                  {questions.map((question, index) => (
                    <Draggable 
                      key={question.id.toString()} 
                      draggableId={question.id.toString()} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          divider
                          sx={{
                            px: 2,
                            py: 2,
                            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                            '&:last-child': { borderBottom: 0 }
                          }}
                        >
                          <Box 
                            {...provided.dragHandleProps} 
                            sx={{ 
                              mr: 2, 
                              display: 'flex', 
                              alignItems: 'center',
                              color: 'text.secondary'
                            }}
                          >
                            <DragIcon />
                          </Box>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                  component="span" 
                                  variant="body1" 
                                  sx={{ fontWeight: 500 }}
                                >
                                  {index + 1}. {question.text}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  Preparation: {question.preparation_time}s &nbsp;•&nbsp; 
                                  Response: {question.responding_time}s
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Edit question">
                              <IconButton 
                                edge="end" 
                                sx={{ mr: 1 }}
                                onClick={() => handleEditQuestion(question)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete question">
                              <IconButton 
                                edge="end" 
                                color="error"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      )}

      {/* Add Question Dialog */}
      <Dialog 
        open={isAddingQuestion} 
        onClose={() => setIsAddingQuestion(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Question Text"
            multiline
            rows={3}
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            variant="outlined"
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Preparation Time (seconds)"
              value={newQuestion.preparation_time}
              onChange={(e) => setNewQuestion({ 
                ...newQuestion, 
                preparation_time: Math.max(10, parseInt(e.target.value) || 60)
              })}
              InputProps={{ inputProps: { min: 10 } }}
              variant="outlined"
            />
            <TextField
              fullWidth
              type="number"
              label="Response Time (seconds)"
              value={newQuestion.responding_time}
              onChange={(e) => setNewQuestion({ 
                ...newQuestion, 
                responding_time: Math.max(10, parseInt(e.target.value) || 120)
              })}
              InputProps={{ inputProps: { min: 10 } }}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsAddingQuestion(false)}>Cancel</Button>
          <Button 
            onClick={handleAddQuestion} 
            variant="contained" 
            color="primary"
            disabled={!newQuestion.text.trim() || isSaving}
            startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {isSaving ? 'Saving...' : 'Save Question'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog 
        open={Boolean(editingQuestion)} 
        onClose={() => setEditingQuestion(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editingQuestion && (
            <>
              <TextField
                autoFocus
                fullWidth
                label="Question Text"
                multiline
                rows={3}
                value={editingQuestion.text}
                onChange={(e) => setEditingQuestion({ 
                  ...editingQuestion, 
                  text: e.target.value 
                })}
                variant="outlined"
                margin="normal"
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Preparation Time (seconds)"
                  value={editingQuestion.preparation_time}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    preparation_time: Math.max(10, parseInt(e.target.value) || 60)
                  })}
                  InputProps={{ inputProps: { min: 10 } }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Response Time (seconds)"
                  value={editingQuestion.responding_time}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    responding_time: Math.max(10, parseInt(e.target.value) || 120)
                  })}
                  InputProps={{ inputProps: { min: 10 } }}
                  variant="outlined"
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditingQuestion(null)}>Cancel</Button>
          <Button 
            onClick={handleUpdateQuestion} 
            variant="contained" 
            color="primary"
            disabled={!editingQuestion || !editingQuestion.text.trim() || isSaving}
            startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {isSaving ? 'Saving...' : 'Update Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionManager;