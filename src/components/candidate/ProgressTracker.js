/**
 * Progress Tracker Component
 * Provides:
 * - Visual interview progress indicator
 * - Question count tracking
 * - Practice session indication
 * - Progress percentage calculation
 */

import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const ProgressTracker = ({ 
  currentQuestionIndex,
  totalQuestions,
  isPracticeQuestion 
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <LinearProgress 
        variant="determinate" 
        value={(currentQuestionIndex / (totalQuestions - 1)) * 100}
        sx={{ 
          height: 8, 
          borderRadius: 4,
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.05)' 
            : 'rgba(0,0,0,0.05)',
          '& .MuiLinearProgress-bar': {
            bgcolor: (theme) => isPracticeQuestion 
              ? theme.palette.info.main
              : theme.palette.primary.main,
            transition: 'transform 0.4s ease-in-out'
          }
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
        {isPracticeQuestion ? 'Practice Question' : 
          `Question ${currentQuestionIndex} of ${totalQuestions - 1}`}
      </Typography>
    </Box>
  );
};

export default ProgressTracker;