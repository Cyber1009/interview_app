import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken } from '../../utils/tokenGenerator';
import { Box, TextField, Button, Typography, Paper, Container, Link } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Interview Access Component
 * Handles:
 * - Access token validation
 * - Interview entry control
 * - Token status management
 * - Error handling for invalid tokens
 * - Navigation to interview after successful validation
 */

const InterviewAccess = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [savedTokens, setSavedTokens] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load tokens when component mounts
        const tokensFromStorage = JSON.parse(localStorage.getItem('interviewTokens') || '[]');
        setSavedTokens(tokensFromStorage);
        
        // For testing/debugging - add a demo token if none exist
        if (tokensFromStorage.length === 0) {
            const demoToken = {
                token: 'DEMO123',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                used: false
            };
            localStorage.setItem('interviewTokens', JSON.stringify([demoToken]));
            setSavedTokens([demoToken]);
            console.log('Added demo token for testing:', demoToken);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Normalize token to uppercase and trim whitespace
        const normalizedToken = token.trim().toUpperCase();
        
        if (!normalizedToken) {
            setError('Please enter a token');
            return;
        }
        
        // Log for debugging
        console.log('Validating token:', normalizedToken);
        console.log('Available tokens:', savedTokens);
        
        const validation = validateToken(normalizedToken, savedTokens);

        if (validation.isValid) {
            // Mark token as used
            const updatedTokens = savedTokens.map(t => 
                t.token === normalizedToken ? { ...t, used: true } : t
            );
            localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
            
            // Store the token in session for interview access
            sessionStorage.setItem('interviewToken', normalizedToken);
            navigate('/instructions');
        } else {
            setError(validation.message);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Paper elevation={2} sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <VpnKeyIcon 
                            sx={{ 
                                fontSize: 48, 
                                color: 'primary.main',
                                mb: 2
                            }} 
                        />
                        <Typography 
                            variant="h4" 
                            gutterBottom
                            color="primary"
                        >
                            Enter Access Token
                        </Typography>
                        <Typography color="text.secondary">
                            Please enter the token provided by your interviewer
                        </Typography>
                    </Box>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit}
                        sx={{
                            '& .MuiTextField-root': {
                                mb: 3
                            }
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Access Token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            error={!!error}
                            helperText={error || "For testing, try: DEMO123"}
                            variant="outlined"
                            InputProps={{
                                sx: { 
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    letterSpacing: 1
                                }
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                mb: 2
                            }}
                        >
                            Continue
                        </Button>
                        
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                color="inherit"
                                onClick={() => navigate('/welcome')}
                                sx={{ textTransform: 'none' }}
                            >
                                Back to welcome page
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default InterviewAccess;
