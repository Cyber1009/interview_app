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

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  useTheme
} from '@mui/material';
import VideoReview from './VideoReview';
import VideoRecorder from './VideoRecorder';
import QuestionDisplay from './QuestionDisplay';
import TimerComponent from './TimerComponent';
import ProgressTracker from './ProgressTracker';
import { candidatesAPI } from '../../api'; // Updated to use consolidated API
import { ThemeService } from '../../services';

function Interview() {
  const { interviewId } = useParams(); // Get interview ID from URL params
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('interviewQuestions'));
    // Instead of using imported practice question, create it inline
    const practiceQ = {
      id: 0,
      text: "Introduce yourself.",
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
  const [countdown, setCountdown] = useState(180);
  const [preparationTime, setPreparationTime] = useState(60);
  const [showPreview, setShowPreview] = useState(false);
  const [currentVideoBlob, setCurrentVideoBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPracticeQuestion, setIsPracticeQuestion] = useState(true);
  const [isStartingRecording, setIsStartingRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const preparationTimerRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();
  const theme = useTheme();

  // Effect to start interview session when component mounts - UPDATED to work with corrected API structure
  useEffect(() => {
    // Create a session creation flag to prevent duplicate requests
    let isSessionCreationAttempted = false;
    
    const startSession = async () => {
      // Only attempt to create a session once
      if (interviewId && !isSessionCreationAttempted && !sessionId) {
        isSessionCreationAttempted = true;
        
        try {
          // Get the stored interview token from localStorage
          const token = localStorage.getItem('interviewToken');
          
          if (!token) {
            console.error('No interview token found in localStorage');
            navigate('/interview-access');
            return;
          }
          
          console.log('Getting interview by token:', token);
          
          try {
            // First, just get interview details without creating a session
            const interviewResponse = await candidatesAPI.getInterviewByToken(token);
            console.log('Interview response:', interviewResponse);
            
            // If we have questions from the API, use those instead of default
            if (interviewResponse.questions) {
              const practiceQ = {
                id: 0,
                text: "Introduce yourself.",
                preparationTime: 10,
                recordingTime: 10,
                isPractice: true
              };
              
              setQuestions([
                practiceQ, 
                ...interviewResponse.questions.map(q => ({
                  id: q.id,
                  text: q.text,
                  preparationTime: q.preparation_time || 60,
                  recordingTime: q.responding_time || 120,
                  isPractice: false
                }))
              ]);
            }
            
            // Then separately create the session (this will mark the token as used)
            // Only do this once to avoid "token already used" errors
            try {
              const sessionResponse = await candidatesAPI.startInterview({ token });
              console.log('Session response:', sessionResponse);
              
              setSessionId(sessionResponse.id);
            } catch (sessionError) {
              console.error('Session creation error:', sessionError);
              
              // If session creation fails but we still have interview data,
              // we can continue but some features might be limited
              alert("Warning: There was an issue starting your interview session. You may continue, but your responses might not be recorded properly.");
            }
            
            // Use the theme that was already fetched during token validation
            const storedTheme = sessionStorage.getItem('interviewTokenTheme');
            if (storedTheme) {
              console.log('Using theme from token verification');
            } else {
              console.log('No theme found in sessionStorage, using default theme');
            }
          } catch (error) {
            console.error('Interview data fetching error:', error);
            
            // Token validation failed - could be invalid
            if (error.response && error.response.status === 400) {
              // Clear the invalid token from storage
              localStorage.removeItem('interviewToken');
              
              alert("This interview token is invalid or has already been used. Please request a new token.");
              navigate('/interview-access');
              return;
            }
            
            // Other errors
            alert("There was a problem accessing your interview data. Please try again.");
            navigate('/instructions');
          }
        } catch (error) {
          console.error('Failed to start interview session:', error);
          navigate('/instructions');
        }
      }
    };
    
    startSession();

    // Clear interview theme when component unmounts
    return () => {
      ThemeService.clearActiveInterviewTheme();
    };
  }, [interviewId, navigate, sessionId]);

  // Initialize camera and microphone access
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
        startPreparationTimer();
      } catch (err) {
        console.error("Camera access error:", err);
        navigate('/instructions');
      }
    };

    checkAndInitializeCamera();

    return () => stopCamera();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (preparationTime === 0) {
      startRecording();  // Move startRecording() here to ensure it runs after state updates
    }
  }, [preparationTime]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (preparationTime === 0 && isPreparing) {
      setIsPreparing(false);
      setShowWarning(false);
      startRecording();
    }
  }, [preparationTime]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleAutoStop = async () => {
      if (isRecording && countdown <= 0) {
        // Ensure we have all chunks before stopping
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          // Request the final chunk
          mediaRecorderRef.current.requestData();
          // Small delay to ensure the last chunk is captured
          await new Promise(resolve => setTimeout(resolve, 100));
          stopRecording();
        }
      }
    };
  
    handleAutoStop();
  }, [countdown, isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Update when question changes
    setIsPracticeQuestion(questions[currentQuestionIndex]?.isPractice ?? false);
  }, [currentQuestionIndex, questions]);

  // Add new useEffect to handle question changes
  useEffect(() => {
    if (currentQuestionIndex >= 0 && questions[currentQuestionIndex]) {
      // Reset states for new question
      setPreparationTime(questions[currentQuestionIndex].preparationTime);
      setCountdown(questions[currentQuestionIndex].recordingTime);
      setIsPreparing(true);
      setHasAnswered(false);
      startPreparationTimer();
    }
  }, [currentQuestionIndex, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format time helper function
  const formatTime = (seconds) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // Start preparation timer
  const startPreparationTimer = () => {
    const currentPreparationTime = questions[currentQuestionIndex]?.preparationTime || 60;
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

  // Stop camera function
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

  // Start recording function
  const startRecording = async () => {
    // Prevent multiple clicks while starting recording
    if (isStartingRecording || isRecording) return;
    
    setIsStartingRecording(true);
    
    try {
      // Stop any existing recording first
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure cleanup
      }

      if (isPreparing) {
        clearInterval(preparationTimerRef.current);
        setIsPreparing(false);
        setShowWarning(false);
      }

      chunksRef.current = [];
      const currentQuestionTime = questions[currentQuestionIndex]?.recordingTime || 120;
      setCountdown(currentQuestionTime);
      
      if (!stream) {
        throw new Error("No media stream available");
      }

      // Re-enable tracks if they were disabled
      stream.getTracks().forEach(track => track.enabled = true);

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

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);

      const startTimeStamp = Date.now();
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
    } finally {
      setIsStartingRecording(false);
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerRef.current);
      setIsRecording(false);
      setCountdown(0);
      
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          setCurrentVideoBlob(blob);
          setHasAnswered(true);
          setShowPreview(true);
          stream.getTracks().forEach(track => track.enabled = false);
        }
      } catch (err) {
        console.error("Error stopping recording:", err);
      }
    }
  };

  // Handle preview close function
  const handlePreviewClose = async (action) => {
    if (!action || action === 'cancel') {
      return;
    }

    setShowPreview(false);

    if (action === 're-record') {
      // Re-enable tracks for re-recording
      stream.getTracks().forEach(track => track.enabled = true);
      setCountdown(questions[currentQuestionIndex].recordingTime);
      setHasAnswered(false);
      startPreparationTimer();
    } else if (action === 'continue') {
      // Upload video if it's not a practice question
      if (!questions[currentQuestionIndex].isPractice && currentVideoBlob && sessionId) {
        try {
          // Use the saveRecording API with the correct parameters
          await candidatesAPI.saveRecording({
            sessionId: sessionId,
            questionId: questions[currentQuestionIndex].id,
            audioFile: currentVideoBlob
          });
        } catch (error) {
          console.error('Error uploading recording:', error);
          // Continue with the interview process despite any errors
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
        // Complete the interview session
        if (sessionId) {
          try {
            await candidatesAPI.completeInterview(sessionId);
          } catch (error) {
            console.error('Error completing interview:', error);
          }
        }
        stopCamera();
        // Clear interview theme before navigating away
        ThemeService.clearActiveInterviewTheme();
        navigate('/thank-you');
      }
    }

    setCurrentVideoBlob(null);
    chunksRef.current = [];
  };

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
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          countdown={countdown}
          questionDuration={questions[currentQuestionIndex]?.recordingTime || 0}
          formatTime={formatTime}
        />

        <VideoReview
          open={showPreview}
          onClose={handlePreviewClose}
          videoBlob={currentVideoBlob}
          allowReRecord={isPracticeQuestion}
        />
      </Paper>
    </Container>
  );
}

export default Interview;