/**
 * Welcome Component
 * Provides:
 * - Initial landing page
 * - Interview process overview
 * - Environment preparation guidance
 * - Navigation to interview access
 * - First-time user orientation
 */

// src/components/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Grid } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import QuietIcon from '@mui/icons-material/VolumeOff';
import WifiIcon from '@mui/icons-material/Wifi';
import KeyIcon from '@mui/icons-material/VpnKey';
import VideocamIcon from '@mui/icons-material/Videocam';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 8
    }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom
              color="primary"
              sx={{ fontWeight: 700 }}
            >
              Welcome
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              You're about to begin your video interview
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {[
              { icon: <QuietIcon sx={{ fontSize: 40 }}/>, text: 'Ensure you are in a quiet, well-lit environment' },
              { icon: <WifiIcon sx={{ fontSize: 40 }}/>, text: 'Check your internet connection stability' },
              { icon: <KeyIcon sx={{ fontSize: 40 }}/>, text: 'Have your access token ready' },
              { icon: <VideocamIcon sx={{ fontSize: 40 }}/>, text: 'Test your camera and microphone' }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  {item.icon}
                  <Typography>{item.text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/interview-access')}
              sx={{
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem'
              }}
            >
              Begin Interview Process
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Welcome;