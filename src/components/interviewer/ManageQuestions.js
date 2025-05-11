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
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Tooltip,
  Paper,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  AccessTime as AccessTimeIcon,
  Videocam as VideocamIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Mock questions for development
const mockQuestions = [
  { 
    id: 1, 
    text: "Tell me about yourself", 
    preparation_time: 30, 
    responding_time: 60, 
    category: "Behavioral" 
  },
  { 
    id: 2, 
    text: "What are your strengths and weaknesses?", 
    preparation_time: 30, 
    responding_time: 60, 
    category: "Behavioral" 
  },
  { 
    id: 3, 
    text: "Explain the difference between var, let, and const in JavaScript", 
    preparation_time: 45, 
    responding_time: 90, 
    category: "Technical" 
  },
  { 
    id: 4, 
    text: "How would you implement a linked list in Python?", 
    preparation_time: 60, 
    responding_time: 120, 
    category: "Technical" 
  },
  { 
    id: 5, 
    text: "Describe a challenging problem you solved", 
    preparation_time: 45, 
    responding_time: 120, 
    category: "Behavioral" 
  }
];

// Categories for filter
const categories = ["All", "Behavioral", "Technical", "Leadership", "Problem Solving"];

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    text: '',
    preparation_time: 30,
    responding_time: 60,
    category: 'Behavioral'
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setQuestions(mockQuestions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter questions based on selected category and search term
  useEffect(() => {
    let filtered = questions;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredQuestions(filtered);
  }, [selectedCategory, questions, searchTerm]);

  const handleOpenDialog = (question = null) => {
    if (question) {
      setCurrentQuestion({...question});
    } else {
      setCurrentQuestion({
        id: null,
        text: '',
        preparation_time: 30,
        responding_time: 60,
        category: categories.length > 1 ? categories[1] : 'Behavioral'
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
    if (currentQuestion.text.trim() === '') return;
    
    const isUpdate = currentQuestion.id !== null;
    
    if (isUpdate) {
      // Update existing question
      const updatedQuestions = questions.map(q => 
        q.id === currentQuestion.id ? currentQuestion : q
      );
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      const newQuestion = {
        ...currentQuestion,
        id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1
      };
      setQuestions([...questions, newQuestion]);
    }
    
    handleCloseDialog();
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderAllQuestionsTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <TextField
            placeholder="Search questions..."
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.slice(1).map((category) => (
                <MenuItem key={category} value={category.toLowerCase()}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Filter by category</FormHelperText>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ ml: 2 }}
        >
          Add Question
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredQuestions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'background.default'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            No Questions Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
            {searchTerm || selectedCategory !== 'all' 
              ? "No questions match your current filter criteria. Try adjusting your search or category filter."
              : "You haven't added any questions yet. Click 'Add Question' to create your first question."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 1 }}
          >
            Add Question
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
          <List disablePadding>
            {filteredQuestions.map((question, index) => (
              <React.Fragment key={question.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'background.default',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 500, pr: 8 }}>
                        {question.text}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        <Chip 
                          size="small" 
                          label={question.category}
                          icon={<CategoryIcon fontSize="small" />} 
                          color="primary"
                          variant="outlined"
                        />
                        <Chip 
                          size="small" 
                          label={`Prep: ${question.preparation_time}s`} 
                          icon={<AccessTimeIcon fontSize="small" />} 
                          variant="outlined"
                        />
                        <Chip 
                          size="small" 
                          label={`Response: ${question.responding_time}s`} 
                          icon={<VideocamIcon fontSize="small" />} 
                          variant="outlined"
                        />
                      </Box>
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Edit Question">
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenDialog(question)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Question">
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteQuestion(question.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );

  const renderCategoriesTab = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {categories.slice(1).map((category) => {
          const categoryQuestions = questions.filter(q => 
            q.category.toLowerCase() === category.toLowerCase()
          );
          
          return (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${categoryQuestions.length} Questions`}
                      color="primary"
                    />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {categoryQuestions.length > 0 ? (
                    <List dense sx={{ 
                      maxHeight: 220, 
                      overflow: 'auto',
                      '& .MuiListItem-root': {
                        px: 0,
                        py: 0.75
                      }
                    }}>
                      {categoryQuestions.slice(0, 5).map((question) => (
                        <ListItem key={question.id}>
                          <ListItemText 
                            primary={question.text}
                            primaryTypographyProps={{
                              noWrap: true,
                              title: question.text,
                              sx: { fontSize: '0.875rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                      {categoryQuestions.length > 5 && (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          + {categoryQuestions.length - 5} more
                        </Typography>
                      )}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No questions in this category
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedCategory(category.toLowerCase());
                        setActiveTab(0);
                      }}
                    >
                      View All
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setCurrentQuestion({
                          id: null,
                          text: '',
                          preparation_time: 30,
                          responding_time: 60,
                          category: category
                        });
                        setDialogOpen(true);
                      }}
                      sx={{ ml: 1 }}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 3 
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '0.01em',
              color: 'text.primary'
            }}>
              Question Library
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your interview questions. These can be added to any interview template.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ mb: 2 }}
          >
            <Tab label="All Questions" />
            <Tab label="By Category" />
          </Tabs>
        </Box>

        {activeTab === 0 ? renderAllQuestionsTab() : renderCategoriesTab()}
      </Paper>

      {/* Question Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {currentQuestion.id ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            name="text"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={currentQuestion.text}
            onChange={handleInputChange}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={currentQuestion.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.slice(1).map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Type of interview question</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel htmlFor="preparation_time">Preparation Time (sec)</InputLabel>
                <OutlinedInput
                  id="preparation_time"
                  name="preparation_time"
                  type="number"
                  value={currentQuestion.preparation_time}
                  onChange={handleInputChange}
                  label="Preparation Time (sec)"
                  inputProps={{ min: 0, step: 10 }}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccessTimeIcon fontSize="small" />
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                  Time for candidate preparation
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel htmlFor="responding_time">Response Time (sec)</InputLabel>
                <OutlinedInput
                  id="responding_time"
                  name="responding_time"
                  type="number"
                  value={currentQuestion.responding_time}
                  onChange={handleInputChange}
                  label="Response Time (sec)"
                  inputProps={{ min: 0, step: 10 }}
                  startAdornment={
                    <InputAdornment position="start">
                      <VideocamIcon fontSize="small" />
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                  Maximum answering time
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuestion} 
            variant="contained"
            startIcon={currentQuestion.id ? <SaveIcon /> : <AddIcon />}
            disabled={!currentQuestion.text.trim()}
          >
            {currentQuestion.id ? 'Save Changes' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageQuestions;