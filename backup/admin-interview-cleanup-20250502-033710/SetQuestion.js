import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

/**
 * SetQuestion Component
 * Admin interface for managing interview questions
 */
const SetQuestion = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Question Management
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the question management interface. 
          The component will be implemented to manage interview questions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SetQuestion;