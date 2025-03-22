/**
 * Question Display Component
 * Shows:
 * - Current question text
 * - Question timing information
 * - Practice vs actual question indicators
 * - Question progress status
 */

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const QuestionDisplay = ({ 
  currentQuestion,
  isPracticeQuestion,
  currentQuestionIndex,
  formatTime 
}) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.02)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            mb: 2
          }}
        >
          {isPracticeQuestion 
            ? `Practice Question: ${currentQuestion.text}`
            : `Q${currentQuestionIndex}. ${currentQuestion.text}`}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          mt: 2,
          p: 2,
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.03)',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime color="action" />
            <Typography variant="body2" color="text.secondary">
              Preparation Time: {formatTime(currentQuestion.preparationTime)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime color="action" />
            <Typography variant="body2" color="text.secondary">
              Recording Time: {formatTime(currentQuestion.recordingTime)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
