/**
 * Application Entry Point
 * Handles:
 * - React root rendering
 * - StrictMode implementation
 * - Initial application mounting
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);