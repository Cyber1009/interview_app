import React, { useState, useEffect } from 'react';
import {
  Box, Typography
} from '@mui/material';
import TokenManagerExtended from './shared/TokenManagerExtended';
import { interviewerAPI } from '../../api';

/**
 * Token Management Component for Interviewers
 * Handles:
 * - Token generation for candidates
 * - Token listing and management
 * - Token deletion
 * - Token status tracking
 */
const AccessToken = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeInterviewId, setActiveInterviewId] = useState(null);

  useEffect(() => {
    const storedInterviewId = localStorage.getItem('activeInterviewId');
    if (storedInterviewId) {
      setActiveInterviewId(storedInterviewId);
    }
    
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      // Pass the interview ID when fetching tokens
      const response = await interviewerAPI.getTokens(activeInterviewId);
      setTokens(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setError(`Failed to fetch tokens: ${error.response?.data?.detail || error.message}`);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTokensChange = (updatedTokens) => {
    setTokens(updatedTokens);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Access Tokens
      </Typography>

      <TokenManagerExtended
        interviewId={activeInterviewId}
        tokens={tokens}
        loading={loading}
        error={error}
        onTokensChange={handleTokensChange}
        onError={handleError}
      />
    </Box>
  );
};

export default AccessToken;