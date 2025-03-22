import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, 
  IconButton, Paper, Grid, Card, CardHeader, CardContent
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add as AddIcon, Delete as DeleteIcon, 
  KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon,
  AccessTime, Videocam 
} from '@mui/icons-material';

const SetQuestion = () => {
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('interviewQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const newId = Math.max(...questions.map(q => q.id), 0) + 1;
      const updatedQuestions = [...questions, { 
        id: newId, 
        text: newQuestion.trim(), 
        preparationTime: 60,
        recordingTime: 180 
      }];
      setQuestions(updatedQuestions);
      localStorage.setItem('interviewQuestions', JSON.stringify(updatedQuestions));
      setNewQuestion('');
    }
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem('interviewQuestions', JSON.stringify(updatedQuestions));
  };

  const moveQuestion = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === questions.length - 1)) return;

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap questions
    [newQuestions[index], newQuestions[targetIndex]] = 
    [newQuestions[targetIndex], newQuestions[index]];
    
    setQuestions(newQuestions);
    localStorage.setItem('interviewQuestions', JSON.stringify(newQuestions));
  };

  const handleUpdateTiming = (id, field, value) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, [field]: parseInt(value) || 0 } : q
    );
    setQuestions(updatedQuestions);
    localStorage.setItem('interviewQuestions', JSON.stringify(updatedQuestions));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',  // Update page title font size
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Interview Questions
      </Typography>

      {/* Add Question Form */}
      <Card elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 3 
      }}>
        <CardHeader 
          title="Add New Question"
          sx={{
            p: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
            '& .MuiCardHeader-title': {
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }
          }}
        />
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                label="Question Text"
                multiline
                rows={2}
                sx={{ 
                  bgcolor: 'background.default',
                  '& .MuiInputBase-input': {
                    fontSize: '0.9375rem',
                    letterSpacing: '0.01em'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9375rem',
                    letterSpacing: '0.01em'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Preparation Time"
                defaultValue={60}
                InputProps={{
                  endAdornment: <Box sx={{ color: 'text.secondary', ml: 1 }}>sec</Box>
                }}
                sx={{ bgcolor: 'background.default' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Recording Time"
                defaultValue={180}
                InputProps={{
                  endAdornment: <Box sx={{ color: 'text.secondary', ml: 1 }}>sec</Box>
                }}
                sx={{ bgcolor: 'background.default' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddQuestion}
                startIcon={<AddIcon />}
                sx={{ 
                  height: 48, 
                  px: 3,
                  fontSize: '0.9375rem',
                  letterSpacing: '0.01em',
                  fontWeight: 500
                }}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Question List */}
      <Card elevation={0} sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}>
        <CardHeader 
          title="Question List"
          sx={{
            p: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
            '& .MuiCardHeader-title': {
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }
          }}
        />
        <CardContent sx={{ p: 2.5 }}>
          <List sx={{ '& > :not(:last-child)': { mb: 2 } }}>
            {questions.map((question, index) => (
              <Paper 
                key={question.id} 
                elevation={0} 
                sx={{ 
                  mb: 2, 
                  p: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = questions.map(q =>
                          q.id === question.id ? { ...q, text: e.target.value } : q
                        );
                        setQuestions(updatedQuestions);
                        localStorage.setItem('interviewQuestions', JSON.stringify(updatedQuestions));
                      }}
                      multiline
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Prep Time"
                      value={question.preparationTime}
                      onChange={(e) => handleUpdateTiming(question.id, 'preparationTime', e.target.value)}
                      InputProps={{
                        endAdornment: <Box sx={{ color: 'text.secondary', ml: 1 }}>sec</Box>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Record Time"
                      value={question.recordingTime}
                      onChange={(e) => handleUpdateTiming(question.id, 'recordingTime', e.target.value)}
                      InputProps={{
                        endAdornment: <Box sx={{ color: 'text.secondary', ml: 1 }}>sec</Box>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}>
                    <IconButton 
                      onClick={() => moveQuestion(index, 'up')} 
                      disabled={index === 0}
                      size="small"
                      sx={{ 
                        color: 'action.active',
                        '&:disabled': { color: 'action.disabled' }
                      }}
                    >
                      <UpIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => moveQuestion(index, 'down')} 
                      disabled={index === questions.length - 1}
                      size="small"
                      sx={{ 
                        color: 'action.active',
                        '&:disabled': { color: 'action.disabled' }
                      }}
                    >
                      <DownIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteQuestion(question.id)} 
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SetQuestion;
