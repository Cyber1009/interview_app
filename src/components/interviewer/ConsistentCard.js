/**
 * ConsistentCard Component
 * 
 * A reusable, standardized card component that ensures consistent styling
 * across the interview application.
 * 
 * Features:
 * - Standardized header styling
 * - Consistent padding and margins
 * - Optional accent border styling
 * - Support for various content layouts
 */

import React from 'react';
import { Card, CardContent, CardHeader, Box, alpha } from '@mui/material';
import { getStandardCardStyles, getStandardCardHeaderStyles } from '../../styles/theme';
import { layout } from '../../styles/spacing';

const ConsistentCard = ({ 
  title,
  subheader,
  icon,
  headerAction,
  children,
  accentColor,
  sx,
  contentSx,
  headerSx,
  noPadding = false,
  elevation = 0
}) => {
  return (    <Card
      elevation={elevation}
      sx={{
        ...getStandardCardStyles(),
        ...(accentColor ? {
          borderLeft: '4px solid',
          borderLeftColor: accentColor
        } : {}),
        bgcolor: 'var(--theme-background-paper, #f8f8f8)',
        color: 'var(--theme-text-color, #212121)',
        ...sx
      }}
    >
      {title && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={headerAction}
          avatar={icon ? (
            <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          ) : null}
          sx={{
            ...getStandardCardHeaderStyles(),
            ...headerSx
          }}
        />
      )}      <CardContent 
        sx={{ 
          p: noPadding ? 0 : layout.cardPadding/8, // Use centralized padding value
          '&:last-child': { pb: noPadding ? 0 : layout.cardPadding/8 }, // Use centralized padding value
          ...contentSx
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ConsistentCard;