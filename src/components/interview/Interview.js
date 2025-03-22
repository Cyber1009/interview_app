// src/components/Interview.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Fade,
  CircularProgress,
} from '@mui/material';
import { 
  FiberManualRecord, 
  Stop, 
  Timer, 
  Warning,
  AccessTime,  // Add this import
} from '@mui/icons-material';
import VideoReview from './VideoReview';  // Update import

const buttonSx = {
  px: 4,
  py: 1.5,
  fontSize: '1.1rem'
};

function Interview() {
  const [questions, setQuestions] = useState(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('interviewQuestions'));
    // Instead of using imported practice question, create it inline
    const practiceQ = {
      id: 0,
      text: "Introduce yourslef.",
      preparationTime: 10,
      recordingTime: 10,
      isPractice: true
    };

    if (storedQuestions) {
      // Ensure practice question is always first
      return [practiceQ, ...storedQuestions.filter(q => !q.isPractice)];
    }
    
    // Default questions if none stored
    return [
      practiceQ,
      { id: 1, text: "Tell us about yourself and your background.", preparationTime: 60, recordingTime: 120 },
      { id: 2, text: "What are your key strengths?", preparationTime: 60, recordingTime: 120 },
      { id: 3, text: "Why are you interested in this position?", preparationTime: 60, recordingTime: 120 },
      { id: 4, text: "Where do you see yourself in five years?", preparationTime: 60, recordingTime: 120 },
    ];
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [countdown, setCountdown] = useState(180);
  const [preparationTime, setPreparationTime] = useState(60);  // Changed from 30 to 60
  const [showPreview, setShowPreview] = useState(false);
  const [currentVideoBlob, setCurrentVideoBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);  // Add this state
  const [isPracticeQuestion, setIsPracticeQuestion] = useState(true);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const preparationTimerRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'interviewQuestions') {
        const newQuestions = JSON.parse(e.newValue);
        // Convert question objects to strings
        const questionTexts = newQuestions.map(q => typeof q === 'object' ? q.text : q);
        setQuestions(questionTexts);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkAndInitializeCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Media devices not available");
        navigate('/instructions');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStream(stream);
        setIsInitialized(true);
        startPreparationTimer();
      } catch (err) {
        console.error("Camera access error:", err);
        navigate('/instructions');
      }
    };

    checkAndInitializeCamera();

    return () => stopCamera();
  }, [navigate]);

  useEffect(() => {
    if (preparationTime === 0) {
      startRecording();  // Move startRecording() here to ensure it runs after state updates
    }
  }, [preparationTime]);  // Only depend on preparationTime

  useEffect(() => {
    if (preparationTime === 0 && isPreparing) {
      setIsPreparing(false);
      setShowWarning(false);
      startRecording();
    }
  }, [preparationTime]);

  // Add new useEffect for auto-stopping
  useEffect(() => {
    if (isRecording && countdown <= 0) {
      stopRecording();
    }
  }, [countdown, isRecording]);

  useEffect(() => {
    // Update when question changes
    setIsPracticeQuestion(questions[currentQuestionIndex]?.isPractice ?? false);
  }, [currentQuestionIndex, questions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getAlertMessage = () => {
    if (preparationTime > 10) {
      return `You have ${preparationTime} seconds to prepare. You can start recording now or wait for automatic start.`;
    } else {
      return `Recording will start automatically in ${preparationTime} seconds! Click 'Start Recording' to begin early.`;
    }
  };

  const startPreparationTimer = () => {
    const currentPreparationTime = questions[currentQuestionIndex].preparationTime || 60;  // Changed default from 30 to 60
    setPreparationTime(currentPreparationTime);
    setIsPreparing(true);
    setShowWarning(false);
    const startTimeStamp = Date.now();
    
    if (preparationTimerRef.current) {
      clearInterval(preparationTimerRef.current);
    }

    preparationTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeStamp) / 1000);
      const remaining = currentPreparationTime - elapsed;
      
      if (remaining <= 0) {
        clearInterval(preparationTimerRef.current);
        setPreparationTime(0);
        setIsPreparing(false);
        setShowWarning(false);
      } else {
        setPreparationTime(remaining);
        if (remaining <= 10) {
          setShowWarning(true);
        }
      }
    }, 100);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (preparationTimerRef.current) {
      clearInterval(preparationTimerRef.current);
    }
  };

  const startRecording = async () => {
    if (isPreparing) {
      clearInterval(preparationTimerRef.current);
      setIsPreparing(false);
      setShowWarning(false);
    }

    try {
      chunksRef.current = [];
      setRecordedChunks([]);
      const currentQuestionTime = questions[currentQuestionIndex].recordingTime;
      setCountdown(currentQuestionTime);
      
      if (!stream) {
        throw new Error("No media stream available");
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 2500000
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setCurrentVideoBlob(blob);
        setShowPreview(true);
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);

      const startTimeStamp = Date.now();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        const remaining = currentQuestionTime - Math.floor((Date.now() - startTimeStamp) / 1000);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setCountdown(0);
          stopRecording();
        } else {
          setCountdown(remaining);
        }
      }, 100);

    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Error starting recording. Please refresh and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerRef.current);
      setIsRecording(false);
      setCountdown(0);
      
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          // Create blob right away to ensure data is available
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          setCurrentVideoBlob(blob);
          setHasAnswered(true);  // Add this line before setShowPreview(true)
          setShowPreview(true);
          // Disable tracks after blob creation
          stream.getTracks().forEach(track => track.enabled = false);
        }
      } catch (err) {
        console.error("Error stopping recording:", err);
      }
    }
  };

  const handlePreviewClose = (action) => {
    if (!action || action === 'cancel') {  // Add handling for cancel/close
      // Keep preview open if they try to close without choosing
      return;
    }

    setShowPreview(false);
    setCurrentVideoBlob(null);

    if (action === 're-record') {
      // Re-enable tracks for re-recording
      stream.getTracks().forEach(track => track.enabled = true);
      setCountdown(questions[currentQuestionIndex].recordingTime);
      setHasAnswered(false);  // Reset hasAnswered
      startPreparationTimer();
    } else if (action === 'continue') {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        stream.getTracks().forEach(track => track.enabled = true);
        setCurrentQuestionIndex(prev => prev + 1);
        setCountdown(questions[currentQuestionIndex + 1].recordingTime);
        setHasAnswered(false);  // Reset hasAnswered
        startPreparationTimer();
      } else {
        // End interview
        stopCamera();
        navigate('/thank-you');
      }
    }

    chunksRef.current = [];
    setRecordedChunks([]);
  };

  // Add a function to calculate progress
  const calculateProgress = () => {
    // Calculate progress based on current question (currentQuestionIndex + 1)
    // Each question represents an equal portion of the total progress
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const renderQuestionHeader = () => {
    if (isPracticeQuestion) {
      return `Practice Question: ${questions[currentQuestionIndex].text}`;
    }
    // Add 1 to currentQuestionIndex to start regular questions at 1
    return `Q${currentQuestionIndex}. ${questions[currentQuestionIndex].text}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          bgcolor: (theme) => theme.palette.background.paper,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            // Update progress calculation to exclude practice question
            value={(currentQuestionIndex / (questions.length - 1)) * 100}
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
              `Question ${currentQuestionIndex} of ${questions.length - 1}`}
          </Typography>
        </Box>

        <Card 
          variant="outlined" 
          sx={{ 
            mb: 4,
            border: '2px solid rgba(0,0,0,0.1)',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.8)',
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              {renderQuestionHeader()}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              mt: 2,
              p: 2,
              bgcolor: 'rgba(0,0,0,0.02)',
              borderRadius: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime color="action" />
                <Typography variant="body2" color="text.secondary">
                  Preparation Time: {formatTime(questions[currentQuestionIndex].preparationTime)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime color="action" />
                <Typography variant="body2" color="text.secondary">
                  Recording Time: {formatTime(questions[currentQuestionIndex].recordingTime)}
                </Typography>
              </Box>
            </Box>

            {isPreparing && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2,
                p: 2,
                bgcolor: preparationTime <= 10 ? 'warning.light' : 'primary.light',
                borderRadius: 2,
                color: preparationTime <= 10 ? 'warning.main' : 'primary.main'
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
          </CardContent>
        </Card>

        <Box sx={{ position: 'relative', mb: 4 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '400px',
              borderRadius: '16px',
              backgroundColor: '#000',
              objectFit: 'cover',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          />
          {isRecording && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((questions[currentQuestionIndex].recordingTime - countdown) / questions[currentQuestionIndex].recordingTime) * 100)}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: (theme) => theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    bgcolor: (theme) => theme.palette.primary.main
                  }
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                <CircularProgress 
                  size={16} 
                  thickness={6} 
                  sx={{ color: (theme) => theme.palette.error.main }} 
                />
                Recording: {formatTime(countdown)}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ 
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}>
          {!isRecording && !hasAnswered ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiberManualRecord />}
              onClick={startRecording}
              size="large"
              sx={buttonSx}
            >
              {isPreparing ? 'Start Recording Early' : 'Start Recording'}
            </Button>
          ) : isRecording ? (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Stop />}
              onClick={stopRecording}
              size="large"
              sx={buttonSx}
            >
              Stop Recording
            </Button>
          ) : null}
        </Box>
      </Paper>

      <VideoReview  // Change this component name
        open={showPreview}
        onClose={handlePreviewClose}
        videoBlob={currentVideoBlob}
        allowReRecord={isPracticeQuestion}
      />
    </Container>
  );
}

export default Interview;