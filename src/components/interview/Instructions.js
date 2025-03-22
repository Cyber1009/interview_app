// src/components/Instructions.js
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
} from '@mui/icons-material';
import CameraPermissions from '../CameraPermissions';

function Instructions() {
  const navigate = useNavigate();
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');

  const steps = [
    {
      label: 'Preparation Time',
      icon: <Timer />,
      description: 'You will have 30 seconds to prepare before each question. Use this time to gather your thoughts.',
      tip: 'You can start recording early if you feel ready before the preparation time ends.'
    },
    {
      label: 'Recording Your Answer',
      icon: <Videocam />,
      description: 'You will have 3 minutes to record your answer. The recording will start automatically after preparation time.',
      tip: 'Speak clearly and maintain eye contact with the camera.'
    },
    {
      label: 'Review Your Response',
      icon: <Preview />,
      description: 'After recording, you can review your answer and choose to re-record if needed.',
      tip: 'Make sure your response is audible and visible in the preview.'
    },
    {
      label: 'Complete the Interview',
      icon: <CheckCircle />,
      description: 'Proceed through all questions at your own pace.',
      tip: 'Take brief pauses between questions if needed.'
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