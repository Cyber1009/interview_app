/**
 * Candidate Welcome Component
 * Provides:
 * - Initial landing page for candidates
 * - Interview process overview
 * - Environment preparation guidance
 * - Navigation to interview access
 * - First-time user orientation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Grid, alpha, useTheme } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import QuietIcon from '@mui/icons-material/VolumeOff';
import WifiIcon from '@mui/icons-material/Wifi';
import KeyIcon from '@mui/icons-material/VpnKey';
import VideocamIcon from '@mui/icons-material/Videocam';

const Welcome = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main
              }}
            >
              Welcome
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                color: theme.palette.text.secondary
              }}
            >
              You're about to begin your video interview
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {[
              { icon: <QuietIcon sx={{ fontSize: 40, color: theme.palette.primary.main }}/>, text: 'Ensure you are in a quiet, well-lit environment' },
              { icon: <WifiIcon sx={{ fontSize: 40, color: theme.palette.primary.main }}/>, text: 'Check your internet connection stability' },
              { icon: <KeyIcon sx={{ fontSize: 40, color: theme.palette.primary.main }}/>, text: 'Have your access token ready' },
              { icon: <VideocamIcon sx={{ fontSize: 40, color: theme.palette.primary.main }}/>, text: 'Test your camera and microphone' }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.8),
                    bgcolor: alpha(theme.palette.background.default, 0.3),
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                >
                  {item.icon}
                  <Typography sx={{ color: theme.palette.text.secondary }}>{item.text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/interview-access')}
              sx={{
                px: 6,
                py: 2,
                borderRadius: 2,
                fontSize: '1.1rem',
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