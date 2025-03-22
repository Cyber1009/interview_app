/**
 * Admin Panel Component
 * Provides administration interface for:
 * - Managing interview questions and their timing
 * - Customizing application theme and branding
 * - Generating and managing access tokens
 * - Configuring practice and actual interview questions
 */

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
  Grid,
  Drawer,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, QuestionMark as QuestionIcon, Palette as PaletteIcon, Key as KeyIcon } from '@mui/icons-material';
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

  const [logo, setLogo] = useState(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    return savedLogo || null;
  });

  const theme = useTheme();
  const drawerWidth = 240;

  const menuItems = [
    { id: 0, label: 'Questions', icon: <QuestionIcon /> },
    { id: 1, label: 'Theme Settings', icon: <PaletteIcon /> },
    { id: 2, label: 'Access Tokens', icon: <KeyIcon /> },
  ];

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

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Read the file and create object URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const logoDataUrl = e.target.result;
      setLogo(logoDataUrl);
      localStorage.setItem('companyLogo', logoDataUrl);

      // Extract dominant colors from image and update theme
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Sample colors from image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colors = [];
        for(let i = 0; i < imageData.length; i += 4) {
          colors.push({
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2]
          });
        }
        
        // Get dominant color
        const dominantColor = colors.reduce((acc, cur) => {
          return `#${rgbToHex(cur.r, cur.g, cur.b)}`;
        }, '#000000');

        // Update theme colors
        handleThemeChange(dominantColor, 'primary');
      };
      img.src = logoDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const rgbToHex = (r, g, b) => {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Update the theme preview button styles
  const previewButtonSx = {
    mt: 2,
    '&:hover': {
      transform: 'translateY(-2px)',
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {logo ? (
            <img 
              src={logo} 
              alt="Company Logo" 
              style={{ 
                width: '100%', 
                height: 'auto',
                maxHeight: 60,
                objectFit: 'contain',
              }}
            />
          ) : (
            <Typography variant="h6" color="primary">
              Interview Admin
            </Typography>
          )}
        </Box>
        <Divider />
        <MuiList>
          {menuItems.map((item) => (
            <MuiListItem key={item.id} disablePadding>
              <ListItemButton
                selected={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  py: 2,
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: activeTab === item.id ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: activeTab === item.id ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </MuiListItem>
          ))}
        </MuiList>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'hidden' }}>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="500">
              Interview Questions
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                  fullWidth
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  label="New Question"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddQuestion}
                  startIcon={<AddIcon />}
                  sx={{ 
                    px: 4,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  Add Question
                </Button>
              </Box>

              <List sx={{ 
                width: '100%',
                '& > *': {
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateX(8px)',
                  },
                },
              }}>
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
            </Paper>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="500">
              Theme Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom>
                    Color Scheme
                  </Typography>
                  <Grid container spacing={3}>
                    {Object.entries(themeColors).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                            {key} Color
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2,
                            alignItems: 'center' 
                          }}>
                            <TextField
                              type="color"
                              value={value}
                              onChange={(e) => handleThemeChange(e.target.value, key)}
                              sx={{ 
                                width: 100,
                                '& input': {
                                  height: 50,
                                  cursor: 'pointer',
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>
                              {value}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Company Logo
                  </Typography>
                  <Box sx={{ mb: 3, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {logo ? (
                      <img 
                        src={logo} 
                        alt="Company Logo" 
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: 100,
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No logo uploaded
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <input
                      accept="image/*"
                      type="file"
                      id="logo-upload"
                      hidden
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload" style={{ width: '100%' }}>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                      >
                        Upload Logo
                      </Button>
                    </label>
                    {logo && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setLogo(null);
                          localStorage.removeItem('companyLogo');
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom>
                    Theme Preview
                  </Typography>
                  <Box sx={{ 
                    bgcolor: themeColors.background,
                    p: 3,
                    borderRadius: 1,
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    {logo && (
                      <Box sx={{ maxWidth: 200, mb: 2 }}>
                        <img 
                          src={logo} 
                          alt="Company Logo" 
                          style={{ 
                            width: '100%', 
                            height: 'auto',
                            objectFit: 'contain'
                          }} 
                        />
                      </Box>
                    )}
                    <Typography sx={{ color: themeColors.text }}>
                      Sample Question Text
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        sx={{ ...previewButtonSx, bgcolor: themeColors.primary }}
                      >
                        Primary Button
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ ...previewButtonSx, bgcolor: themeColors.secondary }}
                      >
                        Secondary Button
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="500">
              Access Tokens
            </Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 4,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 3
              }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateToken}
                  startIcon={<AddIcon />}
                  sx={{ 
                    px: 4,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  Generate New Token
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleBulkGenerateTokens(5)}
                  sx={{ borderRadius: 2 }}
                >
                  Generate 5 Tokens
                </Button>
              </Box>
              <Grid container spacing={2}>
                {tokens.map((tokenData, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 2,
                        },
                      }}
                    >
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
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminPanel;