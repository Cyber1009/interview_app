/**
 * Theme Service
 * 
 * Handles:
 * - Theme customization and switching
 * - Logo management
 * - Color scheme settings
 * - Theme persistence
 */

// Import from consolidated API
import { interviewerAPI } from '../api';
import { createThemeOptions, makeTheme, colors, componentColors } from '../styles';

// Define a simple error handler since ErrorService was removed
const handleError = (message, error) => {
  console.error(message, error);
};

class ThemeService {  /**
   * Get user theme
   * @returns {Promise} - Promise with theme data
   */
  async getUserTheme() {
    try {
      // Use the direct getUserTheme API for global theme settings
      console.log('Getting user theme using global endpoint');
      try {
        // Try using the direct global theme endpoint first
        const response = await interviewerAPI.getUserTheme();
        
        // Convert the backend response to our expected format
        const themeData = {
          primary_color: response.primary_color || '#3f51b5',
          accent_color: response.accent_color || '#f50057',
          background_color: response.background_color || '#f5f5f5',
          text_color: response.text_color || '#333333',
          logo_url: response.company_logo || '',
          enable_custom_branding: true,
          enable_dark_mode: false
        };
        
        return themeData;
      } catch (globalThemeError) {
        console.warn('Global theme API failed, falling back to interview-specific theme:', globalThemeError);
        
        // Fallback to interview-specific theme if available
        const currentInterviewId = localStorage.getItem('currentInterviewId');
        
        if (currentInterviewId) {
          // If we have a current interview ID, get its theme
          console.log(`Falling back to theme for interview: ${currentInterviewId}`);
          const response = await interviewerAPI.getInterviewTheme(currentInterviewId);
          
          // Convert the backend response to our expected format
          const themeData = {
            primary_color: response.data.primary_color || '#3f51b5',
            accent_color: response.data.accent_color || '#f50057',
            background_color: response.data.background_color || '#f5f5f5',
            text_color: response.data.text_color || '#333333',
            logo_url: response.data.company_logo || '',
            enable_custom_branding: true,
            enable_dark_mode: false
          };
          
          return themeData;
        } else {
          // If no current interview, use the user's default theme from profile
          console.log('No current interview ID, getting user default theme from profile');
          const response = await interviewerAPI.getProfile();
          
          // Extract theme from profile if available, or use defaults
          const themeData = {
            primary_color: response.theme?.primary_color || '#3f51b5',
            accent_color: response.theme?.accent_color || '#f50057',
            background_color: response.theme?.background_color || '#f5f5f5',
            text_color: response.theme?.text_color || '#333333',
            logo_url: response.theme?.company_logo || '',
            enable_custom_branding: true,
            enable_dark_mode: false
          };
          
          return themeData;
        }
      }
    } catch (error) {
      console.error('Failed to fetch theme', error);
      // Return a default theme object instead of throwing an error
      // This prevents continuous API calls when the theme endpoint fails
      return {
        primary_color: '#3f51b5',
        accent_color: '#f50057',
        background_color: '#f5f5f5',
        text_color: '#333333',
        logo_url: '',
        enable_custom_branding: true,
        enable_dark_mode: false,
        font_family: 'Roboto, sans-serif'
      };
    }
  }
  /**
   * Update user theme
   * @param {Object} themeData - Theme customization data
   * @returns {Promise} - Promise with updated theme
   */
  async updateTheme(themeData) {
    try {
      // Convert to expected backend format
      const backendThemeData = {
        company_logo: themeData.logo_url || null,
        primary_color: themeData.primary_color || '#3f51b5',
        accent_color: themeData.accent_color || '#f50057',
        background_color: themeData.background_color || '#ffffff',
        text_color: themeData.text_color || '#212121',
        neutral_color: themeData.neutral_color || null,
        accent_secondary_color: themeData.accent_secondary_color || null
      };
      
      console.log('[ThemeService] Updating theme with colors:', {
        primary: backendThemeData.primary_color,
        secondary: backendThemeData.accent_color,
        background: backendThemeData.background_color,
        text: backendThemeData.text_color
      });
      
      console.log('[ThemeService] Using global theme endpoint to update theme');
      
      // Use the global theme API method without requiring an interview ID
      const response = await interviewerAPI.updateUserTheme(backendThemeData);
      
      // Force refresh the theme cache to ensure changes are applied immediately
      this.clearCachedTheme();
      
      // Convert and save to local storage with proper colors mapping
      const frontendThemeData = {
        primaryColor: backendThemeData.primary_color,
        secondaryColor: backendThemeData.accent_color, 
        backgroundColor: backendThemeData.background_color,
        textColor: backendThemeData.text_color,
        logoUrl: backendThemeData.company_logo
      };
      this._updateThemeCache(frontendThemeData);
      
      return response;
    } catch (error) {
      handleError('Failed to update theme', error);
      throw error;
    }
  }

