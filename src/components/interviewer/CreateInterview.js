/**
 * Create Interview Component
 * Provides:
 * - Interview creation form
 * - Question selection and ordering
 * - Interview configuration
 * - Token generation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, Box, Button,
  TextField, Card, CardContent, CardHeader, Divider,
  List, ListItem, ListItemText, ListItemIcon, IconButton,
  Stepper, Step, StepLabel, StepContent, Alert,
  FormControl, InputLabel, MenuItem, Select, Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as BackIcon,
  QuestionAnswer as QuestionIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { InterviewService } from '../../services';

const CreateInterview = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [interview, setInterview] = useState({
    title: '',
    description: '',
    selectedQuestions: [],
    tokenCount: 1
  });
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available questions
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from your API
        const questions = [
          { id: 1, text: "Tell me about yourself", preparation_time: 30, responding_time: 60 },
          { id: 2, text: "What are your strengths and weaknesses?", preparation_time: 30, responding_time: 60 },
          { id: 3, text: "Why do you want to work for our company?", preparation_time: 30, responding_time: 60 },
          { id: 4, text: "Where do you see yourself in 5 years?", preparation_time: 30, responding_time: 60 },
          { id: 5, text: "Describe a challenging situation and how you handled it", preparation_time: 30, responding_time: 90 }
        ];
        setAvailableQuestions(questions);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterview((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = (question) => {
    setInterview((prev) => ({
      ...prev,
      selectedQuestions: [...prev.selectedQuestions, question]
    }));
    setAvailableQuestions((prev) => prev.filter(q => q.id !== question.id));
  };

  const handleRemoveQuestion = (questionId) => {
    const removedQuestion = interview.selectedQuestions.find(q => q.id === questionId);
    setInterview((prev) => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.filter(q => q.id !== questionId)
    }));
    
    if (removedQuestion) {
      setAvailableQuestions((prev) => [...prev, removedQuestion].sort((a, b) => a.id - b.id));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(interview.selectedQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setInterview((prev) => ({
      ...prev,
      selectedQuestions: items
    }));
  };

  const handleCreateInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would call your API through the InterviewService
      // await InterviewService.create({
      //   title: interview.title,
      //   description: interview.description,
      //   questions: interview.selectedQuestions.map((q, index) => ({ 
      //     id: q.id, 
      //     order: index 
      //   }))
      // });

      // Success feedback
      setSuccess(true);
      setLoading(false);
      
      // Navigate to the next step
      setTimeout(() => {
        setActiveStep(3);
      }, 1000);
    } catch (err) {
      setError("Failed to create interview. Please try again.");
      setLoading(false);
    }
  };

  const steps = [
    {
      label: 'Basic Information',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Interview Title"
                name="title"
                value={interview.title}
                onChange={handleInputChange}
                placeholder="e.g., Frontend Developer Interview"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (Optional)"
                name="description"
                value={interview.description}
                onChange={handleInputChange}
                placeholder="Brief description of the interview purpose and expectations"
              />
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Select Questions',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Available Questions */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Available Questions
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, height: 400, overflow: 'auto' }}>
                <List dense>
                  {availableQuestions.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="No more questions available" 
                        secondary="You've added all available questions to your interview"
                        primaryTypographyProps={{ color: 'text.secondary' }}
                      />
                    </ListItem>
                  ) : availableQuestions.map((question) => (
                    <ListItem 
                      key={question.id} 
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => handleAddQuestion(question)}
                          size="small"
                          color="primary"
                        >
                          <AddIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <QuestionIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={question.text} 
                        secondary={`Prep: ${question.preparation_time}s | Answer: ${question.responding_time}s`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            {/* Selected Questions */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Selected Questions (Drag to Reorder)
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, height: 400, overflow: 'auto' }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="selected-questions">
                    {(provided) => (
                      <List
                        dense
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {interview.selectedQuestions.length === 0 ? (
                          <ListItem>
                            <ListItemText 
                              primary="No questions selected" 
                              secondary="Add questions from the available list"
                              primaryTypographyProps={{ color: 'text.secondary' }}
                            />
                          </ListItem>
                        ) : interview.selectedQuestions.map((question, index) => (
                          <Draggable key={question.id} draggableId={`question-${question.id}`} index={index}>
                            {(provided) => (
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    onClick={() => handleRemoveQuestion(question.id)}
                                    size="small"
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemIcon {...provided.dragHandleProps}>
                                  <DragIcon />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={`${index + 1}. ${question.text}`} 
                                  secondary={`Prep: ${question.preparation_time}s | Answer: ${question.responding_time}s`}
                                />
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
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Interview Configuration',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Configure any additional settings for your interview here.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="token-count-label">Number of Access Tokens</InputLabel>
                <Select
                  labelId="token-count-label"
                  name="tokenCount"
                  value={interview.tokenCount}
                  label="Number of Access Tokens"
                  onChange={handleInputChange}
                >
                  {[1, 5, 10, 20, 50, 100].map((count) => (
                    <MenuItem key={count} value={count}>{count}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Review</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">
                <strong>Title:</strong> {interview.title}
              </Typography>
              {interview.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Description:</strong> {interview.description}
                </Typography>
              )}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Questions:</strong> {interview.selectedQuestions.length}
              </Typography>
              <Box sx={{ mt: 1, mb: 2 }}>
                {interview.selectedQuestions.map((q, index) => (
                  <Chip 
                    key={q.id}
                    label={`Q${index + 1}: ${q.text.substring(0, 20)}${q.text.length > 20 ? '...' : ''}`}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Access Tokens:</strong> {interview.tokenCount}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Complete',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Interview "{interview.title}" has been created successfully!
          </Alert>
          <Typography variant="body1" paragraph>
            Your interview has been created and is now available for candidates.
          </Typography>
          <Typography variant="body1" paragraph>
            You can generate access tokens from the interview details page.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<QuestionIcon />}
              onClick={() => navigate('/interviewer/interviews')}
            >
              View All Interviews
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/interviewer/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  const isStepValid = () => {
    if (activeStep === 0) {
      return interview.title.trim() !== '';
    }
    if (activeStep === 1) {
      return interview.selectedQuestions.length > 0;
    }
    return true;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Interview
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.content}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    {activeStep !== steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={activeStep === 2 ? handleCreateInterview : handleNext}
                        disabled={!isStepValid() || loading}
                        endIcon={activeStep === 2 ? <SaveIcon /> : <NextIcon />}
                        sx={{ mr: 1 }}
                      >
                        {activeStep === 2 ? 'Create Interview' : 'Continue'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => navigate('/interviewer/dashboard')}
                        sx={{ mr: 1 }}
                      >
                        Finish
                      </Button>
                    )}
                    
                    {activeStep !== steps.length - 1 && activeStep > 0 && (
                      <Button
                        onClick={handleBack}
                        startIcon={<BackIcon />}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                    )}
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Interview created successfully!
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default CreateInterview;