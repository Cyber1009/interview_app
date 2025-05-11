/**
 * Video Recorder Component
 * Handles video recording functionality:
 * - Camera stream management
 * - Recording controls
 * - Timer display
 * - Recording status indicators
 * - Video preview rendering
 */

import React, { useRef } from 'react';
import { Box, Typography, Button, CircularProgress, LinearProgress } from '@mui/material';
import { FiberManualRecord, Stop } from '@mui/icons-material';

const VideoRecorder = ({ 
  videoRef,
  isRecording,
  hasAnswered,
  isPreparing,
  onStartRecording,
  onStopRecording,
  countdown,
  questionDuration,
  formatTime
}) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      mb: 4,
      '&:hover': {
        '& .recording-controls': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }
    }}>
      <Box sx={{ 
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: (theme) => `0 12px 32px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 20px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)'}`,
        }
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#000',
            objectFit: 'cover',
          }}
        />
        
        <Box sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={isRecording ? ((questionDuration - countdown) / questionDuration) * 100 : 0}
              sx={{ 
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: (theme) => isRecording 
                    ? theme.palette.secondary.main  // Changed from error.main to secondary.main
                    : theme.palette.primary.light,  // Use primary.light for non-recording state
                  transition: 'transform 0.1s linear'
                }
              }}
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              fontWeight: 500,
              minWidth: '70px',
              textAlign: 'right',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {isRecording ? formatTime(countdown) : formatTime(questionDuration)}
          </Typography>
        </Box>
      </Box>

      <Box 
        className="recording-controls"
        sx={{ 
          textAlign: 'center', 
          mt: 3,
          opacity: 0.8,
          transform: 'translateY(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {!isRecording && !hasAnswered ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiberManualRecord />}
            onClick={onStartRecording}
            disabled={isRecording || hasAnswered}  // Add disabled state
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            {isPreparing ? 'Start Recording Early' : 'Start Recording'}
          </Button>
        ) : isRecording ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Stop />}
            onClick={onStopRecording}
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: (theme) => `0 8px 16px ${theme.palette.secondary.main}40`,
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            Stop Recording
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default VideoRecorder;
