/**
 * Loading Overlay Component
 * Provides:
 * - Fullscreen loading indicator
 * - Backdrop management
 * - Loading state visualization
 * - Z-index handling for modal display
 */

import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoadingOverlay = ({ open }) => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
    open={open}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default LoadingOverlay;