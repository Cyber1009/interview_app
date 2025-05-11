/**
 * Main Interview Component
 * Handles the core interview process including:
 * - Video recording and playback
 * - Question progression
 * - Timer management
 * - Practice and actual interview sessions
 * - Response review
 * - Video upload handling
 */

// src/components/Interview.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  AccessTime,
} from '@mui/icons-material';
import VideoReview from './VideoReview';
import VideoRecorder from './VideoRecorder';
import QuestionDisplay from './QuestionDisplay';
import TimerComponent from './TimerComponent';
import ProgressTracker from './ProgressTracker';
import interviewService from '../../services/interviewService';

const buttonSx = {
  px: 4,
  py: 1.5,
  fontSize: '1.1rem'
};

function Interview() {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [countdown, setCountdown] = useState(180);
  const [preparationTime, setPreparationTime] = useState(60);
  const [showPreview, setShowPreview] = useState(false);
  const [currentVideoBlob, setCurrentVideoBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPracticeQuestion, setIsPracticeQuestion] = useState(true);
  const [isStartingRecording, setIsStartingRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const preparationTimerRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await interviewService.getQuestions(interviewId);
        
        const practiceQ = {
          id: 0,
          text: "Introduce yourself.",
          preparationTime: 10,
          recordingTime: 10,
          isPractice: true
        };
        
        const allQuestions = [practiceQ, ...data];
        setQuestions(allQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load interview questions. Please try again.");
        setLoading(false);
      }
    }
    
    fetchQuestions();
  }, [interviewId]);

  useEffect(() => {
    const checkAndInitializeCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Media devices not available");
        setError("Your browser doesn't support camera access. Please use a modern browser with camera permissions enabled.");
        setLoading(false);
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
        setError("Unable to access your camera or microphone. Please ensure you've granted permission and no other application is using them.");
        setLoading(false);
      }
    };

    if (!loading && questions.length > 0) {
      checkAndInitializeCamera();
    }

    return () => stopCamera();
  }, [navigate, loading, questions]);

  useEffect(() => {
    if (preparationTime === 0) {
      startRecording();
    }
  }, [preparationTime]);

  useEffect(() => {
    if (preparationTime === 0 && isPreparing) {
      setIsPreparing(false);
      setShowWarning(false);
      startRecording();
    }
  }, [preparationTime]);

  useEffect(() => {
    const handleAutoStop = async () => {
      if (isRecording && countdown <= 0) {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.requestData();
          await new Promise(resolve => setTimeout(resolve, 100));
          stopRecording();
        }
      }
    };
  
    handleAutoStop();
  }, [countdown, isRecording]);

  useEffect(() => {
    setIsPracticeQuestion(questions[currentQuestionIndex]?.isPractice ?? false);
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (currentQuestionIndex >= 0 && questions[currentQuestionIndex]) {
      setPreparationTime(questions[currentQuestionIndex].preparationTime);
      setCountdown(questions[currentQuestionIndex].recordingTime);
      setIsPreparing(true);
      setHasAnswered(false);
      startPreparationTimer();
    }
  }, [currentQuestionIndex]);

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
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const prepTime = currentQuestion.preparationTime || 60;
    setPreparationTime(prepTime);
    
    preparationTimerRef.current = setInterval(() => {
      setPreparationTime((prev) => {
        if (prev <= 1) {
          clearInterval(preparationTimerRef.current);
          setIsStartingRecording(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (!stream) return;
    
    setIsPreparing(false);
    setIsRecording(true);
    setIsStartingRecording(false);
    setStartTime(Date.now());

    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: 'video/webm'
      });
      setCurrentVideoBlob(blob);
      setShowPreview(true);
      setHasAnswered(true);
      
      saveRecording(blob);
    };
    
    mediaRecorder.start();
    startAnswerTimer();
  };

  const saveRecording = async (blob) => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      await interviewService.saveRecording({
        interviewId,
        questionId: currentQuestion.id,
        recordingBlob: blob,
        duration: countdown - (countdown - Math.floor((Date.now() - startTime) / 1000))
      });
      
      console.log("Recording saved successfully");
    } catch (error) {
      console.error("Failed to save recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const startAnswerTimer = () => {
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const recTime = currentQuestion.recordingTime || 180;
    setCountdown(recTime);
    
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 31 && !showWarning) {
          setShowWarning(true);
        }
        
        if (prev <= 1) {
          stopRecording();
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePreviewClose = async (action) => {
    if (!action || action === 'cancel') {
      return;
    }

    setShowPreview(false);

    if (action === 're-record') {
      stream.getTracks().forEach(track => track.enabled = true);
      setCountdown(questions[currentQuestionIndex].recordingTime);
      setHasAnswered(false);
      startPreparationTimer();
    } else if (action === 'continue') {
      if (!questions[currentQuestionIndex].isPractice && currentVideoBlob) {
        try {
          const formData = new FormData();
          formData.append('video', currentVideoBlob, `question_${currentQuestionIndex}.webm`);
          formData.append('questionId', currentQuestionIndex.toString());
          
          const response = await fetch('http://localhost:8000/api/upload-video', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Video upload failed');
          }
        } catch (error) {
          console.error('Error uploading video:', error);
        }
      }

      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        stream.getTracks().forEach(track => track.enabled = true);
        if (preparationTimerRef.current) {
          clearInterval(preparationTimerRef.current);
        }
        setPreparationTime(questions[nextIndex].preparationTime);
        setCountdown(questions[nextIndex].recordingTime);
        setHasAnswered(false);
        setIsPreparing(true);
        setShowWarning(false);
      } else {
        completeInterview();
      }
    }

    setCurrentVideoBlob(null);
    chunksRef.current = [];
    setRecordedChunks([]);
  };

  const handleContinue = () => {
    setShowPreview(false);
    setShowWarning(false);
    
    if (isPracticeQuestion || currentQuestionIndex < questions.length - 1) {
      if (isPracticeQuestion) {
        setIsPracticeQuestion(false);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      
      setHasAnswered(false);
      setIsPreparing(true);
      startPreparationTimer();
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    try {
      await interviewService.completeInterview(interviewId);
      navigate('/thank-you');
    } catch (error) {
      console.error("Failed to complete interview:", error);
      navigate('/thank-you');
    }
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

  const calculateProgress = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const renderQuestionHeader = () => {
    if (isPracticeQuestion) {
      return `Practice Question: ${questions[currentQuestionIndex].text}`;
    }
    return `Q${currentQuestionIndex}. ${questions[currentQuestionIndex].text}`;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading interview questions...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={buttonSx}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const currentQuestion = questions.length > 0 ? 
    questions[currentQuestionIndex] : 
    { text: "Loading question..." };

  const isLastQuestion = currentQuestionIndex === questions.length - 1 && !isPracticeQuestion;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <ProgressTracker 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          isPracticeQuestion={isPracticeQuestion}
        />

        <QuestionDisplay 
          currentQuestion={questions[currentQuestionIndex]}
          isPracticeQuestion={isPracticeQuestion}
          currentQuestionIndex={currentQuestionIndex}
          formatTime={formatTime}
        />

        <TimerComponent 
          isPreparing={isPreparing}
          preparationTime={preparationTime}
          formatTime={formatTime}
        />

        <VideoRecorder 
          videoRef={videoRef}
          isRecording={isRecording}
          hasAnswered={hasAnswered}
          isPreparing={isPreparing}
                    "Take a breath between questions to maintain your composure."rding={startRecording}
                  )}Recording={stopRecording}
                </Typography>own={countdown}
              </Box>Duration={questions[currentQuestionIndex].recordingTime}
            </Box>    formatTime={formatTime}
                 />
            {/* Action buttons */}
            <Box sx={{ mt: 'auto' }}>
              {isPreparing && (en={showPreview}
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={startRecording}
                  startIcon={<Videocam />}
                >
                  I'm Ready - Start Recording
                </Button>
              )}terview;                            {isRecording && (                <Button                   variant="contained"                   color="error"                   fullWidth                  onClick={stopRecording}                  startIcon={<MicOff />}                >                  Stop Recording                </Button>              )}            </Box>          </Paper>        </Grid>      </Grid>            <Snackbar         open={notifications.open}         autoHideDuration={6000}         onClose={() => setNotifications(prev => ({ ...prev, open: false }))}      >        <Alert           severity={notifications.severity}           onClose={() => setNotifications(prev => ({ ...prev, open: false }))}          sx={{ width: '100%' }}        >          {notifications.message}        </Alert>      </Snackbar>    </Container>  );};export default Interview;