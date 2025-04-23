/**
 * Instructions Component
 * Displays interview process instructions and steps
 * Handles camera permissions before starting the interview
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timer,
  Videocam,
  Preview,
  CheckCircle,
  ArrowForward,
  VideocamOff,
} from '@mui/icons-material';
import CameraPermissions from '../shared/CameraPermissions';

function Instructions() {
  const navigate = useNavigate();
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');

  const steps = [
    {
      label: 'Practice Session',
      icon: <VideocamOff />,
      description: 'Start with a practice question to get comfortable with the format and test your equipment.',
      tip: 'This is a safe space to familiarize yourself with the recording process.'
    },
    {
      label: 'Preparation Time',
      icon: <Timer />,
      description: 'Before each question, you\'ll have preparation time to gather your thoughts.',
      tip: 'You can start recording early if you feel ready before the preparation time ends.'
    },
    {
      label: 'Recording Your Answer',
      icon: <Videocam />,
      description: 'After preparation time ends, recording will start automatically. Focus on delivering your answer clearly.',
      tip: 'Maintain eye contact with the camera and speak at a steady pace.'
    },
    {
      label: 'Review Your Response',
      icon: <Preview />,
      description: 'After recording, you can review your answer. During the practice question, you\'ll have the option to re-record.',
      tip: 'Check both video and audio quality in your recording.'
    },
    {
      label: 'Complete the Interview',
      icon: <CheckCircle />,
      description: 'Progress through all questions at your own pace. Each question follows the same format.',
      tip: 'Take brief pauses between questions if needed to stay focused.'
    }
  ];

  const handleStartInterview = () => {
    // Always show permissions dialog when starting interview
    setShowPermissions(true);
  };

  const handlePermissionsGranted = () => {
    // Store permission state and navigate only after permissions are granted
    sessionStorage.setItem('cameraPermissionsGranted', 'true');
    navigate('/interview');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('permissionDenied')) {
      setPermissionsError('Camera access was denied. Please enable camera access and try again.');
    }
  }, []);

  if (showPermissions) {
    return <CameraPermissions onPermissionsGranted={handlePermissionsGranted} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'primary.main'
            }}
          >
            How It Works
          </Typography>

          <Stepper orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="h6">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Card variant="outlined" sx={{ mb: 2, mt: 1 }}>
                    <CardContent>
                      <Typography paragraph>
                        {step.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          fontStyle: 'italic'
                        }}
                      >
                        Tip: {step.tip}
                      </Typography>
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartInterview}
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 30,
                fontSize: '1.1rem',
              }}
            >
              Start Interview
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Instructions;