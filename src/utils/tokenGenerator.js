/**
 * Token Generation Utilities
 * Provides functionality for:
 * - Generating unique interview access tokens
 * - Validating token authenticity and expiration
 * - Managing token lifecycle and cleanup
 * - Handling token usage status
 */

const generateToken = (length = 6, expiresInHours = 24) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return {
        token,
        expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
        used: false
    };
};

const validateToken = (tokenToCheck, validTokens) => {
    if (!tokenToCheck || typeof tokenToCheck !== 'string') {
        return { isValid: false, message: 'Invalid token format' };
    }

    const tokenData = validTokens.find(t => t.token === tokenToCheck.toUpperCase());
    if (!tokenData) return { isValid: false, message: 'Invalid token' };
    
    if (tokenData.used) {
        return { isValid: false, message: 'Token has already been used' };
    }

    const now = new Date();
    const expiryDate = new Date(tokenData.expiresAt);
    
    if (now > expiryDate) {
        return { isValid: false, message: 'Token has expired' };
    }

    return { isValid: true, tokenData };
};

// Add new utility function
const cleanExpiredTokens = (tokens) => {
    const now = new Date();
    return tokens.filter(token => new Date(token.expiresAt) > now);
};

// Additional utility functions for token management
export const getTokenStatus = (token, validTokens) => {
  const tokenData = validTokens.find(t => t.token === token);
  if (!tokenData) return 'invalid';
  if (tokenData.used) return 'used';
  if (new Date() > new Date(tokenData.expiresAt)) return 'expired';
  return 'valid';
};

export { generateToken, validateToken, cleanExpiredTokens };