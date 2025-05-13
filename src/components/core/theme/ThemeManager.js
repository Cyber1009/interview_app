/**
 * Theme Manager Component
 * 
 * Provides UI for theme customization and management.
 * 
 * Features:
 * - Theme color selection
 * - Logo upload and management
 * - Light/dark mode toggle
 * - Theme persistence
 * - Live theme preview
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Grid,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  alpha
} from '@mui/material';
import { ThemeService } from '../../../services';
import { extractColors } from '../../../utils';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import ColorPicker from './ColorPicker';
import ThemePreview from './ThemePreview';
import { colors, componentColors } from '../../../styles/theme';

const ThemeManager = ({ onThemeChange, logo, onLogoChange }) => {  const [themeData, setThemeData] = useState({
    primaryColor: localStorage.getItem('primaryColor') || colors.primary,
    secondaryColor: localStorage.getItem('secondaryColor') || colors.gray,
    backgroundColor: localStorage.getItem('backgroundColor') || colors.white,
    textColor: localStorage.getItem('textColor') || colors.gray,
    isDarkMode: false // Dark mode removed for simplicity
  });
  
  // Store advanced theme options separately
  const [themeOptions, setThemeOptions] = useState(() => {
    try {
      const savedOptions = localStorage.getItem('themeOptions');
      return savedOptions ? JSON.parse(savedOptions) : null;
    } catch (err) {
      console.error('Error parsing saved theme options:', err);
      return null;
    }
  });
  
  const [companyName, setCompanyName] = useState(
    localStorage.getItem('companyName') || ''
  );
  const [logoPreview, setLogoPreview] = useState(
    localStorage.getItem('companyLogo') || ''
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If a logo was provided, use it
    if (logo) {
      setLogoPreview(logo);
    }
  }, [logo]);

  const handleColorChange = (color, type) => {
    setThemeData(prev => ({
      ...prev,
      [type]: color
    }));
  };

  const handleLogoUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    setLoading(true);
    setError(null);
    
    const file = event.target.files[0];
    if (file.size > 2000000) {
      setError("Logo file is too large. Please use an image under 2MB.");
      setLoading(false);
      return;
    }
    
    try {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const logoData = e.target.result;
        setLogoPreview(logoData);
        
        // Try to extract colors from the logo using our enhanced algorithm
        try {
          console.log("Extracting colors from logo...");
          const colors = await extractColors(logoData);
          console.log("Extracted colors:", colors);
          
          // Update theme data with the extracted colors
          setThemeData(prev => ({
            ...prev,
            primaryColor: colors.primary,
            secondaryColor: colors.secondary,
            backgroundColor: prev.isDarkMode ? '#121212' : colors.background,
            textColor: prev.isDarkMode ? '#ffffff' : colors.text
          }));
          
          // Store the full theme options object for advanced styling
          setThemeOptions(colors.themeOptions);
          
          console.log("Theme updated with extracted colors");
        } catch (err) {
          console.error('Error extracting colors:', err);
          // Continue without color extraction
        }
        
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Error processing logo: " + err.message);
      setLoading(false);
    }
  };

  // Logo removal functionality has been removed
  // Users can now replace their logo by uploading a new one

  const handleSave = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Save theme data to localStorage
      localStorage.setItem('primaryColor', themeData.primaryColor);
      localStorage.setItem('secondaryColor', themeData.secondaryColor);
      localStorage.setItem('backgroundColor', themeData.backgroundColor);
      localStorage.setItem('textColor', themeData.textColor);
      localStorage.setItem('darkMode', themeData.isDarkMode.toString());
      localStorage.setItem('companyName', companyName);
      
      // Save the full theme options object if available
      if (themeOptions) {
        localStorage.setItem('themeOptions', JSON.stringify(themeOptions));
      }
      
      if (logoPreview) {
        localStorage.setItem('companyLogo', logoPreview);
        if (onLogoChange) {
          onLogoChange(logoPreview);
        }
      }
      
      // If we have a theme change callback, call it with updated theme
      if (onThemeChange) {
        // Create an enhanced theme object that includes our full palette
        const enhancedTheme = {
          palette: {
            primary: { 
              main: themeData.primaryColor,
              ...(themeOptions?.palette?.primary && {
                light: themeOptions.palette.primary.light,
                dark: themeOptions.palette.primary.dark,
                contrastText: themeOptions.palette.primary.contrastText
              })
            },
            secondary: { 
              main: themeData.secondaryColor,
              ...(themeOptions?.palette?.secondary && {
                light: themeOptions.palette.secondary.light,
                dark: themeOptions.palette.secondary.dark,
                contrastText: themeOptions.palette.secondary.contrastText
              })
            },
            background: { 
              default: themeData.backgroundColor,
              paper: '#ffffff' 
            },
            text: { 
              primary: themeData.textColor,
              ...(themeOptions?.palette?.text && {
                secondary: themeOptions.palette.text.secondary
              })
            },
            mode: themeData.isDarkMode ? 'dark' : 'light',
            ...(themeOptions?.palette?.divider && {
              divider: themeOptions.palette.divider
            })
          },
          // Include additional UI-specific settings
          ...(themeOptions?.sidebar && { sidebar: themeOptions.sidebar }),
          ...(themeOptions?.buttons && { buttons: themeOptions.buttons })
        };
        
        onThemeChange(enhancedTheme);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Error saving theme: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = () => {
    setThemeData(prev => {
      const isDarkMode = !prev.isDarkMode;
      
      // Adjust background and text colors for dark/light mode
      return {
        ...prev,
        isDarkMode,
        backgroundColor: isDarkMode ? '#121212' : '#ffffff',
        textColor: isDarkMode ? '#ffffff' : '#333333'
      };
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ 
        mb: 4, 
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '0.01em',
        color: 'text.primary'
      }}>
        Theme Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Theme changes saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Company Info Section */}
            <Card elevation={0} sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <CardHeader 
                title="Organization Details"
                sx={{
                  p: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                  '& .MuiCardHeader-title': {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    color: 'text.primary'
                  }
                }}
              />
              <CardContent sx={{ p: 2.5 }}>
                <TextField
                  label="Organization Name"
                  fullWidth
                  margin="normal"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </CardContent>
            </Card>

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
                    fontSize: '0.875rem',
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
                      {logoPreview ? (
                        <img
                          src={logoPreview}
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
                        variant={logoPreview ? "outlined" : "contained"}
                        component="label"
                        startIcon={<UploadIcon />}
                        sx={{ 
                          height: 48,
                          minWidth: '100%',
                          px: 3,
                          bgcolor: logoPreview ? 'transparent' : themeData.primaryColor,
                          borderColor: logoPreview ? themeData.primaryColor : 'transparent',
                          color: logoPreview ? themeData.primaryColor : '#ffffff',
                          '&:hover': {
                            bgcolor: logoPreview ? alpha(themeData.primaryColor, 0.08) : alpha(themeData.primaryColor, 0.8),
                            borderColor: logoPreview ? themeData.primaryColor : 'transparent',
                          },
                          '& .MuiButton-startIcon': {
                            position: 'absolute',
                            left: 16
                          },
                          '& .MuiButton-startIcon + span': {
                            margin: '0 auto'
                          }
                        }}
                      >
                        {logoPreview ? 'Replace Logo' : 'Upload Logo'}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleLogoUpload({ target: { files: [file] } });
                            }
                          }}
                        />
                      </Button>
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
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={themeData.isDarkMode}
                        onChange={handleModeToggle}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {themeData.isDarkMode ? (
                          <DarkModeIcon sx={{ mr: 1 }} />
                        ) : (
                          <LightModeIcon sx={{ mr: 1 }} />
                        )}
                        {themeData.isDarkMode ? "Dark Mode" : "Light Mode"}
                      </Box>
                    }
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                        bgcolor: themeData.primaryColor
                      }}>
                        <TextField
                          type="color"
                          value={themeData.primaryColor}
                          onChange={(e) => handleColorChange(e.target.value, 'primaryColor')}
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
                        Primary Color
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                        bgcolor: themeData.secondaryColor
                      }}>
                        <TextField
                          type="color"
                          value={themeData.secondaryColor}
                          onChange={(e) => handleColorChange(e.target.value, 'secondaryColor')}
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
                        Secondary Color
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      opacity: themeData.isDarkMode ? 0.5 : 1,
                      pointerEvents: themeData.isDarkMode ? 'none' : 'auto',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: themeData.isDarkMode ? 'none' : 'translateY(-2px)',
                        boxShadow: themeData.isDarkMode ? 0 : 1
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
                        bgcolor: themeData.backgroundColor
                      }}>
                        <TextField
                          type="color"
                          value={themeData.backgroundColor}
                          onChange={(e) => handleColorChange(e.target.value, 'backgroundColor')}
                          disabled={themeData.isDarkMode}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            left: -8,
                            width: '200%',
                            height: '200%',
                            opacity: 0,
                            cursor: themeData.isDarkMode ? 'default' : 'pointer'
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
                        Background Color
                        {themeData.isDarkMode && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <InfoIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', opacity: 0.7 }} />
                            <Typography variant="caption" color="text.secondary">
                              Controlled by dark mode
                            </Typography>
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      opacity: themeData.isDarkMode ? 0.5 : 1,
                      pointerEvents: themeData.isDarkMode ? 'none' : 'auto',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: themeData.isDarkMode ? 'none' : 'translateY(-2px)',
                        boxShadow: themeData.isDarkMode ? 0 : 1
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
                        bgcolor: themeData.textColor
                      }}>
                        <TextField
                          type="color"
                          value={themeData.textColor}
                          onChange={(e) => handleColorChange(e.target.value, 'textColor')}
                          disabled={themeData.isDarkMode}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            left: -8,
                            width: '200%',
                            height: '200%',
                            opacity: 0,
                            cursor: themeData.isDarkMode ? 'default' : 'pointer'
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
                        Text Color
                        {themeData.isDarkMode && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <InfoIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', opacity: 0.7 }} />
                            <Typography variant="caption" color="text.secondary">
                              Controlled by dark mode
                            </Typography>
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              sx={{ height: 48, px: 4 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
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
              <ThemePreview 
                colors={{
                  primary: themeData.primaryColor,
                  secondary: themeData.secondaryColor,
                  background: themeData.backgroundColor,
                  text: themeData.textColor
                }}
                themeOptions={themeOptions}
                logo={logoPreview}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThemeManager;