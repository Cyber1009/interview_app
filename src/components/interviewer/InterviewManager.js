import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  Tooltip,
  MenuItem,
  Menu,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreIcon,
  QuestionAnswer as QuestionIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// This component would be used to manage interviews and their questions
const InterviewManager = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([
    { 
      id: 1, 
      name: 'Frontend Developer', 
      description: 'Interview for senior frontend developer position',
      questions: [
        { id: 1, text: 'What is your experience with React?', preparationTime: 30, recordingTime: 120 },
        { id: 2, text: 'Explain CSS flexbox and grid', preparationTime: 30, recordingTime: 120 },
        { id: 3, text: 'How would you optimize a web application?', preparationTime: 30, recordingTime: 120 },
      ],
      candidates: 5,
      completed: 2,
      createdAt: '2025-04-01'
    },
    { 
      id: 2, 
      name: 'UX Designer', 
      description: 'Interview for mid-level UX designer position',
      questions: [
        { id: 4, text: 'Describe your design process', preparationTime: 30, recordingTime: 120 },
        { id: 5, text: 'How do you handle user feedback?', preparationTime: 30, recordingTime: 120 },
      ],
      candidates: 8,
      completed: 4,
      createdAt: '2025-04-10'
    },
    { 
      id: 3, 
      name: 'Product Manager', 
      description: 'Interview for senior product manager position',
      questions: [
        { id: 6, text: 'How do you prioritize features?', preparationTime: 30, recordingTime: 120 },
        { id: 7, text: 'Describe a product you launched', preparationTime: 30, recordingTime: 120 },
        { id: 8, text: 'How do you work with engineers?', preparationTime: 30, recordingTime: 120 },
      ],
      candidates: 3,
      completed: 1,
      createdAt: '2025-04-15'
    }
  ]);
  
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isCreatingInterview, setIsCreatingInterview] = useState(false);
  const [newInterview, setNewInterview] = useState({ name: '', description: '', questions: [] });
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentInterviewMenuId, setCurrentInterviewMenuId] = useState(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', preparationTime: 30, recordingTime: 120 });

  useEffect(() => {
    if (interviewId) {
      const interview = interviews.find(i => i.id === parseInt(interviewId));
      if (interview) {
        setSelectedInterview(interview);
      }
    }
  }, [interviewId, interviews]);

  const handleMenuOpen = (event, interviewId) => {
    setAnchorEl(event.currentTarget);
    setCurrentInterviewMenuId(interviewId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentInterviewMenuId(null);
  };

  const handleCreateInterview = () => {
    setIsCreatingInterview(true);
  };

  const handleSaveInterview = () => {
    if (!newInterview.name.trim()) return;
    
    const newId = Math.max(...interviews.map(i => i.id), 0) + 1;
    
    setInterviews([...interviews, {
      id: newId,
      ...newInterview,
      candidates: 0,
      completed: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    
    setNewInterview({ name: '', description: '', questions: [] });
    setIsCreatingInterview(false);
    navigate(`/interviewer/interviews/${newId}`);
  };

  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.text.trim() || !selectedInterview) return;
    
    const newId = Math.max(...selectedInterview.questions.map(q => q.id), 0) + 1;
    const updatedQuestions = [
      ...selectedInterview.questions, 
      { ...newQuestion, id: newId }
    ];
    
    // Update interview with new question
    const updatedInterviews = interviews.map(interview => 
      interview.id === selectedInterview.id 
        ? { ...interview, questions: updatedQuestions }
        : interview
    );
    
    setInterviews(updatedInterviews);
    setSelectedInterview({ ...selectedInterview, questions: updatedQuestions });
    setNewQuestion({ text: '', preparationTime: 30, recordingTime: 120 });
    setIsAddingQuestion(false);
  };

  const handleDeleteQuestion = (questionId) => {
    if (!selectedInterview) return;
    
    const updatedQuestions = selectedInterview.questions.filter(q => q.id !== questionId);
    
    // Update interview with filtered questions
    const updatedInterviews = interviews.map(interview => 
      interview.id === selectedInterview.id 
        ? { ...interview, questions: updatedQuestions }
        : interview
    );
    
    setInterviews(updatedInterviews);
    setSelectedInterview({ ...selectedInterview, questions: updatedQuestions });
  };

  const handleDeleteInterview = (id) => {
    setInterviews(interviews.filter(interview => interview.id !== id));
    handleMenuClose();
    
    if (selectedInterview && selectedInterview.id === id) {
      setSelectedInterview(null);
      navigate('/interviewer/interviews');
    }
  };

  const handleCopyInterview = (id) => {
    const interviewToCopy = interviews.find(interview => interview.id === id);
    if (!interviewToCopy) return;

    const newId = Math.max(...interviews.map(i => i.id), 0) + 1;
    const copiedInterview = {
      ...interviewToCopy,
      id: newId,
      name: `${interviewToCopy.name} (Copy)`,
      candidates: 0,
      completed: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInterviews([...interviews, copiedInterview]);
    handleMenuClose();
    navigate(`/interviewer/interviews/${newId}`);
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderInterviewsList = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '0.01em',
            color: 'text.primary'
          }}>
            Interview Templates
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateInterview}
          >
            Create Template
          </Button>
        </Box>

        <Grid container spacing={3}>
          {interviews.map(interview => (
            <Grid item xs={12} md={6} lg={4} key={interview.id}>
              <Card 
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  },
                  position: 'relative'
                }}
              >
                <CardContent sx={{ pb: 3 }} onClick={() => navigate(`/interviewer/interviews/${interview.id}`)}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {interview.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {interview.description || 'No description provided'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                    <QuestionIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.questions.length} questions
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {interview.candidates} candidates
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Created: {interview.createdAt}
                    </Typography>
                  </Box>
                </CardContent>
                
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={(e) => handleMenuOpen(e, interview.id)}
                >
                  <MoreIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            navigate(`/interviewer/interviews/${currentInterviewMenuId}`);
          }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleCopyInterview(currentInterviewMenuId)}>
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDeleteInterview(currentInterviewMenuId)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Create Interview Dialog */}
        <Dialog open={isCreatingInterview} onClose={() => setIsCreatingInterview(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Interview Template</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Interview Name"
              fullWidth
              variant="outlined"
              value={newInterview.name}
              onChange={(e) => setNewInterview({ ...newInterview, name: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newInterview.description}
              onChange={(e) => setNewInterview({ ...newInterview, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreatingInterview(false)}>Cancel</Button>
            <Button onClick={handleSaveInterview} variant="contained" disabled={!newInterview.name.trim()}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderInterviewDetail = () => {
    if (!selectedInterview) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '0.01em',
              color: 'text.primary'
            }}>
              {selectedInterview.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedInterview.description || 'No description provided'}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/interviewer/interviews')}
          >
            Back to All Interviews
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleChangeTab} aria-label="interview details tabs">
            <Tab label="Questions" icon={<QuestionIcon />} iconPosition="start" />
            <Tab label="Candidates" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Access Links" icon={<LinkIcon />} iconPosition="start" />
            <Tab label="Results" icon={<ViewListIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Question List</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddQuestion}
                size="small"
              >
                Add Question
              </Button>
            </Box>

            <Paper 
              elevation={0}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              {selectedInterview.questions.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No questions added yet. Click "Add Question" to create your first question.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {selectedInterview.questions.map((question, index) => (
                    <React.Fragment key={question.id}>
                      {index > 0 && <Divider />}
                      <ListItem 
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleDeleteQuestion(question.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 500 }}>
                              {`Q${index + 1}: ${question.text}`}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Chip 
                                size="small" 
                                label={`Prep: ${question.preparationTime}s`} 
                                variant="outlined"
                              />
                              <Chip 
                                size="small" 
                                label={`Record: ${question.recordingTime}s`} 
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
            
            {/* Add Question Dialog */}
            <Dialog open={isAddingQuestion} onClose={() => setIsAddingQuestion(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Question Text"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  sx={{ mb: 2, mt: 1 }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      type="number"
                      margin="dense"
                      label="Preparation Time (seconds)"
                      fullWidth
                      variant="outlined"
                      value={newQuestion.preparationTime}
                      onChange={(e) => setNewQuestion({ 
                        ...newQuestion, 
                        preparationTime: parseInt(e.target.value) || 0 
                      })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="number"
                      margin="dense"
                      label="Recording Time (seconds)"
                      fullWidth
                      variant="outlined"
                      value={newQuestion.recordingTime}
                      onChange={(e) => setNewQuestion({ 
                        ...newQuestion, 
                        recordingTime: parseInt(e.target.value) || 0 
                      })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsAddingQuestion(false)}>Cancel</Button>
                <Button onClick={handleSaveQuestion} variant="contained" disabled={!newQuestion.text.trim()}>
                  Add Question
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Candidates</Typography>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography color="text.secondary">
                {selectedInterview.candidates > 0 
                  ? `${selectedInterview.candidates} candidates assigned to this interview`
                  : 'No candidates assigned to this interview yet'
                }
              </Typography>
            </Paper>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Access Links</Typography>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center' 
              }}
            >
              <Typography color="text.secondary">
                Access tokens management will be displayed here
              </Typography>
            </Paper>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Results</Typography>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography color="text.secondary">
                {selectedInterview.completed > 0 
                  ? `${selectedInterview.completed} completed interviews`
                  : 'No completed interviews yet'
                }
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {selectedInterview ? renderInterviewDetail() : renderInterviewsList()}
    </Box>
  );
};

export default InterviewManager;