import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  FiberManualRecord, 
  Stop, 
  Timer, 
  AccessTime,
} from '@mui/icons-material';
import VideoReview from './VideoReview';

const buttonSx = {
  px: 4,
  py: 1.5,
  fontSize: '1.1rem'
};

const useTimer = (initialTime, onComplete) => {
  const [time, setTime] = useState(initialTime);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = initialTime - elapsed;
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setTime(0);
        onComplete?.();
      } else {
        setTime(remaining);
      }
    }, 1000);
  }, [initialTime, onComplete]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return { time, startTimer, stopTimer };
};

function Interview() {
  const [questions, setQuestions] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('interviewQuestions')) || [];
    const practiceQ = {
      id: 0,
      text: "Practice: Introduce yourself.",
      preparationTime: 60,
      recordingTime: 120,
      isPractice: true
    };
    return [practiceQ, ...stored];
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentVideoBlob, setCurrentVideoBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPracticeQuestion, setIsPracticeQuestion] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const chunksRef = useRef([]);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const handleStopRef = useRef(null);
  const handleStartRef = useRef(null);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, []);

  const handleStopRecording = useCallback(() => {
    if (!mediaRecorder || !isRecording) return;

    try {
      stopRecordingTimer?.();
      setIsRecording(false);
      mediaRecorder.stop();
      stream?.getTracks().forEach(track => track.enabled = false);
    } catch (err) {
      console.error("Stop recording error:", err);
    }
  }, [mediaRecorder, isRecording, stream]);

  handleStopRef.current = handleStopRecording;

  const { time: preparationTime, startTimer: startPreparationTimer } = useTimer(
    questions[currentQuestionIndex]?.preparationTime || 60,
    () => {
      setIsPreparing(false);
      setShowWarning(false);
      handleStartRef.current?.();
    }
  );

  const { time: recordingTime, startTimer: startRecordingTimer, stopTimer: stopRecordingTimer } = useTimer(
    questions[currentQuestionIndex]?.recordingTime || 180,
    () => handleStopRef.current?.()
  );

  const handleStartRecording = useCallback(async () => {
    if (!stream?.active) return;

    try {
      stream.getTracks().forEach(track => {
        track.enabled = true;
      });

      if (isPreparing) {
        setIsPreparing(false);
        setShowWarning(false);
      }

      chunksRef.current = [];
      
      if (!mediaRecorder) return;
      
      mediaRecorder.start(1000);
      setIsRecording(true);
      startRecordingTimer();
    } catch (err) {
      console.error("Recording error:", err);
      alert(`Recording error: ${err.message}`);
    }
  }, [isPreparing, stream, mediaRecorder, startRecordingTimer]);

  handleStartRef.current = handleStartRecording;

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'interviewQuestions') {
        try {
          const newQuestions = JSON.parse(e.newValue || '[]');
          setQuestions(prevQuestions => {
            const practiceQ = prevQuestions.find(q => q.isPractice) || prevQuestions[0];
            return [practiceQ, ...newQuestions.filter(q => !q.isPractice)];
          });
        } catch (err) {
          console.error('Error updating questions:', err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Main camera initialization effect
  useEffect(() => {
    let mounted = true;
    let localStream = null;

    const initCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Media devices not available");
          navigate('/instructions');
          return;
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1280,
            height: 720,
            frameRate: 30
          },
          audio: true
        });

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = mediaStream;
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        const recorder = new MediaRecorder(mediaStream, {
          mimeType: 'video/webm;codecs=vp8,opus',
          videoBitsPerSecond: 1000000
        });

        recorder.ondataavailable = (event) => {
          if (event.data?.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          setCurrentVideoBlob(blob);
          setHasAnswered(true);
          setShowPreview(true);
        };
        
        setMediaRecorder(recorder);
        startPreparationTimer();
      } catch (err) {
        console.error("Camera access error:", err);
        navigate('/instructions');
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate, startPreparationTimer]);

  useEffect(() => {
    if (preparationTime === 0 && isPreparing) {
      setIsPreparing(false);
      setShowWarning(false);
      handleStartRecording();
    }
  }, [preparationTime, isPreparing, handleStartRecording]);

  useEffect(() => {
    if (isRecording && recordingTime <= 0) {
      handleStopRecording();
    }
  }, [recordingTime, isRecording, handleStopRecording]);

  useEffect(() => {
    setIsPracticeQuestion(questions[currentQuestionIndex]?.isPractice ?? false);
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (isPreparing && !isRecording) {
      startPreparationTimer();
    }
  }, [currentQuestionIndex, startPreparationTimer, isPreparing, isRecording]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, mediaRecorder]);

  const handlePreviewClose = (action) => {
    if (!action || action === 'cancel') {
      return;
    }

    setShowPreview(false);
    setCurrentVideoBlob(null);

    if (action === 're-record') {
      stream.getTracks().forEach(track => track.enabled = true);
      setHasAnswered(false);
      setIsPreparing(true);
      startPreparationTimer();
    } else if (action === 'continue') {
      if (currentQuestionIndex < questions.length - 1) {
        stream.getTracks().forEach(track => track.enabled = true);
        setCurrentQuestionIndex(prev => prev + 1);
        setHasAnswered(false);
        setIsPreparing(true);
        startPreparationTimer();
      } else {
        stream.getTracks().forEach(track => track.stop());
        navigate('/thank-you');
      }
    }

    chunksRef.current = [];
  };

  const renderQuestionHeader = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.isPractice) {
      return `Practice Question: ${currentQuestion.text}`;
    }
    return `Question ${currentQuestionIndex} of ${questions.length - 1}: ${currentQuestion.text}`;
  };

  const calculateProgress = () => {
    if (currentQuestionIndex === 0) return 0;
    return ((currentQuestionIndex) / (questions.length - 1)) * 100;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {questions[currentQuestionIndex]?.text || 'Loading...'}
          </Typography>
          
          {/* Timer displays */}
          {isPreparing && (
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              Preparation Time: {formatTime(preparationTime)}
            </Alert>
          )}

          {isRecording && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              Recording Time: {formatTime(recordingTime)}
            </Alert>
          )}

          {/* Video display */}
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            height: 400,
            bgcolor: 'black',
            borderRadius: 2,
            overflow: 'hidden',
            my: 3
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
              }}
            />
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {isPreparing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartRef.current}
                disabled={!stream}
              >
                Start Recording Early
              </Button>
            ) : isRecording ? (
              <Button
                variant="contained"
                color="error"
                onClick={handleStopRef.current}
              >
                Stop Recording
              </Button>
            ) : null}
          </Box>
        </Box>

        {/* Video Review Dialog */}
        {showPreview && currentVideoBlob && (
          <VideoReview
            open={showPreview}
            videoBlob={currentVideoBlob}
            onClose={handlePreviewClose}
            allowReRecord={questions[currentQuestionIndex]?.isPractice}
          />
        )}
      </Paper>
    </Container>
  );
}

export default Interview;