/**
 * PageContainer Component
 * 
 * A consistent container for all interviewer pages with:
 * - Standard header with icon and title
 * - Consistent spacing and layout
 * - Proper overflow handling
 * - Action button placement support
 */

import React from "react";
import {
  Box,
  Typography,
  Divider,
  alpha,
  useTheme
} from "@mui/material";
import { colors } from "../../styles/theme";
import { layout } from "../../styles/spacing";

const PageContainer = ({ 
  icon, 
  title, 
  actions, 
  children,
  noDivider = false,
  maxWidth = "1280px"  // Set a consistent max width across all pages
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: maxWidth,
        width: "100%",
        mx: "auto",
        px: layout.contentPadding, // Use centralized padding values
        py: { xs: 1, sm: 1, md: 1.5 }, // Reduced vertical padding
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "transparent", // Make container transparent
        borderRadius: "0" // Remove border radius
      }}
    >
      {/* Header with title, icon, and actions */}
      {title && (
        <Box
          sx={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            mb: noDivider ? 1 : 0.5,
            width: "100%",
            py: { xs: 1.5, sm: 1.5, md: 1.5 }  // Consistent vertical padding
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {icon && (
              React.cloneElement(icon, {
                sx: { mr: 1, fontSize: 22, color: "primary.main" }
              })
            )}
            <Typography variant="h6" component="h1" fontWeight={600}>
              {title}
            </Typography>
          </Box>
          
          {/* Actions area (buttons, etc.) */}
          {actions && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      
      {!noDivider && title && (
        <Divider sx={{ 
          mb: 1.5,
          mx: { xs: 1, sm: 2, md: 2 } // Consistent with reduced padding
        }} />
      )}
      
      {/* Main content */}
      <Box 
        sx={{ 
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          px: { xs: 1, sm: 2, md: 2.5 }, // Consistent inner content padding
          py: { xs: 1.5, sm: 2, md: 2 }, // Consistent vertical padding
          gap: 2 // Consistent gap between components
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;
