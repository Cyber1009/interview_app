/**
 * Interview Access Component
 * 
 * Provides token validation interface for candidates to access interviews.
 * Handles error states and redirects to appropriate pages.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  alpha
} from '@mui/material';
import KeyIcon from '@mui/icons-material/VpnKey';
import { candidatesAPI } from '../../api'; // Updated to use consolidated API
import { ThemeService } from '../../services';

// Colors from sample.html for consistency
const sampleColors = {
  background: '#b6c2c9',
  cardBackground: '#fff',
  labelBackground: '#e5eaf1',
  labelColor: '#52606d',
  buttonBackground: '#091326',
  buttonColor: '#fff',
  headerColor: '#091326',
};

const InterviewAccess = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Please enter a valid access token');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Get interview details by token - uses POST /api/v1/candidates/tokens/{token}
      // Note: The response is unwrapped by axios interceptor (response.data is already returned)
      const response = await candidatesAPI.getInterviewByToken(token.trim());
      
      // Check if response has the expected format with interview data
      // Since axios already unwrapped the response, we don't need to check response.data
      if (response && response.id) {
        // Save token for future API calls
        localStorage.setItem('interviewToken', token.trim());
        
        // Save interview ID
        localStorage.setItem('interviewId', response.id);
        
        // Process questions data from the response
        if (response.questions && Array.isArray(response.questions)) {
          // Format questions to match the expected structure in the app
          const formattedQuestions = response.questions.map(q => ({
            id: q.id,
            text: q.text,
            preparationTime: q.preparation_time,
            recordingTime: q.responding_time,
            isPractice: false,
            order: q.order
          }));
          
          // Store formatted questions in localStorage
          localStorage.setItem('interviewQuestions', JSON.stringify(formattedQuestions));
          
          // Store the original interview data for reference
          localStorage.setItem('interviewData', JSON.stringify({
            id: response.id,
            title: response.title,
            created_at: response.created_at,
            questionsCount: response.questions.length
          }));

          // Process theme data if it exists in the response
          if (response.theme) {
            // Save theme data using ThemeService
            const themeData = {
              primaryColor: response.theme.primary_color,
              accentColor: response.theme.accent_color,
              backgroundColor: response.theme.background_color,
              textColor: response.theme.text_color,
              logoUrl: response.theme.company_logo
            };
            
            // Store theme in sessionStorage for this interview session
            sessionStorage.setItem('interviewTokenTheme', JSON.stringify(themeData));
            
            // Set company logo if provided
            if (response.theme.company_logo) {
              sessionStorage.setItem('interviewLogo', response.theme.company_logo);
            }
          }
          
          // Success! Navigate to instructions
          navigate('/instructions');
        } else {
          setError('Interview has no questions. Please contact the interviewer.');
        }
      } else {
        setError('Invalid access token or incomplete interview data. Please check and try again.');
      }
    } catch (err) {
      console.error('Token validation error:', err);
      
      // Provide specific error message based on response
      const errorDetail = err.response?.data?.detail || err.detail;
      let errorMessage = 'Unable to validate token. Please try again later.';
      
      if (typeof errorDetail === 'object') {
        // Handle structured error responses
        if (errorDetail.status === 'expired') {
          errorMessage = 'This interview token has expired.';
        } else if (errorDetail.status === 'invalid') {
          errorMessage = 'Invalid interview token. Please check and try again.';
        } else if (errorDetail.message) {
          errorMessage = errorDetail.message;
        }
      } else if (errorDetail) {
        errorMessage = errorDetail;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: alpha(sampleColors.background, 0.5), // Using sample.html background color
      py: 8
    }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: sampleColors.cardBackground,
            boxShadow: '0 4px 24px 0 rgba(80,86,96,0.10)' // Using shadow from sample
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4
          }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: alpha(sampleColors.labelBackground, 0.6), // Using sample color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <KeyIcon sx={{ fontSize: 32, color: sampleColors.buttonBackground }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                textAlign: 'center',
                fontWeight: 700,
                color: sampleColors.headerColor // Using sample.html header color
              }}
            >
              Enter Access Token
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                textAlign: 'center', 
                mb: 4, 
                maxWidth: '80%',
                color: sampleColors.labelColor // Using sample.html label color
              }}
            >
              To access your interview session, please enter the token provided to you by the interviewer.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Access Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              margin="normal"
              variant="outlined"
              disabled={loading}
              placeholder="Enter your access token"
              InputProps={{
                sx: {
                  bgcolor: alpha(sampleColors.labelBackground, 0.3),
                  '&:hover': {
                    bgcolor: alpha(sampleColors.labelBackground, 0.5),
                  },
                  '&.Mui-focused': {
                    bgcolor: sampleColors.cardBackground,
                  }
                }
              }}
              sx={{ 
                mb: 4,
                '& .MuiInputLabel-root': { 
                  color: sampleColors.labelColor 
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: sampleColors.buttonBackground,
                  }
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                bgcolor: sampleColors.buttonBackground, // Using sample.html button color
                color: sampleColors.buttonColor,
                '&:hover': {
                  bgcolor: alpha(sampleColors.buttonBackground, 0.85)
                },
                '&.Mui-disabled': {
                  bgcolor: alpha(sampleColors.buttonBackground, 0.6)
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Access Interview'
              )}
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button 
                onClick={() => navigate('/')}
                size="small"
                sx={{ 
                  color: sampleColors.labelColor, // Using sample.html color
                  '&:hover': {
                    bgcolor: alpha(sampleColors.labelBackground, 0.5),
                  }
                }}
              >
                Return to Welcome Page
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default InterviewAccess;
