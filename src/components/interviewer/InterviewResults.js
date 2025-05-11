import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, 
  Table, TableBody, TableCell, TableHead, TableRow, Paper
} from '@mui/material';
// Import from consolidated API structure
import { interviewerAPI } from '../../api';

const InterviewResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await interviewerAPI.getAllResults();
      setResults(response.data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>Interview Results</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.token}</TableCell>
                <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>{result.duration}m</TableCell>
                <TableCell>{result.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default InterviewResults;
