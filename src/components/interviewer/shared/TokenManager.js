import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Snackbar, 
  Alert,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// Updated import to use the consolidated API
import { interviewerAPI } from '../../../api';

/**
 * TokenManager Component
 * 
 * Manages interview access tokens:
 * - Displays existing tokens
 * - Generates new tokens
 * - Copies token values to clipboard
 * - Deletes tokens
 */
const TokenManager = () => {
  const { interviewId } = useParams();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchTokens();
  }, [interviewId]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await interviewerAPI.getTokens(interviewId);
      if (response && response.data) {
        setTokens(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setSnackbar({ open: true, message: 'Failed to fetch tokens.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    setProcessingAction(true);
    try {
      const response = await interviewerAPI.generateToken(interviewId);
      if (response && response.data) {
        setSnackbar({ open: true, message: 'Token generated successfully.', severity: 'success' });
        fetchTokens();
      }
    } catch (error) {
      console.error('Failed to generate token:', error);
      setSnackbar({ open: true, message: 'Failed to generate token.', severity: 'error' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    setProcessingAction(true);
    try {
      await interviewerAPI.deleteToken(interviewId, tokenId);
      setSnackbar({ open: true, message: 'Token deleted successfully.', severity: 'success' });
      fetchTokens();
    } catch (error) {
      console.error('Failed to delete token:', error);
      setSnackbar({ open: true, message: 'Failed to delete token.', severity: 'error' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCopyToken = (tokenValue) => {
    navigator.clipboard.writeText(tokenValue);
    setSnackbar({ open: true, message: 'Token copied to clipboard.', severity: 'info' });
  };

  const renderTokensTable = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: 200 
        }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!tokens || tokens.length === 0) {
      return (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 200
        }}>
          <Typography color="text.secondary" paragraph>
            No access tokens available yet.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleGenerateToken}
            disabled={processingAction}
          >
            Generate First Token
          </Button>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token) => {
              const tokenValue = token.token_value || token.value || token.code;
              const isActive = token.is_active !== false;
              const isUsed = token.is_used === true;

              return (
                <TableRow key={token.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        {tokenValue}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyToken(tokenValue)}
                        sx={{ ml: 1 }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small"
                      label={isActive ? (isUsed ? "Used" : "Active") : "Expired"}
                      color={isActive ? (isUsed ? "default" : "success") : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    {token.created_at && new Date(token.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {token.expires_at && new Date(token.expires_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteToken(token.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Access Tokens
        </Typography>
        <Button 
          variant="contained" 
          startIcon={processingAction ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
          onClick={handleGenerateToken}
          disabled={processingAction}
          size="medium"
        >
          Generate Token
        </Button>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: 200
        }}
      >
        {renderTokensTable()}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TokenManager;