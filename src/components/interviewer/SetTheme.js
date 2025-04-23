import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Paper,
  Card, CardContent, CardHeader, Divider
} from '@mui/material';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { alpha, createTheme } from '@mui/material/styles';
import { themeConfigs } from '../../styles/theme';  // Updated import path
import { extractColors } from '../../utils/colorExtractor';

const SetTheme = ({ onThemeChange, logo, onLogoChange }) => {
  const [themeColors, setThemeColors] = useState(() => {
    const savedTheme = localStorage.getItem('interviewTheme');
    const parsedTheme = savedTheme ? JSON.parse(savedTheme) : {};
    return {
      primary: parsedTheme?.palette?.primary?.main || '#2196F3',
      secondary: parsedTheme?.palette?.secondary?.main || '#FE6B8B',
      background: parsedTheme?.palette?.background?.default || '#f5f5f5',
      text: parsedTheme?.palette?.text?.primary || '#333333',
    };
  });

  const handleColorChange = (colorKey, value) => {
    const updatedColors = { ...themeColors, [colorKey]: value };
    setThemeColors(updatedColors);
    const themeUpdate = createTheme({
      palette: {
        primary: { main: updatedColors.primary },
        secondary: { main: updatedColors.secondary },
        background: { default: updatedColors.background },
        text: { primary: updatedColors.text }
      }
    });
    onThemeChange(themeUpdate);
    localStorage.setItem('interviewTheme', JSON.stringify({
      palette: themeUpdate.palette
    }));
  };

  const handleLogoUpload = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const logoDataUrl = e.target.result;
        onLogoChange(logoDataUrl);
        localStorage.setItem('companyLogo', logoDataUrl);

        // Extract colors from the logo
        try {
          const colors = await extractColors(logoDataUrl);
          const updatedColors = {
            primary: colors.primary,
            secondary: colors.secondary,
            background: colors.background,
            text: colors.text
          };
          
          setThemeColors(updatedColors);
          
          const themeUpdate = createTheme({
            palette: {
              primary: { main: updatedColors.primary },
              secondary: { main: updatedColors.secondary },
              background: { default: updatedColors.background },
              text: { primary: updatedColors.text }
            }
          });
          
          onThemeChange(themeUpdate);
          localStorage.setItem('interviewTheme', JSON.stringify({
            palette: themeUpdate.palette
          }));
        } catch (error) {
          console.error('Error extracting colors:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',  // Update page title font size
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Theme Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Company Logo Section */}
            <Card elevation={0} sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <CardHeader 
                title="Company Logo"
                sx={{
                  p: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                  '& .MuiCardHeader-title': {
                    fontSize: '0.875rem',  // Update card headers font size
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    color: 'text.primary'
                  }
                }}
              />
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <Box sx={{ 
                      width: '100%',
                      height: 140,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}>
                      {logo ? (
                        <img
                          src={logo}
                          alt="Company Logo"
                          style={{
                            maxWidth: '85%',
                            maxHeight: '85%',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ px: 2, textAlign: 'center' }}
                        >
                          No logo uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}>
                      <Button
                        fullWidth
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon />}
                        sx={{ 
                          height: 48,
                          minWidth: '100%',
                          px: 3,
                          '& .MuiButton-startIcon': {
                            position: 'absolute',
                            left: 16
                          },
                          '& .MuiButton-startIcon + span': {
                            margin: '0 auto'
                          }
                        }}
                      >
                        Upload Logo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleLogoUpload(file);
                            }
                          }}
                        />
                      </Button>
                      {logo && (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            onLogoChange(null);
                            localStorage.removeItem('companyLogo');
                          }}
                          sx={{ 
                            height: 48,
                            minWidth: '100%',
                            px: 3,
                            '& .MuiButton-startIcon': {
                              position: 'absolute',
                              left: 16
                            },
                            '& .MuiButton-startIcon + span': {
                              margin: '0 auto'
                            }
                          }}
                        >
                          Remove Logo
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Color Settings Section */}
            <Card elevation={0} sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <CardHeader 
                title="Theme Colours"
                sx={{
                  p: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                  '& .MuiCardHeader-title': {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em'
                  }
                }}
              />
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  {Object.entries(themeColors).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 1
                        }
                      }}>
                        <Box sx={{ 
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          border: '3px solid',
                          borderColor: 'divider',
                          bgcolor: value
                        }}>
                          <TextField
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              left: -8,
                              width: '200%',
                              height: '200%',
                              opacity: 0,
                              cursor: 'pointer'
                            }}
                          />
                        </Box>
                        <Typography 
                          sx={{ 
                            flex: 1,
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            letterSpacing: '0.01em',
                            textTransform: 'capitalize'
                          }}
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Preview Column */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              position: { md: 'sticky' },
              top: { md: 24 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <CardHeader 
              title="Preview"
              sx={{
                p: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                '& .MuiCardHeader-title': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }
              }}
            />
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                bgcolor: themeColors.background,
                p: 3,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
              }}>
                {logo && (
                  <Box sx={{ mb: 3, maxWidth: 120 }}>
                    <img
                      src={logo}
                      alt="Preview Logo"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                )}
                <Typography 
                  sx={{ 
                    color: themeColors.text,
                    mb: 2.5,
                    fontWeight: 500
                  }}
                >
                  Sample Question Text
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: 'column' }}>
                  <Button 
                    fullWidth
                    sx={{ 
                      bgcolor: themeColors.primary, 
                      color: '#fff',
                      '&:hover': { bgcolor: themeColors.primary }
                    }}
                  >
                    Primary Action
                  </Button>
                  <Button 
                    fullWidth
                    sx={{ 
                      bgcolor: themeColors.secondary, 
                      color: '#fff',
                      '&:hover': { bgcolor: themeColors.secondary }
                    }}
                  >
                    Secondary Action
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SetTheme;