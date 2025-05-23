/**
 * Video Review Component
 * Handles:
 * - Recorded video playback
 * - Re-recording options for practice questions
 * - Video review confirmation
 * - Transition to next questions
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckIcon from '@mui/icons-material/Check';

function VideoReview({ open, videoBlob, onClose, allowReRecord }) {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!videoBlob) {
      setIsLoaded(false);
      return;
    }

    // Create new URL for the blob
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);

    if (videoRef.current) {
      const video = videoRef.current;
      video.src = url;

      const handleCanPlay = () => {
        console.log('Video can play');
        setIsLoaded(true);
      };

      const handleError = (e) => {
        console.error('Video error:', e);
        setIsLoaded(false);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Return cleanup function
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        URL.revokeObjectURL(url);
        setVideoUrl(null);
      };
    }
  }, [videoBlob]);

  const handleClose = (action) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    setIsLoaded(false);
    onClose(action);
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={() => handleClose('cancel')}
    >
      <DialogTitle>Review Your Response</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          width: '100%', 
          position: 'relative',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'black',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <video
            ref={videoRef}
            controls
            playsInline
            autoPlay
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '70vh',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        {allowReRecord && (
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={() => handleClose('re-record')}
          >
            Record Again
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<CheckIcon />}
          onClick={() => handleClose('continue')}
          disabled={!isLoaded}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VideoReview;