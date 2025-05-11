/**
 * ThemeSettings Component
 * 
 * Provides company theme and branding customization:
 * - Company logo upload
 * - Primary and accent color selection
 * - Custom theme preview
 * - Automatic theme updates
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
  alpha
} from '@mui/material';
import { colors } from '../../styles/theme';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { ThemeService } from '../../services';
import { useTheme } from '@mui/material/styles';
import { createThemeOptions } from '../../styles';
import { debounce } from 'lodash';

// Import color utility functions
import { 
  hexToRgb, 
  calculateLuminance, 
  getContrastRatio,
  getContrastColor,
  adjustColorLuminance,
  createContrastEnsuredPalette,
  isVeryLightColor
} from '../../utils/colorUtils';

const ThemeSettings = ({ onThemeChange, logo, onLogoChange }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Theme state
  const [themeData, setThemeData] = useState({
    primary_color: '#3f51b5',
    accent_color: '#f50057',
    background_color: '#f5f5f5',
    text_color: '#333333',
    logo_url: '',
    enable_dark_mode: false
  });
  
  const fileInputRef = useRef(null);  // Initialize CSS variables for immediate color preview
  useEffect(() => {
    // Target only the main content area for background color changes
    const mainContent = document.querySelector('.main-content-area');
    if (mainContent) {
      // Apply styles directly to the main content area
      mainContent.style.setProperty('--theme-background-color', themeData.background_color);
      mainContent.style.backgroundColor = themeData.background_color;
    }
    
    // Calculate a lighter background for cards (paper elements)
    const lightBackgroundForCards = adjustColorLuminance(themeData.background_color, 0.15);
    
    // Global theme colors still set at document level
    document.documentElement.style.setProperty('--theme-primary-color', themeData.primary_color);
    document.documentElement.style.setProperty('--theme-accent-color', themeData.accent_color);
    document.documentElement.style.setProperty('--theme-text-color', themeData.text_color);
    document.documentElement.style.setProperty('--theme-background-paper', lightBackgroundForCards);
    
    return () => {
      // Cleanup CSS variables when component unmounts
      if (mainContent) {
        mainContent.style.removeProperty('--theme-background-color');
        // Reset to default background
        mainContent.style.backgroundColor = '';
      }
      document.documentElement.style.removeProperty('--theme-primary-color');
      document.documentElement.style.removeProperty('--theme-accent-color');
      document.documentElement.style.removeProperty('--theme-text-color');
      document.documentElement.style.removeProperty('--theme-background-paper');
    };
  }, []);
  // Load theme data on component mount
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true);
        const response = await ThemeService.getUserTheme();
        
        if (response) {
          const primary = response.primary_color || '#3f51b5';
          const accent = response.accent_color || '#f50057';
          const background = response.background_color || '#f5f5f5';
          const text = response.text_color || '#333333';          // Target only the main content area for background color changes
          const mainContent = document.querySelector('.main-content-area');
          if (mainContent) {
            mainContent.style.setProperty('--theme-background-color', background);
            mainContent.style.backgroundColor = background;
          }
          
          // Calculate a lighter background for cards (paper elements)
          const lightBackgroundForCards = adjustColorLuminance(background, 0.15);
          
          // Global theme colors set at document level
          document.documentElement.style.setProperty('--theme-primary-color', primary);
          document.documentElement.style.setProperty('--theme-accent-color', accent);
          document.documentElement.style.setProperty('--theme-text-color', text);
          document.documentElement.style.setProperty('--theme-background-paper', lightBackgroundForCards);
          
          // Update local state with theme data
          setThemeData({
            primary_color: primary,
            accent_color: accent,
            background_color: background,
            text_color: text,
            logo_url: response.logo_url || '',
            enable_dark_mode: response.enable_dark_mode || false
          });
          
          // Only update parent logo if we got a different one from the backend
          // AND the current logo prop is empty (ensuring we don't override parent state)
          if (response.logo_url && (!logo || response.logo_url !== logo) && onLogoChange) {
            console.log("Syncing logo from backend to parent component:", response.logo_url);
            onLogoChange(response.logo_url);
          } 
          // Use parent's logo if our local state is empty but parent has one
          else if (!response.logo_url && logo) {
            console.log("Using logo from parent component:", logo);
            setThemeData(prev => ({
              ...prev,
              logo_url: logo
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load theme data', err);
        setError('Failed to load theme settings. Please try again.');
        
        // If there's an error but we have a logo from parent, use it
        if (logo) {
          setThemeData(prev => ({
            ...prev,
            logo_url: logo
          }));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTheme();
  }, []); // Remove dependencies to prevent re-fetching on logo change

  // Debounced save function to prevent too many API calls
  const debouncedSaveTheme = useCallback(
    debounce(async (newThemeData) => {
      try {
        // Save theme to backend
        await ThemeService.updateTheme(newThemeData);
        
        // Update theme in local storage
        const frontendTheme = ThemeService.convertBackendThemeToFrontend(newThemeData);
        ThemeService.saveThemeLocally(frontendTheme);
        
        // Show success message briefly
        setSuccessMessage('Theme updated');
        setTimeout(() => setSuccessMessage(''), 2000);
      } catch (err) {
        console.error('Failed to save theme settings', err);
        setError('Failed to update theme. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    }, 1000),
    []
  );    // Process theme options to ensure good contrast and readability
  const processThemeOptions = useCallback((options) => {
    // Create a defensive copy to avoid mutations
    const processedOptions = JSON.parse(JSON.stringify(options));
    
    // Check if primary color is too light (close to white)
    if (processedOptions.palette && processedOptions.palette.primary && 
        processedOptions.palette.primary.main) {
      const primaryColor = processedOptions.palette.primary.main;
      
      // If primary is almost white, use a moderate blue instead for better visibility
      if (primaryColor === '#ffffff' || primaryColor === 'white' || 
          (primaryColor.startsWith('#') && parseInt(primaryColor.substr(1), 16) > 0xefefef)) {
        processedOptions.palette.primary.main = colors.primary; // Use our theme's primary dark color
      }
    }
    
    return processedOptions;
  }, []);

    // Create debounced theme change handler for better performance
  const debouncedThemeChange = useCallback(
    debounce((themeOptions) => {
      if (onThemeChange) {
        // Process theme to ensure good contrast
        const processedOptions = processThemeOptions(themeOptions);
        onThemeChange(processedOptions);
        console.log("[ThemeSettings] Applied debounced theme change");
      }
    }, 250), // 250ms debounce for smoother color picking
    [onThemeChange, processThemeOptions]
  );
  
  // Effect to save theme when it changes
  useEffect(() => {
    if (!loading) {
      debouncedSaveTheme(themeData);
    }
    return () => {
      debouncedSaveTheme.cancel();
    };
  }, [themeData, debouncedSaveTheme, loading]);

  // Handle file selection for logo upload
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      try {
        setLoading(true);
        
        // Upload logo and extract colors
        const result = await ThemeService.uploadLogo(file);
        
        if (result && result.logo_url) {
          // Update parent component with new logo
          if (onLogoChange) {
            onLogoChange(result.logo_url);
          }
          
          // Update local state with logo URL
          setThemeData(prev => ({
            ...prev,
            logo_url: result.logo_url
          }));            // Check if we got extracted colors and need to update the theme
          if (result.colors) {
            // Process extracted colors to ensure good contrast
            const primaryColor = result.colors.primary || themeData.primary_color;
            
            // Check if primary color is too light (close to white)
            let adjustedPrimaryColor = primaryColor;
            if (primaryColor === '#ffffff' || primaryColor === 'white' || 
                (primaryColor.startsWith('#') && parseInt(primaryColor.substr(1), 16) > 0xefefef)) {
              // If primary is almost white, use a moderate blue instead for better visibility
              adjustedPrimaryColor = colors.primary; // Use our theme's primary dark color
              console.log('[ThemeSettings] Primary color from logo was too light, using blue instead');
            }
            
            // Process background color - don't use pure white
            const backgroundColor = result.colors.background || themeData.background_color;
            let adjustedBackgroundColor = backgroundColor;
            if (backgroundColor === '#ffffff' || backgroundColor === 'white' || 
                (backgroundColor.startsWith('#') && parseInt(backgroundColor.substr(1), 16) > 0xfafafa)) {
              // If background is pure white, use very light gray for better UI
              adjustedBackgroundColor = '#f5f7fa';
              console.log('[ThemeSettings] Background color from logo was pure white, using light gray instead');
            }
            
            const extractedColors = {
              primary_color: adjustedPrimaryColor,
              accent_color: result.colors.secondary || themeData.accent_color,
              background_color: adjustedBackgroundColor,
              text_color: result.colors.text || themeData.text_color
            };
            
            console.log('[ThemeSettings] Extracted colors from logo:', extractedColors);
              // Update CSS variables immediately with extracted colors
            const mainContent = document.querySelector('.main-content-area');
            if (mainContent) {
              mainContent.style.setProperty('--theme-background-color', extractedColors.background_color);
              mainContent.style.backgroundColor = extractedColors.background_color;
            }
            
            // Calculate a lighter background for cards (paper elements)
            const lightBackgroundForCards = adjustColorLuminance(extractedColors.background_color, 0.15);
            
            document.documentElement.style.setProperty('--theme-primary-color', extractedColors.primary_color);
            document.documentElement.style.setProperty('--theme-accent-color', extractedColors.accent_color);
            document.documentElement.style.setProperty('--theme-text-color', extractedColors.text_color);
            document.documentElement.style.setProperty('--theme-background-paper', lightBackgroundForCards);
            
            // Apply extracted color palette to themeData state
            setThemeData(prev => ({
              ...prev,
              ...extractedColors
            }));
                // Update the preview box directly with extracted background color
          const previewBox = document.querySelector('.theme-preview-box');
          if (previewBox && extractedColors.background_color) {
            previewBox.style.backgroundColor = extractedColors.background_color;
          }
          
          // Preview the extracted colors in real-time by updating the theme
          if (onThemeChange) {
              // Create a theme options object using extracted colors
              const themeOptions = createThemeOptions('light'); // Always use light mode
              
              // Apply the extracted colors to theme options
              themeOptions.palette.primary.main = extractedColors.primary_color;
              themeOptions.palette.secondary.main = extractedColors.accent_color;
              themeOptions.palette.background.default = extractedColors.background_color;
              themeOptions.palette.text.primary = extractedColors.text_color;
              
              // Force refresh App.js theme state
              ThemeService.clearCachedTheme();
              
              // Apply the theme through parent component
              onThemeChange(themeOptions);
              
              console.log('[ThemeSettings] Updated theme with extracted colors:', extractedColors);
            }
          }
          
          setSuccessMessage('Logo uploaded successfully and colors extracted');
        } else {
          setError('Failed to upload logo');
        }
      } catch (error) {
        console.error('[ThemeSettings] Error uploading logo:', error);
        setError('Failed to upload logo: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
    // We've removed the handleRemoveLogo function as per requirements
  // Logo removal is now handled through the upload process only
    // Handle color change with optimized performance
  const handleColorChange = (e) => {
    const { name, value } = e.target;
    
    // Process color value to prevent UI issues
    let processedValue = value;
      // If primary color is selected and it's white/very light, use theme primary instead
    if (name === 'primary_color' && 
        (value === '#ffffff' || value === 'white' || 
         (value.startsWith('#') && parseInt(value.substr(1), 16) > 0xefefef))) {
      processedValue = colors.primary; // Use theme primary dark color for better visibility
      console.log('[ThemeSettings] Primary color was too light, using theme primary instead');
    }
    
    // If background color is pure white, use very light gray
    if (name === 'background_color' && 
        (value === '#ffffff' || value === 'white' || 
         (value.startsWith('#') && parseInt(value.substr(1), 16) > 0xfafafa))) {
      processedValue = '#f5f7fa'; // Use light gray for better UI
      console.log('[ThemeSettings] Background color was pure white, using light gray instead');
    }
    
    // Update local state with the processed color
    setThemeData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Create theme options with updated color but apply with debounce
    const themeOptions = createThemeOptions('light');
    
    // Get primary color luminance to determine if we need to adjust for contrast
    const primaryColor = name === 'primary_color' ? value : themeData.primary_color;
    const primaryRgb = hexToRgb(primaryColor);
    const primaryLuminance = calculateLuminance(primaryRgb);
    
    // For very light primary colors, darken them to ensure contrast
    const adjustedPrimary = primaryLuminance > 0.9 
      ? adjustColorLuminance(primaryColor, -0.2) // Significantly darken very light colors
      : (primaryLuminance > 0.7 
         ? adjustColorLuminance(primaryColor, -0.1) // Slightly darken light colors
         : primaryColor);
    
    // Get background color
    const backgroundColor = name === 'background_color' ? value : themeData.background_color;
    const bgRgb = hexToRgb(backgroundColor);
    const bgLuminance = calculateLuminance(bgRgb);
    
    // For very light backgrounds, add a very subtle tint of the primary color
    let adjustedBackground = backgroundColor;
    if (bgLuminance > 0.9) {
      adjustedBackground = adjustColorLuminance(
        `#${Math.round(primaryRgb.r*0.05 + 245).toString(16).padStart(2,'0')}${
          Math.round(primaryRgb.g*0.05 + 245).toString(16).padStart(2,'0')}${
          Math.round(primaryRgb.b*0.05 + 245).toString(16).padStart(2,'0')}`,
        0
      );
    }
    
    // Get accent (secondary) color
    const accentColor = name === 'accent_color' ? value : themeData.accent_color;
    
    // Get text color
    let textColor = name === 'text_color' ? value : themeData.text_color;
    if (name === 'background_color') {
      // If background is changing, check if text needs adjustment for contrast
      const textRgb = hexToRgb(textColor);
      const textLuminance = calculateLuminance(textRgb);
      
      // Calculate contrast ratio
      const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                            (Math.min(bgLuminance, textLuminance) + 0.05);
      
      // If contrast is too low, adjust text color
      if (contrastRatio < 4.5) {
        textColor = bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
      }
    }
    
    // Set theme options with adjusted colors for better contrast
    themeOptions.palette.primary = {
      ...themeOptions.palette.primary,
      main: adjustedPrimary,
      light: adjustColorLuminance(primaryColor, 0.1),
      dark: adjustColorLuminance(primaryColor, -0.1)
    };
    
    themeOptions.palette.secondary.main = accentColor;
    themeOptions.palette.background.default = adjustedBackground;
    themeOptions.palette.background.paper = adjustColorLuminance(adjustedBackground, 0.02);
    themeOptions.palette.text.primary = textColor;
    themeOptions.palette.text.secondary = adjustColorLuminance(textColor, 0.2);
    
    // Add selection color for better UI feedback
    const selectionColor = primaryLuminance > 0.6
      ? adjustColorLuminance(primaryColor, -0.3) // Darker selection for light primary
      : adjustColorLuminance(primaryColor, 0.3);  // Lighter selection for dark primary
      
    themeOptions.custom = {
      ...themeOptions.custom,
      selectionColor: selectionColor,
      accentColor: accentColor
    };    // Apply all color changes immediately for responsive feedback
    // This ensures both the preview and the page background update in real-time    // For all color changes, update the relevant CSS variable immediately
    if (name === 'background_color') {
      // Target only the main content area for background color changes
      const mainContent = document.querySelector('.main-content-area');
      if (mainContent) {
        mainContent.style.setProperty('--theme-background-color', adjustedBackground);
        mainContent.style.backgroundColor = adjustedBackground;
      }
      
      // Calculate a lighter version of the background for cards
      const lightBackgroundForCards = adjustColorLuminance(adjustedBackground, 0.15);
      
      // Set card backgrounds to a light version of the background color
      document.documentElement.style.setProperty('--theme-background-paper', lightBackgroundForCards);
      
      // Update all color selectors to white for better visibility
      const colorSelectorsContainers = document.querySelectorAll('.color-selector-container');
      colorSelectorsContainers.forEach(container => {
        container.style.backgroundColor = 'white';
      });
    } else if (name === 'primary_color') {
      document.documentElement.style.setProperty('--theme-primary-color', adjustedPrimary);
    } else if (name === 'accent_color') {
      document.documentElement.style.setProperty('--theme-accent-color', accentColor);
    } else if (name === 'text_color') {
      document.documentElement.style.setProperty('--theme-text-color', textColor);
    }
      // Update the preview box directly for immediate feedback
    const previewBox = document.querySelector('.theme-preview-box');
    if (previewBox) {
      if (name === 'background_color') {
        previewBox.style.backgroundColor = adjustedBackground;
      }
    }
    
    // Apply theme changes immediately regardless of which color is changing
    // This ensures the full page updates without delay when dragging color picker
    if (onThemeChange) {
      onThemeChange(themeOptions);
      console.log(`[ThemeSettings] Applied immediate theme change for ${name}`);
    }  };
  
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };
  
  return (
    <Container maxWidth="lg" sx={{ 
      py: 4,
      position: 'relative',
      // Use fully transparent background to eliminate the box underneath
      backgroundColor: 'transparent'
    }}>
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        // Add padding and border radius for better appearance
        p: 3,
        borderRadius: 2,
        // Use transparent background to avoid creating a box-like element
        backgroundColor: 'transparent',
        // Add a smooth transition
        transition: 'all 0.2s ease-in-out'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PaletteIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h5" component="h1">
            Theme
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Logo and Theme Settings */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Company Logo */}                <Card elevation={0} sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'var(--theme-background-paper, white)', // Use light background for card
                }}>                  <CardHeader 
                    title="Company Logo"
                    sx={{
                      p: 2.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'var(--theme-background-paper, white)', // Use light background for header
                      '& .MuiCardHeader-title': {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: 'text.primary'
                      }
                    }}
                  />                  <CardContent sx={{ p: 2.5, bgcolor: 'var(--theme-background-paper, white)' }}>
                    {/* Logo Upload */}
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <Box sx={{ 
                          width: '100%',
                          height: 140,
                          borderRadius: 2,
                          bgcolor: 'transparent', // Make background transparent
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed',
                          borderColor: 'divider',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {themeData.logo_url ? (
                            <Box sx={{ 
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.02)',
                                zIndex: 1
                              }
                            }}>
                              <img
                                src={themeData.logo_url}
                                alt="Company Logo"
                                style={{
                                  maxWidth: '85%',
                                  maxHeight: '85%',
                                  objectFit: 'contain',
                                  position: 'relative',
                                  zIndex: 2
                                }}
                              />
                            </Box>
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
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                          />                          <Button
                            fullWidth
                            variant={themeData.logo_url ? "outlined" : "contained"}
                            startIcon={<UploadIcon />}
                            onClick={handleUploadClick}
                            sx={{ 
                              height: 48,
                              minWidth: '100%',
                              px: 3,
                              // Improved adaptive color logic for better contrast
                              bgcolor: () => {
                                if (!themeData.logo_url) {
                                  // For contained button: ensure primary color has good contrast
                                  const primaryLum = calculateLuminance(hexToRgb(themeData.primary_color));
                                  return primaryLum > 0.9 ? adjustColorLuminance(themeData.primary_color, -0.2) : themeData.primary_color;
                                }
                                return 'transparent'; // For outlined button
                              },
                              // Ensure border color has enough contrast
                              borderColor: themeData.logo_url 
                                ? calculateLuminance(hexToRgb(themeData.primary_color)) > 0.85
                                  ? '#666666' // Use darker border for very light primary colors
                                  : calculateLuminance(hexToRgb(themeData.primary_color)) > 0.7
                                    ? adjustColorLuminance(themeData.primary_color, -0.2) // Darken light colors
                                    : themeData.primary_color
                                : 'transparent',
                              // Ensure text color has enough contrast
                              color: themeData.logo_url 
                                ? calculateLuminance(hexToRgb(themeData.primary_color)) > 0.85
                                  ? '#333333' // Use dark text for very light primary colors  
                                  : calculateLuminance(hexToRgb(themeData.primary_color)) > 0.7
                                    ? adjustColorLuminance(themeData.primary_color, -0.3) // Darken light colors for text
                                    : themeData.primary_color
                                : getContrastColor(
                                    calculateLuminance(hexToRgb(themeData.primary_color)) > 0.9 
                                    ? adjustColorLuminance(themeData.primary_color, -0.2)
                                    : themeData.primary_color
                                  ),
                              '&:hover': {
                                bgcolor: themeData.logo_url 
                                  ? calculateLuminance(hexToRgb(themeData.primary_color)) > 0.85
                                    ? alpha('#666666', 0.08)
                                    : calculateLuminance(hexToRgb(themeData.primary_color)) > 0.7
                                      ? alpha(adjustColorLuminance(themeData.primary_color, -0.2), 0.08)
                                      : alpha(themeData.primary_color, 0.08)
                                  : alpha(
                                      calculateLuminance(hexToRgb(themeData.primary_color)) > 0.9
                                      ? adjustColorLuminance(themeData.primary_color, -0.2)
                                      : themeData.primary_color, 
                                      0.8
                                    ),
                                borderColor: themeData.logo_url 
                                  ? calculateLuminance(hexToRgb(themeData.primary_color)) > 0.85
                                    ? '#555555'
                                    : calculateLuminance(hexToRgb(themeData.primary_color)) > 0.7
                                      ? adjustColorLuminance(themeData.primary_color, -0.3)
                                      : themeData.primary_color 
                                  : 'transparent',
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
                            {themeData.logo_url ? 'Replace Logo' : 'Upload Logo'}
                          </Button>
                          
                          {/* Remove Delete Logo button - we now use Replace Logo instead */}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Recommended: Square logo, max 2MB, formats: PNG, JPEG, SVG
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                {/* Theme Settings */}                <Card elevation={0} sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'var(--theme-background-paper, white)', // Use light background for card
                }}>                  <CardHeader 
                    title="Theme Colors"
                    sx={{
                      p: 2.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'var(--theme-background-paper, white)', // Use light background for header
                      '& .MuiCardHeader-title': {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em'
                      }
                    }}
                  />                  <CardContent sx={{ p: 2.5, bgcolor: 'var(--theme-background-paper, white)' }}>
                    {/* Dark Mode commented out */}
                    {/* <FormControlLabel
                      control={
                        <Switch
                          checked={themeData.enable_dark_mode}
                          onChange={handleSwitchChange}
                          name="enable_dark_mode"
                          color="primary"
                        />
                      }
                      label="Dark Mode"
                      sx={{ mb: 3, display: 'block' }}
                    /> */}
                    
                    <Grid container spacing={2}>
                      {/* Primary Color */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          className="color-selector-container"
                          sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'transparent', // Make background transparent
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
                            bgcolor: themeData.primary_color
                          }}>
                            <input
                              type="color"
                              value={themeData.primary_color}
                              onChange={handleColorChange}
                              name="primary_color"
                              style={{
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
                            }}
                          >
                            Primary Color
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Accent Color */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          className="color-selector-container"
                          sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'transparent', // Make background transparent
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
                            bgcolor: themeData.accent_color
                          }}>
                            <input
                              type="color"
                              value={themeData.accent_color}
                              onChange={handleColorChange}
                              name="accent_color"
                              style={{
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
                            }}
                          >
                            Accent Color
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Background Color */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          className="color-selector-container"
                          sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'transparent', // Make background transparent
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
                            bgcolor: themeData.background_color
                          }}>
                            <input
                              type="color"
                              value={themeData.background_color}
                              onChange={handleColorChange}
                              name="background_color"
                              style={{
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
                            }}
                          >
                            Background Color
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Text Color */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          className="color-selector-container text-color-selector-container"
                          sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'transparent', // Make background transparent
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
                            bgcolor: themeData.text_color
                          }}>
                            <input
                              type="color"
                              value={themeData.text_color}
                              onChange={handleColorChange}
                              name="text_color"
                              style={{
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
                            }}
                          >
                            Text Color
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Preview Column */}
            <Grid item xs={12} md={4}>              <Card 
                elevation={0} 
                sx={{ 
                  position: { md: 'sticky' },
                  top: { md: 24 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'var(--theme-background-paper, white)' // Use light background for card
                }}
              >                <CardHeader 
                  title="Preview"
                  sx={{
                    p: 2.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'var(--theme-background-paper, white)', // Use light background for header
                    '& .MuiCardHeader-title': {
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em'
                    }
                  }}
                />
                <CardContent sx={{ p: 2.5, bgcolor: 'var(--theme-background-paper, white)' }}>                  <Box 
                    className="theme-preview-box"
                    sx={{ 
                    p: 3,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    // Add specific transition for this element with shorter duration
                    transition: 'all 0.15s ease-in-out',
                    // Ensure proper z-index to prevent layering issues
                    position: 'relative',
                    zIndex: 1,
                    // Use direct background color for instant preview updates
                    backgroundColor: themeData.background_color
                  }}>
                    {themeData.logo_url && (
                      <Box sx={{ 
                        mb: 3, 
                        maxWidth: 120,
                        height: 100,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: 'rgba(255,255,255,0.65)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}>
                        <img
                          src={themeData.logo_url}
                          alt="Preview Logo"
                          style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain'
                          }}
                        />
                      </Box>
                    )}                        <Typography 
                      sx={{ 
                        color: themeData.text_color,
                        mb: 2.5,
                        fontWeight: 500,
                        fontFamily: themeData.font_family
                      }}
                    >
                      Sample Question Text
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexDirection: 'column' }}>
                      <Button 
                        fullWidth
                        sx={{ 
                          bgcolor: theme.buttons?.primary || themeData.accent_color, 
                          color: theme.buttons?.text || '#fff',
                          '&:hover': { 
                            bgcolor: theme.buttons?.primary || themeData.accent_color,
                            opacity: 0.9
                          }
                        }}
                      >
                        Primary Action
                      </Button>
                      <Button 
                        fullWidth
                        variant="outlined"
                        sx={{ 
                          borderColor: theme.buttons?.primary || themeData.accent_color,
                          color: theme.buttons?.primary || themeData.accent_color,
                          '&:hover': { 
                            borderColor: theme.buttons?.primary || themeData.accent_color,
                            bgcolor: 'rgba(0,0,0,0.04)'
                          }
                        }}
                      >
                        Secondary Action
                      </Button>
                    </Box>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block',
                      mt: 2,
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}
                  >
                    Changes are saved automatically
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Container>
  );
};

export default ThemeSettings;

