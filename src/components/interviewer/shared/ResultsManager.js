/**
 * ResultsManager Component
 * Reusable component for managing interview results:
 * - Display completed and in-progress sessions
 * - Show session details including recordings
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  useTheme,
  Alert,
  MenuItem,
  Menu
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Updated import to use the consolidated API
import { interviewerAPI } from '../../../api';

const ResultsManager = ({
  interviewId,
  results = [],
  loading = false,
  error = null,
  onResultsChange = () => {},
  onError = () => {}
}) => {
  const [processingAction, setProcessingAction] = useState(false);

  const handleRefreshResults = async () => {
    try {
      setProcessingAction(true);
      
      const response = await interviewerAPI.getInterviewResults(interviewId);
      
      if (response && response.data) {
        onResultsChange(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh results:', error);
      onError('Failed to load results. Please try again.');
    } finally {
      setProcessingAction(false);
    }
  };

  const renderResultsList = () => {
    if (loading || processingAction) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: 200 
        }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!results || results.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No interview results available yet. Results will appear here once candidates complete interviews.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Session ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Recordings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={result.session_id || index}>
                <TableCell>{result.session_id}</TableCell>
                <TableCell>
                  <Chip 
                    size="small"
                    label={result.end_time ? "Completed" : "In Progress"}
                    color={result.end_time ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>{new Date(result.start_time).toLocaleString()}</TableCell>
                <TableCell>{result.end_time ? new Date(result.end_time).toLocaleString() : '-'}</TableCell>
                <TableCell>{result.recordings ? result.recordings.length : 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Interview Results
        </Typography>
        <Button 
          variant="outlined"
          startIcon={processingAction ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={handleRefreshResults}
          disabled={processingAction}
          size="small"
        >
          Refresh Results
        </Button>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {renderResultsList()}
      </Paper>
    </Box>
  );
};

export default ResultsManager;