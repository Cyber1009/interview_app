/**
 * SetQuestion.js
 * Container component for the question management page
 * Uses the shared QuestionManager component for the actual question management
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Snackbar,
  useTheme 
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import QuestionManager from './shared/QuestionManager';
import InterviewDataProvider from './shared/InterviewDataProvider';

/**
 * SetQuestion Component - Interface for managing interview questions
 * 
 * Features:
 * - Question listing
 * - Add, edit, delete questions
 * - Reorder questions via drag and drop
 */
const SetQuestion = () => {
  const { interviewId } = useParams();
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const navigate = useNavigate();
  const theme = useTheme();

  const handleBackToInterview = () => {
    navigate(`/interviewer/interviews/${interviewId}`);
  };

  const handleQuestionsChange = (updatedQuestions) => {
    setSnackbar({
      open: true,
      message: 'Questions updated successfully',
      severity: 'success'
    });
  };

  const handleError = (errorMessage) => {
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <InterviewDataProvider interviewId={interviewId}>
      {({ 
        interview, 
        loading, 
        error, 
        refreshData: handleRefresh
      }) => (
        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToInterview}
                sx={{ mr: 2, borderRadius: 2 }}
              >
                Back
              </Button>
              <Box>
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
                  Interview Questions
                </Typography>
                {interview && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {interview.title}
                  </Typography>
                )}
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>

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

          <QuestionManager
            interviewId={interviewId}
            questions={interview?.questions || []}
            loading={loading}
            error={error}
            onQuestionsChange={handleQuestionsChange}
            onError={handleError}
          />

          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
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
      )}
    </InterviewDataProvider>
  );
};

export default SetQuestion;