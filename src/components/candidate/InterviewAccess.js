import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

const InterviewAccess = ({ interviewService }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter an access token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await interviewService.validateAccessToken(token);
      
      if (response.valid) {
        localStorage.setItem('interviewToken', token);
        localStorage.setItem('interviewId', response.interviewId);
        navigate('/instructions');
      } else {
        setError('Invalid access token. Please check and try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error validating token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Interview Access
          </Typography>
          
          <Typography variant="body1" paragraph align="center">
            Please enter the access token you received to begin your interview.
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="token"
              label="Access Token"
              name="token"
              autoComplete="off"
              autoFocus
              value={token}
              onChange={handleTokenChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enter Interview'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InterviewAccess;