  /**
   * Get theme for a specific interview by token/ID
   * @param {string} interviewId - Interview ID or token
   * @returns {Promise} - Promise with interview theme data
   */
  async getInterviewTheme(interviewId) {
    try {
      // First check if we already have a theme in sessionStorage from token verification
      const tokenTheme = sessionStorage.getItem('interviewTokenTheme');
      if (tokenTheme) {
        console.log('Using theme data from token validation - no API call needed');
        return JSON.parse(tokenTheme);
      }
      
      // If we don't have an interview ID or token, don't make the API call
      // Just return a default theme instead
      if (!interviewId) {
        console.log('No interview ID provided, using default theme');
        const defaultTheme = {
          primaryColor: '#424242',
          secondaryColor: '#bdbdbd', // Changed from accentColor to secondaryColor for consistency
          backgroundColor: '#ffffff',
          textColor: '#333333',
          logoUrl: null
        };
        
        // Store this default theme in sessionStorage to prevent future API calls
        sessionStorage.setItem('interviewTokenTheme', JSON.stringify(defaultTheme));
        return defaultTheme;
      }
      
      // If not found in sessionStorage and we have an interview ID, try fetching from API
      console.log('Fetching theme for interview:', interviewId);
      try {
        // Use the correct API method that's defined in interviewer.js
        const response = await interviewerAPI.getInterviewTheme(interviewId);
        
        // Normalize the response to use secondaryColor consistently
        const normalizedTheme = {
          ...response.data,
          secondaryColor: response.data.accentColor || response.data.secondaryColor || '#bdbdbd'
        };
        
        // Remove the accentColor property if it exists to avoid confusion
        if (normalizedTheme.accentColor) {
          delete normalizedTheme.accentColor;
        }
        
        sessionStorage.setItem('interviewTokenTheme', JSON.stringify(normalizedTheme));
        return normalizedTheme;
      } catch (apiError) {
        // If 404 or other error, use a default theme
        console.log('Interview-specific theme endpoint not available, using default theme:', apiError.message);
        
        // Just use a default theme object
        const defaultTheme = {
          primaryColor: '#424242',
          secondaryColor: '#bdbdbd', // Changed from accentColor to secondaryColor for consistency
          backgroundColor: '#ffffff',
          textColor: '#333333',
          logoUrl: null
        };
        
        // Store this default theme in sessionStorage to prevent future API calls
        sessionStorage.setItem('interviewTokenTheme', JSON.stringify(defaultTheme));
        return defaultTheme;
      }
    } catch (error) {
      console.error('Failed to get interview theme:', error);
      // Return a default theme instead of throwing to prevent errors from propagating
      const defaultTheme = {
        primaryColor: '#424242',
        secondaryColor: '#bdbdbd', // Changed from accentColor to secondaryColor for consistency
        backgroundColor: '#ffffff',
        textColor: '#333333',
        logoUrl: null
      };
      
      // Store this default theme in sessionStorage to prevent future API calls
      sessionStorage.setItem('interviewTokenTheme', JSON.stringify(defaultTheme));
      return defaultTheme;
    }
  }

