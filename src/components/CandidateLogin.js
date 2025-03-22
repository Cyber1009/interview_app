/**
 * Candidate Login Component
 * Handles:
 * - Candidate authentication
 * - Login form management
 * - Interview access validation
 * - Navigation after successful login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock authentication logic
    if (email === 'candidate@example.com' && password === 'password') {
      localStorage.setItem('userRole', 'candidate');
      localStorage.setItem('authToken', 'mockCandidateToken');
      localStorage.setItem('interviewToken', 'mockInterviewToken'); // For interview access
      navigate('/interview'); // Redirect to the interview page
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Candidate Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default CandidateLogin;