/**
 * Camera Permissions Component
 * 
 * Handles requesting and checking camera/microphone permissions.
 * 
 * Features:
 * - Permission request UI
 * - Error handling for denied permissions
 * - Instructions for enabling permissions
 * - Device selection
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Videocam as VideoIcon, Mic as MicIcon } from '@mui/icons-material';

const CameraPermissions = ({ onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      setPermissionStatus('checking');
      setError(null);
      
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Stop the stream immediately after getting it
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      
      if (onPermissionGranted) {
        onPermissionGranted();
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setPermissionStatus('denied');
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera or microphone detected on your device.');
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera and microphone permissions are required for this application.');
      } else {
        setError(`Error accessing your camera: ${err.message}`);
      }
    }
  };

  if (permissionStatus === 'granted') {
    return null; // No UI needed when permissions are granted
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        textAlign: 'center'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          borderRadius: 2 
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Camera & Microphone Access
        </Typography>
        
        <Typography variant="body1" paragraph>
          This application requires access to your camera and microphone to record your interview responses.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Please ensure:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <VideoIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Your camera is connected and working" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MicIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Your microphone is connected and working" />
            </ListItem>
          </List>
        </Box>
        
        {permissionStatus === 'denied' && (
          <Box sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="subtitle1" gutterBottom>
              If you denied permission:
            </Typography>
            <Typography variant="body2" component="div">
              <ol>
                <li>Click the camera icon in your browser's address bar</li>
                <li>Select "Always allow" for both camera and microphone</li>
                <li>Refresh the page or click the button below</li>
              </ol>
            </Typography>
          </Box>
        )}
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={checkPermissions}
          fullWidth
        >
          {permissionStatus === 'checking' ? 'Checking Permissions...' : 'Allow Camera & Microphone Access'}
        </Button>
      </Paper>
    </Box>
  );
};

export default CameraPermissions;