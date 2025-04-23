/**
 * Interview List Component
 * Provides:
 * - List of all interviews created by the interviewer
 * - Filtering and sorting capabilities
 * - Interview management actions
 * - Token generation for interviews
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, TextField, InputAdornment,
  Tabs, Tab, Card, Divider, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  Link as LinkIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { InterviewService, AdminService } from '../../services';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const navigate = useNavigate();

  // Fetch interviews on component mount
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        // This would be an actual API call in production
        const response = await InterviewService.getInterview();
        
        // Mock data for development
        const mockInterviews = [
          {
            id: 1,
            title: "Frontend Developer Interview",
            created_at: "2025-04-15T10:30:00Z",
            questions_count: 5,
            tokens: 3,
            active_tokens: 2
          },
          {
            id: 2,
            title: "Backend Engineer Assessment",
            created_at: "2025-04-18T14:15:00Z",
            questions_count: 8,
            tokens: 5,
            active_tokens: 1
          },
          {
            id: 3,
            title: "Full Stack Developer Screening",
            created_at: "2025-04-20T09:00:00Z",
            questions_count: 6,
            tokens: 10,
            active_tokens: 7
          }
        ];
        
        setInterviews(mockInterviews);
        setFilteredInterviews(mockInterviews);
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Filter interviews when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInterviews(interviews);
    } else {
      const filtered = interviews.filter(interview => 
        interview.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterviews(filtered);
    }
  }, [searchTerm, interviews]);

  // Filter interviews based on active tab
  useEffect(() => {
    switch (tabValue) {
      case 0: // All
        setFilteredInterviews(interviews);
        break;
      case 1: // Active (has active tokens)
        setFilteredInterviews(interviews.filter(interview => interview.active_tokens > 0));
        break;
      case 2: // Inactive (no active tokens)
        setFilteredInterviews(interviews.filter(interview => interview.active_tokens === 0));
        break;
      default:
        setFilteredInterviews(interviews);
    }
  }, [tabValue, interviews]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateInterview = () => {
    navigate('/interviewer/create');
  };

  const handleMenuOpen = (event, interview) => {
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

  const handleDeleteInterview = () => {
    if (selectedInterview) {
      // Here you would implement the delete functionality
      console.log('Delete interview', selectedInterview.id);
    }
    handleMenuClose();
  };

  const handleViewResults = () => {
    if (selectedInterview) {
      navigate(`/interviewer/interviews/${selectedInterview.id}/results`);
    }
    handleMenuClose();
  };

  const handleGenerateToken = () => {
    if (selectedInterview) {
      navigate(`/interviewer/interviews/${selectedInterview.id}/tokens`);
    }
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Interviews
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateInterview}
          sx={{ py: 1.5, px: 3 }}
        >
          Create New Interview
        </Button>
      </Box>

      <Card sx={{ mb: 4, overflow: 'visible' }}>
        <Box sx={{ p: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Interviews" />
            <Tab label="Active" />
            <Tab label="Inactive" />
          </Tabs>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="medium"
          />
        </Box>
      </Card>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Interview Title</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Access Tokens</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No interviews found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={handleCreateInterview}
                  >
                    Create your first interview
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredInterviews.map((interview) => (
                <TableRow key={interview.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {interview.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(interview.created_at)}</TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      color="primary" 
                      label={`${interview.questions_count} Questions`} 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        size="small" 
                        color={interview.active_tokens > 0 ? "success" : "default"}
                        label={`${interview.active_tokens}/${interview.tokens} Active`} 
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more options"
                      onClick={(e) => handleMenuOpen(e, interview)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewResults}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Results
        </MenuItem>
        <MenuItem onClick={handleEditInterview}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Interview
        </MenuItem>
        <MenuItem onClick={handleGenerateToken}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Generate Token
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteInterview} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default InterviewList;