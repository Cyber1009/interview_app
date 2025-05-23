/**
 * Layout Utilities
 * 
 * Provides shared layout components and utility functions used by different
 * layout components (BaseLayout and SlimSidebarLayout) to reduce duplication.
 */

import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';
import { layout } from '../../../styles/spacing';

/**
 * Creates a consistent main content area for layouts
 */
export const MainContentArea = ({ children, drawerWidth, ...props }) => {
  return (
    <Box
      component="main"
      className="main-content-area"
      sx={{
        flexGrow: 1,
        bgcolor: 'var(--theme-background-color, #f5f5f5)', 
        color: 'var(--theme-text-color, #212121)', 
        p: layout.contentPadding, // Use centralized padding values
        overflowX: 'hidden',
        width: { xs: `calc(100% - ${drawerWidth}px)` },
        minHeight: '100vh',
        maxWidth: `calc(100% - ${drawerWidth}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowY: 'auto',
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
        boxSizing: 'border-box',
        ...props?.sx
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Creates drawer paper styles with consistent theming
 */
export const getDrawerPaperStyles = (width) => {
  return {
    boxSizing: 'border-box', 
    width: width,
    backgroundColor: 'var(--theme-background-color, #f5f5f5)',
    borderRight: '1px solid',
    borderColor: theme => alpha(theme.palette.divider, 0.1),
    boxShadow: '0px 0px 10px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(8px)',
    overflowX: 'hidden',
    transition: 'background-color 0.2s ease-in-out',
  };
};

export default {
  MainContentArea,
  getDrawerPaperStyles
};
