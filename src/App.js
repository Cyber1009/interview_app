/**
 * Main Application Component
 * Serves as the root component and handles:
 * - Application routing configuration
 * - Theme provider setup and management
 * - Protected route implementations
 * - Component lazy loading
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AdminPanel,
  Welcome,
  Instructions,
  Interview,
  ThankYou,
  InterviewAccess,
  CameraPermissions,
  ProtectedRoute
} from './components';

function App() {
  const [theme, setTheme] = React.useState(() => {
    const savedTheme = localStorage.getItem('interviewTheme');
    return createTheme({
      palette: savedTheme ? JSON.parse(savedTheme).palette : {
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#1a2027', secondary: '#637381' }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '8px 16px',
            }
          }
        }
      }
    });
  });

  const handleThemeChange = (newTheme) => {
    const updatedTheme = createTheme(newTheme);
    setTheme(updatedTheme);
    localStorage.setItem('interviewTheme', JSON.stringify({
      palette: updatedTheme.palette
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPanel onThemeChange={handleThemeChange} />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/access" element={<InterviewAccess />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route 
            path="/interview" 
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            } 
          />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;