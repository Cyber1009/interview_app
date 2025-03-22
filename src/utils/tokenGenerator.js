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

export { generateToken, validateToken, cleanExpiredTokens };