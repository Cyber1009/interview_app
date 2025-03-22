/**
 * Camera Permissions Component
 * Handles:
 * - Camera and microphone access requests
 * - Permission status tracking
 * - Device compatibility checks
 * - User guidance for permissions
 */

import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Container } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';

const CameraPermissions = ({ onPermissionsGranted }) => {
  const [checking, setChecking] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [error, setError] = useState('');

  const checkPermissions = async () => {
    try {
      setChecking(true);
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setCameraPermission(true);
      setMicrophonePermission(true);
      
      stream.getTracks().forEach(track => track.stop());
      
      setTimeout(() => {
        onPermissionsGranted();
      }, 500);

    } catch (error) {
      console.error('Permission error:', error);
      setCameraPermission(false);
      setMicrophonePermission(false);
      setError(error.name === 'NotAllowedError' ? 
        'Please allow camera and microphone access and try again' : 
        'Camera or microphone not available. Please check your device settings.'
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Camera & Microphone Access Required
        </Typography>
        
        <Typography paragraph sx={{ mt: 2 }}>
          To participate in the video interview, please:
        </Typography>

        <Box sx={{ ml: 2, mb: 3 }}>
          <Typography component="li">Allow access when your browser asks for camera permissions</Typography>
          <Typography component="li">Allow access when your browser asks for microphone permissions</Typography>
          <Typography component="li">If denied, click the camera icon in your browser's address bar to enable</Typography>
        </Box>

        {/* Permission status indicators */}
        <Box sx={{ mt: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VideocamIcon color={cameraPermission ? 'success' : 'error'} sx={{ mr: 1 }} />
            <Typography>
              Camera: {cameraPermission ? 'Allowed ✓' : 'Access needed ✗'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MicIcon color={microphonePermission ? 'success' : 'error'} sx={{ mr: 1 }} />
            <Typography>
              Microphone: {microphonePermission ? 'Allowed ✓' : 'Access needed ✗'}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {(!cameraPermission || !microphonePermission) && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={checkPermissions}
              size="large"
              startIcon={checking ? <CircularProgress size={20} color="inherit" /> : null}
              disabled={checking}
              sx={{ px: 4, py: 1.5 }}
            >
              {checking ? 'Checking...' : 'Check Camera & Microphone'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CameraPermissions;