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
          bgcolor: (theme) => theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            bgcolor: (theme) => theme.palette.primary.main
          }
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
        {isPracticeQuestion ? 'Practice Question' : 
          `Question ${currentQuestionIndex} of ${totalQuestions - 1}`}
      </Typography>
    </Box>
  );
};

export default ProgressTracker;
