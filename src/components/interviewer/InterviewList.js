/**
 * Interview List Component
 * Provides:
 * - List of all interviews created by the interviewer
 * - Filtering and sorting capabilities
 * - Interview management actions
 * - Navigation to interview details (questions, tokens, results)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, TextField, InputAdornment,
  Tabs, Tab, Card, Divider, Menu, MenuItem, ListItemIcon,
  Tooltip, CircularProgress, Alert, Snackbar, Badge, useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  Link as LinkIcon,
  Visibility as ViewIcon,
  Assignment as QuestionIcon,
  Refresh as RefreshIcon,
  VideoCall as VideoIcon
} from '@mui/icons-material';
import InterviewDataProvider from './shared/InterviewDataProvider';

const InterviewList = () => {
  return (
    <InterviewDataProvider>
      {(interviewData) => (
        <InterviewListContent
          interviews={interviewData.interviews}
          loading={interviewData.loading}
          error={interviewData.error}
          onRefresh={interviewData.refreshData}
          onDelete={interviewData.deleteInterview}
          onDuplicate={interviewData.duplicateInterview}
          onCreateInterview={interviewData.createInterview}
        />
      )}
    </InterviewDataProvider>
  );
};

const InterviewListContent = ({ 
  interviews, 
  loading, 
  error, 
  onRefresh,
  onDelete,
  onDuplicate,
  onCreateInterview
}) => {
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Filter interviews when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInterviews(filterByActiveTab(interviews, tabValue));
    } else {
      const filtered = interviews.filter(interview => 
        interview.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterviews(filterByActiveTab(filtered, tabValue));
    }
  }, [searchTerm, interviews, tabValue]);

  const filterByActiveTab = (interviewList, tab) => {
    switch (tab) {
      case 0: // All
        return interviewList;
      case 1: // Active (has active tokens)
        return interviewList.filter(interview => (interview.active_tokens_count || 0) > 0);
      case 2: // Inactive (no active tokens)
        return interviewList.filter(interview => (interview.active_tokens_count || 0) === 0);
      default:
        return interviewList;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateInterview = () => {
    navigate('/interviewer/interviews/create');
  };

  const handleViewInterview = (interviewId) => {
    // Navigate to interview details - shows questions, tokens, results
    navigate(`/interviewer/interviews/${interviewId}`);
  };

  const handleMenuOpen = (event, interview) => {
    event.stopPropagation(); // Prevent row click while opening menu
    setAnchorEl(event.currentTarget);
    setSelectedInterview(interview);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInterview(null);
  };

  const handleEditInterview = () => {
    if (selectedInterview) {
      navigate(`/interviewer/interviews/${selectedInterview.id}/edit`);
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 1000); // Ensure UI feedback
  };

  const handleDuplicateInterview = async () => {
    if (selectedInterview) {
      try {
        const duplicatedInterview = await onDuplicate(selectedInterview.id);
        
        if (duplicatedInterview) {
          setSnackbar({
            open: true,
            message: 'Interview successfully duplicated',
            severity: 'success'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to duplicate interview. Please try again.',
          severity: 'error'
        });
      }
    }
    handleMenuClose();
  };

  const handleDeleteInterview = async () => {
    if (selectedInterview) {
      try {
        const success = await onDelete(selectedInterview.id);
        
        if (success) {
          setSnackbar({
            open: true,
            message: 'Interview deleted successfully',
            severity: 'success'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete interview. Please try again.',
          severity: 'error'
        });
      }
    }
    handleMenuClose();
  };

  const handleViewResults = () => {
    if (selectedInterview) {
      navigate(`/interviewer/interviews/${selectedInterview.id}/results`);
    }
    handleMenuClose();
  };

  const handleViewQuestions = () => {
    if (selectedInterview) {
      navigate(`/interviewer/interviews/${selectedInterview.id}/questions`);
    }
    handleMenuClose();
  };

  const handleGenerateToken = () => {
    if (selectedInterview) {
      navigate(`/interviewer/interviews/${selectedInterview.id}/tokens`);
    }
    handleMenuClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* Header with Create button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          fontWeight={600} 
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Interview Templates
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing || loading}
            sx={{ borderRadius: 2 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInterview}
            sx={{ 
              py: 1.2, 
              px: 3,
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 3
              }
            }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Filter tabs and search */}
      <Card sx={{ 
        mb: 4, 
        overflow: 'visible',
        borderRadius: 3,
        boxShadow: theme.shadows[2]
      }}>
        <Box sx={{ p: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                minWidth: 100
              }
            }}
          >
            <Tab label="All Interviews" />
            <Tab 
              label={
                <Badge 
                  color="success" 
                  badgeContent={interviews.filter(i => (i.active_tokens_count || 0) > 0).length} 
                  max={99}
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}
                >
                  Active
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge 
                  color="default" 
                  badgeContent={interviews.filter(i => (i.active_tokens_count || 0) === 0).length} 
                  max={99}
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}
                >
                  Inactive
                </Badge>
              }
            />
          </Tabs>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search interviews by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      </Card>

      {/* Error message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: 1
          }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          my: 8,
          gap: 2
        }}>
          <CircularProgress size={40} />
          <Typography color="text.secondary" variant="body2">
            Loading interviews...
          </Typography>
        </Box>
      ) : (
        /* Interviews table */
        <TableContainer 
          component={Paper} 
          elevation={2} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[2],
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Interview Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Questions</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Access Tokens</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInterviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2,
                      py: 3
                    }}>
                      <VideoIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: 'action.disabled',
                          opacity: 0.6
                        }} 
                      />
                      <Typography variant="h6" color="text.secondary">
                        No interviews found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {searchTerm ? 'Try adjusting your search' : 'Create your first interview template to get started'}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateInterview}
                        sx={{ borderRadius: 2 }}
                      >
                        Create Interview Template
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInterviews.map((interview) => (
                  <TableRow 
                    key={interview.id} 
                    hover
                    onClick={() => handleViewInterview(interview.id)}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {interview.title}
                        </Typography>
                        {(interview.active_tokens_count || 0) > 0 && (
                          <Chip 
                            size="small" 
                            color="success" 
                            label="Active" 
                            sx={{ 
                              borderRadius: 1,
                              height: 22,
                              fontSize: '0.7rem' 
                            }} 
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(interview.created_at)}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        color="primary" 
                        label={`${interview.questions ? interview.questions.length : 0} Questions`} 
                        variant="outlined"
                        sx={{ 
                          borderRadius: 1,
                          '& .MuiChip-label': { fontWeight: 500 }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          size="small" 
                          color={(interview.active_tokens_count || 0) > 0 ? "success" : "default"}
                          label={`${interview.active_tokens_count || 0}/${interview.tokens_count || 0} Active`} 
                          sx={{ 
                            borderRadius: 1,
                            '& .MuiChip-label': { fontWeight: 500 }
                          }}
                          icon={<LinkIcon style={{ fontSize: '0.9rem' }} />}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Interview options">
                        <IconButton
                          aria-label="more options"
                          onClick={(e) => handleMenuOpen(e, interview)}
                          sx={{ 
                            color: 'text.secondary',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              bgcolor: theme.palette.action.hover
                            }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { 
            borderRadius: 2,
            minWidth: 200,
            overflow: 'visible',
            mt: 0.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            }
          }
        }}
      >
        <MenuItem onClick={handleViewQuestions} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <QuestionIcon fontSize="small" />
          </ListItemIcon>
          Edit Questions
        </MenuItem>
        <MenuItem onClick={handleViewResults} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Results
        </MenuItem>
        <MenuItem onClick={handleEditInterview} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Interview
        </MenuItem>
        <MenuItem onClick={handleGenerateToken} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Generate Token
        </MenuItem>
        <MenuItem onClick={handleDuplicateInterview} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteInterview} sx={{ color: 'error.main', py: 1.5 }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      
      {/* Notification snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          elevation={6} 
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InterviewList;