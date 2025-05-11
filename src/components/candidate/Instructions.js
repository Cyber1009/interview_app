/**
 * Instructions Component
 * 
 * Provides pre-interview guidance and technical preparation for candidates.
 * 
 * Features:
 * - Video/audio device checks
 * - Interview process explanation
 * - System compatibility verification
 * - Next steps guidance
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MicIcon from '@mui/icons-material/Mic';
import DevicesIcon from '@mui/icons-material/Devices';
import TimerIcon from '@mui/icons-material/Timer';
import AdminService from '../../services/adminService';
import { ThemeService } from '../../services';
import { componentColors } from '../../styles';

const Instructions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const videoRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [permission, setPermission] = useState({video: false, audio: false});
  const [error, setError] = useState('');
  const [interviewId, setInterviewId] = useState(null);
  
  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('interviewToken');
    const storedInterviewId = localStorage.getItem('interviewId');
    
    if (!token) {
      navigate('/interview-access');
      return;
    }
    
    // Save interviewId from localStorage for navigation
    if (storedInterviewId) {
      setInterviewId(storedInterviewId);
    } else {
      // If no interview ID is found, use the token as fallback
      setInterviewId(token);
    }
    
    // Use the theme that was already fetched during token validation
    const storedTheme = sessionStorage.getItem('interviewTokenTheme');
    if (!storedTheme) {
      console.log('No theme found in sessionStorage, using default theme');
      // Create a default theme and store it in sessionStorage to prevent API calls
      const defaultTheme = {
        primaryColor: '#424242',
        accentColor: '#bdbdbd',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        logoUrl: null
      };
      sessionStorage.setItem('interviewTokenTheme', JSON.stringify(defaultTheme));
    } else {
      console.log('Using theme from sessionStorage');
    }
  }, [navigate]);

  const steps = [
    'Check Devices', 
    'Understand Process', 
    'Ready to Begin'
  ];

  useEffect(() => {
    // Clean up media stream on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleDeviceCheck = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Request access to camera and microphone
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Set the stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Save stream for cleanup later
      setStream(mediaStream);
      
      // Check which devices are working
      const videoTracks = mediaStream.getVideoTracks();
      const audioTracks = mediaStream.getAudioTracks();
      
      setPermission({
        video: videoTracks.length > 0 && videoTracks[0].enabled,
        audio: audioTracks.length > 0 && audioTracks[0].enabled
      });
      
      setActiveStep(1);
    } catch (err) {
      console.error('Media device error:', err);
      setError(
        `Unable to access camera and/or microphone. ${err.message || ''}. ` +
        'Please ensure you have granted permission and that your devices are working properly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      // Start the interview - first stop the stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Get actual interview ID from localStorage instead of using token
      const storedInterviewId = localStorage.getItem('interviewId');
      
      // Log the navigation information for debugging
      console.log(`Navigation info - stored interviewId: ${storedInterviewId}, state interviewId: ${interviewId}`);
      
      // Navigate to the interview using the stored interview ID from token verification
      if (storedInterviewId) {
        navigate(`/interview/${storedInterviewId}`);
      } else if (interviewId) {
        // Fallback to state interviewId (which may be the token)
        navigate(`/interview/${interviewId}`);
      } else {
        // If for some reason we don't have an interviewId, go back to access page
        setError('Interview session information is missing. Please try accessing the interview again.');
        navigate('/interview-access');
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: alpha(theme.palette.background.default, 0.5),
      py: 8
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[1]
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 6,
              '.MuiStepIcon-root.Mui-active': { 
                color: theme.palette.primary.main
              },
              '.MuiStepIcon-root.Mui-completed': { 
                color: theme.palette.primary.main
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Device Check */}
          {activeStep === 0 && (
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 700,
                  color: theme.palette.primary.main
                }}
              >
                Device Check
              </Typography>
              
              <Typography 
                align="center" 
                paragraph
                sx={{ 
                  mb: 4,
                  color: theme.palette.text.secondary
                }}
              >
                We need to verify your camera and microphone are working properly.
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              {!permission.video && !permission.audio ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 4
                }}>
                  <Box
                    component={Paper}
                    elevation={0}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 3,
                      bgcolor: alpha(componentColors.labelBackground, 0.6)
                    }}
                  >
                    <VideoSettingsIcon 
                      sx={{ 
                        fontSize: 60,
                        color: theme.palette.primary.main
                      }} 
                    />
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleDeviceCheck}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1rem'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Check Camera & Microphone'
                    )}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha(componentColors.labelBackground, 0.8),
                          bgcolor: alpha(componentColors.labelBackground, 0.3)
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.primary.main
                          }}
                        >
                          Camera
                        </Typography>
                        
                        {permission.video ? (
                          <Box 
                            sx={{ 
                              mt: 2, 
                              display: 'flex',
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'success.main'
                            }}
                          >
                            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">Working properly</Typography>
                          </Box>
                        ) : (
                          <Box 
                            sx={{ 
                              mt: 2, 
                              display: 'flex',
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'error.main'
                            }}
                          >
                            <ErrorOutlineIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">Not working</Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ mt: 2 }}>
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            style={{ 
                              width: '100%', 
                              maxHeight: '200px',
                              borderRadius: '8px',
                              display: permission.video ? 'block' : 'none'
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          height: '100%',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha(componentColors.labelBackground, 0.8),
                          bgcolor: alpha(componentColors.labelBackground, 0.3)
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.primary.main
                          }}
                        >
                          Microphone
                        </Typography>
                        
                        {permission.audio ? (
                          <Box 
                            sx={{ 
                              mt: 2, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'success.main'
                            }}
                          >
                            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">Working properly</Typography>
                          </Box>
                        ) : (
                          <Box 
                            sx={{ 
                              mt: 2, 
                              display: 'flex',
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'error.main'
                            }}
                          >
                            <ErrorOutlineIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">Not working</Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                          <MicIcon 
                            sx={{ 
                              fontSize: 50, 
                              color: permission.audio ? 'success.main' : 'error.main'
                            }} 
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button 
                  onClick={handleNext} 
                  disabled={!permission.video || !permission.audio}
                  variant="contained"
                  sx={{
                    py: 1,
                    px: 3,
                    borderRadius: 2
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 2: Process Explanation */}
          {activeStep === 1 && (
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 700,
                  color: theme.palette.primary.main
                }}
              >
                Interview Process
              </Typography>
              
              <Typography 
                align="center" 
                paragraph
                sx={{ 
                  mb: 6,
                  color: theme.palette.text.secondary
                }}
              >
                Here's what to expect during the automated interview process.
              </Typography>

              <Grid container spacing={3}>
                {[
                  { 
                    icon: <DevicesIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
                    title: "Practice Question", 
                    description: "You'll start with a practice question to get comfortable with the system."
                  },
                  { 
                    icon: <TimerIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
                    title: "Preparation Time", 
                    description: "For each question, you'll have time to prepare before recording begins."
                  },
                  { 
                    icon: <MicIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
                    title: "Recording", 
                    description: "You'll record your answers to each question within a specified time limit."
                  },
                  { 
                    icon: <VideoSettingsIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
                    title: "Review", 
                    description: "After each recording, you'll be able to review before submitting."
                  }
                ].map((step, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha(componentColors.labelBackground, 0.8),
                        bgcolor: alpha(componentColors.labelBackground, 0.3),
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 6px 20px 0 rgba(80,86,96,0.08)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        {step.icon}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            ml: 1.5,
                            fontWeight: 600,
                            color: theme.palette.primary.main
                          }}
                        >
                          {step.title}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: theme.palette.text.secondary
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  onClick={handleBack}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      bgcolor: alpha(componentColors.labelBackground, 0.5),
                    }
                  }}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  variant="contained"
                  sx={{
                    py: 1,
                    px: 3,
                    borderRadius: 2
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 3: Final Instructions */}
          {activeStep === 2 && (
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 700,
                  color: theme.palette.primary.main
                }}
              >
                Ready to Begin
              </Typography>
              
              <Typography 
                align="center" 
                paragraph
                sx={{ 
                  mb: 6,
                  color: theme.palette.text.secondary
                }}
              >
                Final reminders before you start your interview.
              </Typography>

              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4,
                  mb: 4, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha(componentColors.labelBackground, 0.8),
                  bgcolor: alpha(componentColors.labelBackground, 0.3)
                }}
              >
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    color: theme.palette.text.secondary
                  }}
                >
                  <strong>Before you start:</strong>
                </Typography>
                <ul>
                  {[
                    "Find a quiet place with good lighting",
                    "Ensure your internet connection is stable",
                    "Close unnecessary applications on your device",
                    "Prepare water or anything you might need",
                    "Take a moment to relax and compose yourself"
                  ].map((tip, index) => (
                    <Typography 
                      component="li" 
                      key={index} 
                      sx={{ 
                        mb: 1,
                        color: theme.palette.text.secondary
                      }}
                    >
                      {tip}
                    </Typography>
                  ))}
                </ul>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  onClick={handleBack}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      bgcolor: alpha(componentColors.labelBackground, 0.5),
                    }
                  }}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  variant="contained" 
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontSize: '1rem'
                  }}
                >
                  Start Interview
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Instructions;