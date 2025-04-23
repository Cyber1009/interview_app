/**
 * Manage Questions Component
 * Provides:
 * - Question bank management
 * - Create, edit and delete questions
 * - Question organization by category
 * - Question import/export functionality
 */

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, TextField, 
  Card, CardContent, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, FormControl,
  InputLabel, Select, MenuItem, Chip, Divider,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Tab, Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { InterviewService } from '../../services';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    text: '',
    preparation_time: 30,
    responding_time: 60,
    category: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch questions and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // These would be actual API calls in production
        
        // Mock data for development
        const mockCategories = [
          'Technical Skills', 
          'Behavioral', 
          'Problem Solving',
          'System Design'
        ];
        
        const mockQuestions = [
          {
            id: 1,
            text: "Tell me about yourself and your experience",
            preparation_time: 30,
            responding_time: 120,
            category: "Behavioral"
          },
          {
            id: 2,
            text: "What's the difference between var, let and const in JavaScript?",
            preparation_time: 30,
            responding_time: 60,
            category: "Technical Skills"
          },
          {
            id: 3,
            text: "How would you design a URL shortening service?",
            preparation_time: 60,
            responding_time: 180,
            category: "System Design"
          },
          {
            id: 4,
            text: "Write an algorithm to find the longest substring without repeating characters",
            preparation_time: 60,
            responding_time: 120,
            category: "Problem Solving"
          },
          {
            id: 5,
            text: "Describe a challenging project you worked on and how you overcame obstacles",
            preparation_time: 45,
            responding_time: 180,
            category: "Behavioral"
          }
        ];
        
        setCategories(mockCategories);
        setQuestions(mockQuestions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter questions based on selected category
  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const handleOpenDialog = (question = null) => {
    if (question) {
      setCurrentQuestion({...question});
    } else {
      setCurrentQuestion({
        id: null,
        text: '',
        preparation_time: 30,
        responding_time: 60,
        category: categories.length > 0 ? categories[0] : ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: name === 'preparation_time' || name === 'responding_time' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSaveQuestion = () => {
    // Validation
    if (!currentQuestion.text.trim()) {
      alert('Question text cannot be empty');
      return;
    }

    // Add new question or update existing
    if (currentQuestion.id === null) {
      // Add new question
      const newQuestion = {
        ...currentQuestion,
        id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1
      };
      setQuestions([...questions, newQuestion]);
    } else {
      // Update existing question
      setQuestions(questions.map(q => 
        q.id === currentQuestion.id ? currentQuestion : q
      ));
    }

    handleCloseDialog();
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleOpenCategoryDialog = () => {
    setNewCategory('');
    setCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    if (categories.includes(newCategory)) {
      alert('This category already exists');
      return;
    }

    setCategories([...categories, newCategory]);
    setCategoryDialogOpen(false);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Question Bank
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CategoryIcon />}
            onClick={handleOpenCategoryDialog}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedCategory}
            onChange={(e, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Questions" value="all" />
            {categories.map((category) => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
        </Box>
      </Card>

      {/* Question List */}
      {loading ? (
        <Typography>Loading questions...</Typography>
      ) : filteredQuestions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No questions found in this category
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Your First Question
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredQuestions.map((question) => (
            <Grid item xs={12} key={question.id}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {question.text}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip 
                        size="small" 
                        label={`Prep: ${question.preparation_time}s`} 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        size="small" 
                        label={`Answer: ${question.responding_time}s`} 
                        color="secondary" 
                        variant="outlined"
                      />
                      <Chip 
                        size="small" 
                        label={question.category} 
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(question)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteQuestion(question.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Question Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentQuestion.id ? "Edit Question" : "Add New Question"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Question Text"
                name="text"
                value={currentQuestion.text}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={currentQuestion.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Preparation Time (seconds)"
                  name="preparation_time"
                  value={currentQuestion.preparation_time}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Response Time (seconds)"
                  name="responding_time"
                  value={currentQuestion.responding_time}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleSaveQuestion}
            disabled={!currentQuestion.text.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Existing Categories:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip key={category} label={category} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleAddCategory}
            disabled={!newCategory.trim() || categories.includes(newCategory)}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageQuestions;