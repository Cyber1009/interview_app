import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock authentication logic
    if (email === 'interviewer@example.com' && password === 'password') {
      localStorage.setItem('userRole', 'interviewer');
      localStorage.setItem('authToken', 'mockInterviewerToken');
      navigate('/interviewer-dashboard'); // Redirect to the interviewer dashboard
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Interviewer Login</h1>
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

export default InterviewerLogin;