  /**
   * Check if we have an active interview theme in session storage
   * @returns {boolean} - True if an interview theme is active
   */
  hasActiveInterviewTheme() {
    return !!sessionStorage.getItem('interviewTokenTheme');
  }

  /**
   * Get the active interview theme from session storage
   * @returns {Object|null} - Theme data or null if not found
   */
  getActiveInterviewTheme() {
    try {
      const theme = sessionStorage.getItem('interviewTokenTheme');
      return theme ? JSON.parse(theme) : null;
    } catch (error) {
      console.error('Failed to get active interview theme', error);
      return null;
    }
  }

  /**
   * Clear the active interview theme
   */
  clearActiveInterviewTheme() {
    sessionStorage.removeItem('interviewTokenTheme');
  }
  /**
   * Upload company logo and extract colors
   * @param {File} logoFile - The logo file to upload
   * @returns {Promise} - Promise with logo URL and extracted colors
   */
  async uploadLogo(logoFile) {
    try {
      // Get the current theme first
      const currentTheme = await this.getUserTheme();
      
      // Convert the file to a base64 data URL
      const fileReader = new FileReader();
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async (e) => {
          try {
            const logoDataUrl = e.target.result;
            
            try {
              // Import the enhanced extractColors function from the colorExtractor utility
              const { extractColors } = await import('../utils/colorExtractor');
              
              // Extract colors from the logo with higher quality color extraction
              const extractedColors = await extractColors(logoDataUrl, {
                colorCount: 5, // Extract 5 dominant colors
                quality: 7     // Higher quality (1-10 scale)
              });
              
              console.log('[ThemeService] Extracted colors from logo:', extractedColors);
              
              // Format data for backend according to expected structure
              const backendThemeData = {
                company_logo: logoDataUrl,
                primary_color: extractedColors.primary || currentTheme.primary_color,
                accent_color: extractedColors.secondary || currentTheme.accent_color,
                background_color: extractedColors.background || currentTheme.background_color,
                text_color: extractedColors.text || currentTheme.text_color,
                neutral_color: extractedColors.neutral || null,
                accent_secondary_color: extractedColors.accent || null
              };
              
              console.log('[ThemeService] Saving theme with extracted colors to global theme endpoint');
              
              // Save the updated theme to the backend using the global theme endpoint
              const response = await interviewerAPI.updateUserTheme(backendThemeData);
              
              // Clear theme cache to ensure new colors are applied immediately
              this.clearCachedTheme();
              
              // Return both the logo URL and the extracted colors
              resolve({
                logo_url: logoDataUrl,
                colors: extractedColors,
                success: true
              });
            } catch (extractionError) {
              console.error('[ThemeService] Error extracting colors from logo:', extractionError);
              
              // Even if color extraction fails, still save the logo
              const backendThemeData = {
                company_logo: logoDataUrl,
                primary_color: currentTheme.primary_color,
                accent_color: currentTheme.accent_color,
                background_color: currentTheme.background_color,
                text_color: currentTheme.text_color
              };
              
              const response = await interviewerAPI.updateUserTheme(backendThemeData);
              
              resolve({
                logo_url: logoDataUrl,
                success: true
              });
            }
          } catch (error) {
            console.error('[ThemeService] Error converting or saving logo:', error);
            reject(error);
          }
        };
        
        fileReader.onerror = (error) => {
          console.error('[ThemeService] Error reading file:', error);
          reject(error);
        };
        
        fileReader.readAsDataURL(logoFile);
      });
    } catch (error) {
      handleError('Failed to upload logo', error);
      throw error;
    }
  }
  /**
   * Delete company logo
   * @returns {Promise} - Promise with deletion result
   */  // The deleteLogo function has been removed as per requirements
  // Logo removal is now handled through the upload process by replacing the logo instead
  
  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Use uploadLogo with a new logo to replace the existing one instead.
   */
  async deleteLogo() {
    console.warn('ThemeService.deleteLogo() is deprecated. Use uploadLogo() to replace logos instead.');
    throw new Error('Method removed. Use uploadLogo to replace logos instead.');
  }
  
  /**
   * Save theme locally for persistence across sessions
   * @param {Object} themeData - Theme data to save
   */
  saveThemeLocally(themeData) {
    try {
      if (!themeData) return;
      
      // Convert from theme object if needed
      let normalizedTheme = themeData;
      
      // If it's a theme options object with palette structure, extract the colors
      if (themeData.palette) {
        normalizedTheme = {
          primaryColor: themeData.palette.primary?.main,
          secondaryColor: themeData.palette.secondary?.main,
          backgroundColor: themeData.palette.background?.default, 
          textColor: themeData.palette.text?.primary,
          // Keep existing logo if present in localStorage
          logoUrl: this._getStoredTheme()?.logoUrl || null
        };
      }
      
      // Prevent background color from being unintentionally cleared
      // If new theme doesn't specify background but we had one before, keep it
      const existingTheme = this._getStoredTheme();
      if (existingTheme && !normalizedTheme.backgroundColor && existingTheme.backgroundColor) {
        normalizedTheme.backgroundColor = existingTheme.backgroundColor;
      }
      
      // Apply the CSS variable for immediate updates
      if (normalizedTheme.backgroundColor) {
        document.documentElement.style.setProperty('--theme-temp-background', normalizedTheme.backgroundColor);
      }
      
      localStorage.setItem(this.THEME_KEY, JSON.stringify(normalizedTheme));
    } catch (error) {
      console.error('Failed to save theme locally:', error);
    }
  }
  
  /**
   * Get theme from local storage
   * @returns {Object|null} - Theme data or null if not found
   * 
   * This respects the theme priority:
   * 1. Interview token theme (for candidates)
   * 2. User's saved theme (for logged-in interviewers)
   * 3. Default theme from the theme configuration
   */
  getLocalTheme() {
    try {
      // Check if we have an interview-specific theme first (for candidates)
      const interviewTheme = this.getActiveInterviewTheme();
      if (interviewTheme) {
        return interviewTheme;
      }
      
      // Otherwise, get the user's theme or default to the theme configuration
      const theme = localStorage.getItem('interviewTheme');
      if (theme) {
        return JSON.parse(theme);
      }
      
      // If no saved theme, return the default theme options
      return createThemeOptions('light');
    } catch (error) {
      console.error('Failed to get local theme', error);
      // Return default theme on error
      return createThemeOptions('light');
    }
  }

  /**
   * Convert backend theme format to frontend theme format
   * @param {Object} backendTheme - Theme data from the backend
   * @returns {Object} - Frontend theme configuration
   */
  convertBackendThemeToFrontend(backendTheme) {
    if (!backendTheme) {
      return createThemeOptions('light');
    }
    
    try {
      // Always use light mode regardless of backend settings
      const mode = 'light';
      console.log(`[ThemeService] Creating theme with mode: ${mode}`);
      
      // Create base theme options using light mode only
      const themeOptions = createThemeOptions(mode);
      
      // Apply colors from backend theme
      if (backendTheme.primary_color) {
        themeOptions.palette.primary.main = backendTheme.primary_color;
      }
      
      if (backendTheme.accent_color) {
        themeOptions.palette.secondary.main = backendTheme.accent_color;
      }
      
      if (backendTheme.background_color) {
        // Apply background color
        themeOptions.palette.background.default = backendTheme.background_color;
      }
      
      if (backendTheme.text_color) {
        themeOptions.palette.text.primary = backendTheme.text_color;
      }
      
      // Keep the mode explicitly set to light
      themeOptions.palette.mode = mode;
      
      return themeOptions;
    } catch (error) {
      console.error('Error converting theme format:', error);
      return createThemeOptions('light');
    }
  }

  /**
   * Initialize user theme from backend or local storage
   * This should be called when the app loads and when the user logs in
   * @returns {Promise} - Promise with theme data in frontend format
   */
  async initializeUserTheme() {
    try {
      // Check if the user is authenticated
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('User not authenticated, using default theme');
        return createThemeOptions('light');
      }

      // For data URL testing, only use backend theme and ignore localStorage
      const themeData = await this.getUserTheme();
      
      // Comment out local storage for data URL testing
      // this.saveThemeLocally(themeData);
      
      // Convert to frontend format and return
      return this.convertBackendThemeToFrontend(themeData);
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      return createThemeOptions('light');
    }
  }
  
  /**
   * Get the logo URL from theme data
   * @returns {Promise<string|null>} - Promise with logo URL or null if not found
   */
  async getLogoUrl() {
    try {
      // For data URL testing, only get logo from the backend
      const themeData = await this.getUserTheme();
      console.log('Retrieved logo URL from backend data URL:', themeData?.logo_url);
      return themeData?.logo_url || null;
    } catch (error) {
      console.error('Failed to get logo from backend:', error);
      return null;
    }
  }

  /**
   * Get the active theme with all sources considered
   * @param {boolean} forceRefresh - Whether to force a refresh from the backend
   * @returns {Promise<Object>} - The active theme data
   */
  async getActiveTheme(forceRefresh = false) {
    // Check for active interview theme first (highest priority)
    if (this.hasActiveInterviewTheme()) {
      return this.getActiveInterviewTheme();
    }
    
    try {
      // Get cached theme first to avoid theme switching on refresh
      const cachedTheme = this._getThemeCache();
      if (cachedTheme && !forceRefresh) {
        return {
          primaryColor: cachedTheme.primaryColor || colors.primary,
          secondaryColor: cachedTheme.secondaryColor || colors.gray,
          backgroundColor: cachedTheme.backgroundColor || colors.background,
          textColor: cachedTheme.textColor || colors.text,
          logoUrl: cachedTheme.logoUrl || null
        };
      }
      
      // Only if cache doesn't exist or we're forcing a refresh, get from backend
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const themeData = await this.getUserTheme();
        
        // Convert to frontend-compatible format
        const formattedTheme = {
          primaryColor: themeData.primary_color || colors.primary,
          secondaryColor: themeData.accent_color || colors.gray,
          backgroundColor: themeData.background_color || colors.background,
          textColor: themeData.text_color || colors.text,
          logoUrl: themeData.logo_url || null
        };
        
        // Cache the theme
        this._updateThemeCache(formattedTheme);
        
        return formattedTheme;
      }
      
      // Default theme as fallback
      return {
        primaryColor: colors.primary,
        secondaryColor: colors.gray,
        backgroundColor: colors.background,
        textColor: colors.text,
        logoUrl: null
      };
    } catch (error) {
      console.error('Error getting active theme:', error);
      
      // Return default theme on error
      return {
        primaryColor: colors.primary,
        secondaryColor: colors.gray,
        backgroundColor: colors.background,
        textColor: colors.text,
        logoUrl: null
      };
    }
  }
  
  /**
   * Clear cached theme data
   */
  clearCachedTheme() {
    localStorage.removeItem('themeCache');
  }
  
  /**
   * Update the theme cache in localStorage
   * @param {Object} themeData - Theme data to cache
   * @private
   */
  _updateThemeCache(themeData) {
    try {
      // Get existing cache to avoid overwriting other properties
      const existingCache = this._getThemeCache() || {};
      
      // Merge the new data with existing data
      const mergedCache = {
        ...existingCache,
        ...themeData
      };
      
      localStorage.setItem('themeCache', JSON.stringify(mergedCache));
    } catch (error) {
      console.error('Failed to update theme cache:', error);
    }
  }
  
  /**
   * Get the theme cache from localStorage
   * @returns {Object|null} - Cached theme data or null if not found
   * @private
   */
  _getThemeCache() {
    try {
      const cache = localStorage.getItem('themeCache');
      return cache ? JSON.parse(cache) : null;
    } catch (error) {
      console.error('Failed to read theme cache:', error);
      return null;
    }
  }
  
  // Note: Dark mode functionality has been removed to prevent theme mode switching issues
}

export default new ThemeService();