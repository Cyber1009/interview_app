import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken } from '../../utils/tokenGenerator';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const InterviewAccess = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const savedTokens = JSON.parse(localStorage.getItem('interviewTokens') || '[]');
        const validation = validateToken(token.toUpperCase(), savedTokens);

        if (validation.isValid) {
            // Mark token as used
            const updatedTokens = savedTokens.map(t => 
                t.token === token.toUpperCase() ? { ...t, used: true } : t
            );
            localStorage.setItem('interviewTokens', JSON.stringify(updatedTokens));
            
            // Store the token in session for interview access
            sessionStorage.setItem('interviewToken', token.toUpperCase());
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
                            helperText={error}
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
                                fontSize: '1.1rem'
                            }}
                        >
                            Continue
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default InterviewAccess;
