import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { generateToken, cleanExpiredTokens } from '../../utils/tokenGenerator';

function AdminPanel({ onThemeChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('interviewQuestions');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        text: "Practice: Describe your favorite hobby.", 
        preparationTime: 60, 
        recordingTime: 180,
        isPractice: true 
      },
      { 
        id: 2, 
        text: "Tell us about yourself and your background.", 
        preparationTime: 60, 
        recordingTime: 180,
        isPractice: false 
      },
      { id: 3, text: "What are your key strengths and areas for improvement?", preparationTime: 60, recordingTime: 180, isPractice: false },
      { id: 4, text: "Why are you interested in this position?", preparationTime: 60, recordingTime: 180, isPractice: false },
      { id: 5, text: "Where do you see yourself in five years?", preparationTime: 60, recordingTime: 180, isPractice: false },
    ];
  });

  const [newQuestion, setNewQuestion] = useState('');
  const [themeColors, setThemeColors] = useState(() => {
    const savedTheme = localStorage.getItem('interviewTheme');
    const parsedTheme = savedTheme ? JSON.parse(savedTheme) : {};
    return {
      primary: parsedTheme?.palette?.primary?.main || '#2196F3',
      secondary: parsedTheme?.palette?.secondary?.main || '#FE6B8B',
      background: parsedTheme?.palette?.background?.default || '#f5f5f5',
      text: parsedTheme?.palette?.text?.primary || '#333333',
    };
  });

  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('interviewTokens');
    return savedTokens ? JSON.parse(savedTokens) : [];
  });

  // Add token cleanup on component mount
  useEffect(() => {
    const savedTokens = JSON.parse(localStorage.getItem('interviewTokens') || '[]');
    const validTokens = cleanExpiredTokens(savedTokens);
    if (validTokens.length !== savedTokens.length) {
        setTokens(validTokens);
        localStorage.setItem('interviewTokens', JSON.stringify(validTokens));
    }
  }, []);

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

  const handleTimeChange = (id, type, newTime) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { 
        ...q, 
        [type]: Math.max(1, Math.min(type === 'recordingTime' ? 600 : 300, parseInt(newTime) || 1))
      } : q
    );
    setQuestions(updatedQuestions);
    localStorage.setItem('interviewQuestions', JSON.stringify(updatedQuestions));
  };

  const handleThemeChange = (color, type) => {
    const updatedColors = { ...themeColors, [type]: color };
    setThemeColors(updatedColors);
    
    const themeUpdate = createTheme({
      palette: {
        primary: { 
          main: updatedColors.primary,
          light: `${updatedColors.primary}80`, // 80 for 50% opacity
          dark: updatedColors.primary
        },
        secondary: { 
          main: updatedColors.secondary,
          light: `${updatedColors.secondary}80`,
          dark: updatedColors.secondary
        },
        background: { 
          default: updatedColors.background,
          paper: '#ffffff'
        },
        text: { 
          primary: updatedColors.text,
          secondary: '#637381'
        }
      },
      spacing: 8, // Add this line
      shape: { borderRadius: 8 },
      typography: {
        fontFamily: '"Segoe UI", "Inter", sans-serif',
        button: { textTransform: 'none' }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '8px 16px',
            }
          }
        }
      }
    });
    
    onThemeChange(themeUpdate);
  };

  // Update the theme preview button styles
  const previewButtonSx = {
    mt: 2,
    bgcolor: themeColors.primary,
    '&:hover': {
      transform: 'translateY(-2px)',
      bgcolor: themeColors.primary,
      filter: 'brightness(0.9)'
    }
  };

  const handleGenerateToken = () => {
    const newTokenData = generateToken();
    const updatedTokens = [...tokens, newTokenData];
    setTokens(updatedTokens);
    localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
  };

  // Add bulk token generation
  const handleBulkGenerateTokens = (count) => {
    const newTokens = Array.from({ length: count }, () => generateToken());
    const updatedTokens = [...tokens, ...newTokens];
    setTokens(updatedTokens);
    localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
  };

  const handleDeleteToken = (tokenToDelete) => {
    const updatedTokens = tokens.filter(t => t.token !== tokenToDelete);
    setTokens(updatedTokens);
    localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
  };

  const moveQuestion = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === questions.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
    localStorage.setItem('interviewQuestions', JSON.stringify(newQuestions));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ 
          p: 3,
          mb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: (theme) => theme.palette.background.default
        }}>
          <Typography variant="h4" gutterBottom color="primary">
            Interview Admin Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage interview questions, appearance, and access tokens
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            px: 3,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              minHeight: 48
            }
          }}
        >
          <Tab label="Questions" />
          <Tab label="Theme Settings" />
          <Tab label="Access Tokens" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  label="New Question"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={handleAddQuestion}
                  startIcon={<AddIcon />}
                  sx={{ px: 4 }}
                >
                  Add
                </Button>
              </Box>

              <List sx={{ width: '100%' }}>
                {questions.map((question, index) => (
                  <ListItem
                    key={question.id}
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                      >
                        <UpIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === questions.length - 1}
                      >
                        <DownIcon />
                      </IconButton>
                    </Box>
                    <Typography sx={{ flex: 1 }}>{question.text}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          Prep time:
                        </Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={question.preparationTime}
                          onChange={(e) => handleTimeChange(question.id, 'preparationTime', e.target.value)}
                          InputProps={{
                            endAdornment: <Typography variant="body2">sec</Typography>,
                            inputProps: { min: 1, max: 300 }
                          }}
                          sx={{ width: 90 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          Record time:
                        </Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={question.recordingTime}
                          onChange={(e) => handleTimeChange(question.id, 'recordingTime', e.target.value)}
                          InputProps={{
                            endAdornment: <Typography variant="body2">sec</Typography>,
                            inputProps: { min: 1, max: 600 }
                          }}
                          sx={{ width: 90 }}
                        />
                      </Box>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteQuestion(question.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                display: 'grid', 
                gap: 3,
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
              }}>
                {Object.entries(themeColors).map(([key, value]) => (
                  <Box key={key}>
                    <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                      {key} Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        type="color"
                        value={value}
                        onChange={(e) => handleThemeChange(e.target.value, key)}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Theme Preview
                </Typography>
                <Box sx={{ 
                  bgcolor: themeColors.background,
                  p: 3,
                  borderRadius: 1,
                  minHeight: 200
                }}>
                  <Typography sx={{ color: themeColors.text }}>
                    Sample Question Text
                  </Typography>
                  <Button
                    variant="contained"
                    sx={previewButtonSx}
                  >
                    Primary Button
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Interview Tokens
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleGenerateToken}
                  sx={{ px: 4 }}
                >
                  Generate New Token
                </Button>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Active Tokens:
                </Typography>
                <List>
                  {tokens.map((tokenData, index) => (
                    <ListItem key={index} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      bgcolor: 'background.paper',
                      mb: 1,
                      p: 2,
                      borderRadius: 1
                    }}>
                      <Box>
                        <Typography variant="body1">{tokenData.token}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Expires: {new Date(tokenData.expiresAt).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                          Status: {tokenData.used ? 'Used' : 'Active'}
                        </Typography>
                      </Box>
                      <IconButton 
                        edge="end" 
                        color="error"
                        onClick={() => handleDeleteToken(tokenData.token)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminPanel;