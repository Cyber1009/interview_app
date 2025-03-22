import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Timer } from '@mui/icons-material';

const TimerComponent = ({ 
  isPreparing,
  preparationTime,
  formatTime 
}) => {
  return (
    <>
      {isPreparing && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mt: 2,
          mb: 4,
          p: 3,
          bgcolor: (theme) => preparationTime <= 10 
            ? alpha(theme.palette.warning.main, 0.1)
            : alpha(theme.palette.primary.main, 0.1),
          borderRadius: 3,
          border: '1px solid',
          borderColor: (theme) => preparationTime <= 10 
            ? theme.palette.warning.main 
            : theme.palette.primary.main,
          color: (theme) => preparationTime <= 10 
            ? theme.palette.warning.main 
            : theme.palette.primary.main
        }}>
          <Timer sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h6">
              Preparation Time Remaining: {formatTime(preparationTime)}
            </Typography>
            <Typography variant="body2">
              {preparationTime > 10 
                ? "You can start recording now or wait for automatic start"
                : "Recording will start automatically soon!"
              }
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TimerComponent;
