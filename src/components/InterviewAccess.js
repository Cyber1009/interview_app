import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const InterviewAccess = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.validateToken(token);
            localStorage.setItem('interviewToken', token);
            navigate('/interview');
        } catch (error) {
            setError('Invalid or expired token');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card sx={{ maxWidth: 400, width: '100%', m: 2 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 3 }}>Enter Interview Access Token</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Access Token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            margin="normal"
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ mt: 3 }}
                        >
                            Start Interview
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default InterviewAccess;
