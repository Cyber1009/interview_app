/**
 * Theme Service
 * Handles:
 * - Theme customization
 * - Logo management
 * - Color scheme settings
 * - Theme persistence
 */

import api from './api';
import { ErrorService } from './index';

class ThemeService {
  /**
   * Get user theme
   * @returns {Promise} - Promise with theme data
   */
  async getUserTheme() {
    try {
      const response = await api.get('/themes/current');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch theme', error);
      throw error;
    }
  }

  /**
   * Update user theme
   * @param {Object} themeData - Theme customization data
   * @returns {Promise} - Promise with updated theme
   */
  async updateTheme(themeData) {
    try {
      const response = await api.put('/themes/current', themeData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to update theme', error);
      throw error;
    }
  }

  /**
   * Upload company logo
   * @param {File} logoFile - The logo file to upload
   * @returns {Promise} - Promise with logo URL
   */
  async uploadLogo(logoFile) {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      const response = await api.post('/themes/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to upload logo', error);
      throw error;
    }
  }

  /**
   * Delete company logo
   * @returns {Promise} - Promise with deletion result
   */
  async deleteLogo() {
    try {
      const response = await api.delete('/themes/logo');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to delete logo', error);
      throw error;
    }
  }
  
  /**
   * Save theme to local storage
   * @param {Object} theme - Theme data to save locally
   */
  saveThemeLocally(theme) {
    try {
      localStorage.setItem('interviewTheme', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to save theme locally', error);
    }
  }
  
  /**
   * Get theme from local storage
   * @returns {Object|null} - Theme data or null if not found
   */
  getLocalTheme() {
    try {
      const theme = localStorage.getItem('interviewTheme');
      return theme ? JSON.parse(theme) : null;
    } catch (error) {
      console.error('Failed to get local theme', error);
      return null;
    }
  }
}

export default new ThemeService();