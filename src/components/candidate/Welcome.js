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
import { Container, Paper, Typography, Button, Box, Grid, alpha } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import QuietIcon from '@mui/icons-material/VolumeOff';
import WifiIcon from '@mui/icons-material/Wifi';
import KeyIcon from '@mui/icons-material/VpnKey';
import VideocamIcon from '@mui/icons-material/Videocam';
import { getCardStyles, getButtonStyles } from '../../utils/themeUtils';

// Import the shared component colors from our theme.js
import { componentColors } from '../../styles/theme';

const Welcome = () => {
  const navigate = useNavigate();
  return (    <Box sx={{
      minHeight: '100vh',
      bgcolor: alpha(componentColors.background, 0.5), 
      py: 8
    }}>      <Container maxWidth="md">        <Paper 
          elevation={2}
          sx={getCardStyles({ backgroundColor: componentColors.cardBackground })}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>            <Typography 
              variant="h3" 
              gutterBottom              sx={{ 
                fontWeight: 700,
                color: componentColors.headerColor
              }}
            >
              Welcome
            </Typography>
            <Typography 
              variant="h6"              sx={{ 
                mb: 4,
                color: componentColors.labelColor
              }}
            >
              You're about to begin your video interview
            </Typography>
          </Box>          <Grid container spacing={4} sx={{ mb: 6 }}>
            {[              { icon: <QuietIcon sx={{ fontSize: 40, color: componentColors.buttonBackground }}/>, text: 'Ensure you are in a quiet, well-lit environment' },
              { icon: <WifiIcon sx={{ fontSize: 40, color: componentColors.buttonBackground }}/>, text: 'Check your internet connection stability' },
              { icon: <KeyIcon sx={{ fontSize: 40, color: componentColors.buttonBackground }}/>, text: 'Have your access token ready' },
              { icon: <VideocamIcon sx={{ fontSize: 40, color: componentColors.buttonBackground }}/>, text: 'Test your camera and microphone' }
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
                    border: '1px solid',                    borderColor: alpha(componentColors.labelBackground, 0.8),
                    bgcolor: alpha(componentColors.labelBackground, 0.3),
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {item.icon}
                  <Typography sx={{ color: componentColors.labelColor }}>{item.text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center' }}>            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/interview-access')}              sx={{
                ...getButtonStyles({ 
                  backgroundColor: componentColors.buttonBackground, 
                  textColor: componentColors.buttonColor 
                }),
                px: 6,
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