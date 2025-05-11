/**
 * Enhanced Color Extraction Utility
 * 
 * A robust color extraction system that extracts meaningful colors from logos
 * and generates a harmonious color palette for application theming.
 */

/**
 * Main color extraction function
 * Extract colors from an image URL using k-means clustering
 * @param {string} imageUrl - URL or data URL of the image
 * @param {object} options - Options for color extraction
 * @param {number} options.colorCount - Number of colors to extract (default: 5)
 * @param {number} options.quality - Quality of extraction (1-10, lower is faster) (default: 5)
 * @returns {Promise<object>} - Object containing extracted color palette
 */
const extractColors = async (imageUrl, options = {}) => {
  const { colorCount = 5, quality = 5 } = options;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    // Set a timeout to prevent hanging on image load
    const imageLoadTimeout = setTimeout(() => {
      console.error("Image load timed out");
      resolve(getFallbackColors());
    }, 5000); // 5 seconds timeout
    
    img.onload = () => {
      try {
        // Clear the timeout since image loaded successfully
        clearTimeout(imageLoadTimeout);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // Sample pixels at regular intervals based on quality setting
        const pixels = [];
        const sampleRate = quality * 10; // Higher quality = more samples
        
        for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          pixels.push([r, g, b]);
        }
        
        // Skip color extraction if we don't have enough pixels
        if (pixels.length < 10) {
          console.warn("Not enough non-transparent pixels for color extraction");
          resolve(getFallbackColors());
          return;
        }
        
        // Use k-means clustering to find dominant colors
        const colorPalette = kMeansCluster(pixels, colorCount);
        
        // Sort colors by occurrence (most frequent first)
        const sortedColors = colorPalette.sort((a, b) => b.population - a.population);
        
        // Generate the theme color palette
        const themeColors = generateThemeColors(sortedColors);
        
        // Log the extracted colors
        console.log('Extracted colors from logo:', themeColors);
        
        resolve(themeColors);
      } catch (error) {
        console.error("Error processing image colors:", error);
        resolve(getFallbackColors());
      }
    };

    img.onerror = (error) => {
      clearTimeout(imageLoadTimeout);
      console.error("Error loading image:", error);
      resolve(getFallbackColors());
    };

    img.src = imageUrl;
  });
};

/**
 * Generate a theme color palette from extracted dominant colors
 * @param {Array} dominantColors - Array of dominant colors from k-means
 * @returns {object} Theme color palette
 */
function generateThemeColors(dominantColors) {
  // Ensure we have at least one color
  if (!dominantColors || dominantColors.length === 0) {
    return getFallbackColors();
  }
  
  // Primary color is the most dominant color
  const primary = dominantColors[0];
  
  // Secondary color - choose a complementary or contrasting color
  let secondary;
  
  // If we have at least 2 colors and the second is significantly different, use it
  if (dominantColors.length > 1 && isColorDistinctEnough(dominantColors[0], dominantColors[1])) {
    secondary = dominantColors[1];
  } else {
    // Generate a complementary color
    secondary = {
      r: 255 - primary.r,
      g: 255 - primary.g,
      b: 255 - primary.b,
    };
  }
  
  // Find or generate accent color (tertiary color)
  let accent;
  if (dominantColors.length > 2) {
    accent = dominantColors[2];
  } else {
    // Generate an accent color by shifting hue
    const hslAccent = rgbToHsl(primary.r, primary.g, primary.b);
    hslAccent.h = (hslAccent.h + 0.33) % 1; // Shift hue by 120 degrees
    const rgbAccent = hslToRgb(hslAccent.h, hslAccent.s, hslAccent.l);
    accent = { r: rgbAccent[0], g: rgbAccent[1], b: rgbAccent[2] };
  }
  
  // Generate background color (lighter version with appropriate contrast)
  const primaryLuminance = calculateLuminance(primary.r, primary.g, primary.b);
  
  let background;
  if (primaryLuminance < 0.5) {
    // Dark primary - light background
    background = { r: 249, g: 249, b: 252 }; // Light off-white
  } else {
    // Light primary - slightly darker background with tint from primary
    background = {
      r: Math.min(245, primary.r * 0.15 + 230),
      g: Math.min(245, primary.g * 0.15 + 230),
      b: Math.min(245, primary.b * 0.15 + 230)
    };
  }
  
  // Generate text color based on background luminance
  const backgroundLuminance = calculateLuminance(background.r, background.g, background.b);
  const text = backgroundLuminance > 0.5 ? { r: 33, g: 33, b: 33 } : { r: 248, g: 248, b: 248 };
  
  // Generate neutral color for borders, etc.
  const neutral = {
    r: Math.min(200, (primary.r + secondary.r) / 2),
    g: Math.min(200, (primary.g + secondary.g) / 2),
    b: Math.min(200, (primary.b + secondary.b) / 2),
  };
  
  // Ensure text has enough contrast with background
  const textContrastRatio = calculateContrastRatio(
    calculateLuminance(text.r, text.g, text.b),
    backgroundLuminance
  );
  
  // If contrast is too low, adjust the text color
  if (textContrastRatio < 4.5) {
    // Set text to either pure black or pure white for maximum contrast
    if (backgroundLuminance > 0.5) {
      text.r = text.g = text.b = 0; // Black text
    } else {
      text.r = text.g = text.b = 255; // White text
    }
  }
  
  return {
    primary: rgbToHex(primary),
    secondary: rgbToHex(secondary),
    accent: rgbToHex(accent),
    background: rgbToHex(background),
    text: rgbToHex(text),
    neutral: rgbToHex(neutral)
  };
}

/**
 * Calculate contrast ratio between two luminance values
 * @param {number} lum1 - First luminance value (0-1)
 * @param {number} lum2 - Second luminance value (0-1)
 * @returns {number} Contrast ratio (1-21)
 */
function calculateContrastRatio(lum1, lum2) {
  const lighterLum = Math.max(lum1, lum2);
  const darkerLum = Math.min(lum1, lum2);
  return (lighterLum + 0.05) / (darkerLum + 0.05);
}

/**
 * Calculate relative luminance of an RGB color
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number} Luminance value (0-1)
 */
function calculateLuminance(r, g, b) {
  // Convert RGB to relative luminance using the formula from WCAG 2.0
  const [rSRGB, gSRGB, bSRGB] = [r, g, b].map(c => {
    const srgb = c / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rSRGB + 0.7152 * gSRGB + 0.0722 * bSRGB;
}

/**
 * Check if two colors are visually distinct enough
 * @param {object} color1 - First RGB color
 * @param {object} color2 - Second RGB color
 * @returns {boolean} True if colors are visually distinct
 */
function isColorDistinctEnough(color1, color2) {
  // Calculate color difference using a simple distance formula
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  
  const colorDistance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  
  return colorDistance > 75; // Threshold for visual distinction
}

/**
 * K-means clustering algorithm to find dominant colors
 * @param {Array} pixels - Array of [r,g,b] pixel values
 * @param {number} k - Number of clusters (colors) to find
 * @returns {Array} Array of dominant colors with RGB values and population
 */
function kMeansCluster(pixels, k) {
  if (pixels.length === 0 || k === 0) return [];
  
  // Initialize centroids with random pixels
  let centroids = [];
  const centroidIndices = new Set();
  
  // Try to select different pixels for centroids
  while (centroids.length < k && centroids.length < pixels.length) {
    const randomIndex = Math.floor(Math.random() * pixels.length);
    if (!centroidIndices.has(randomIndex)) {
      centroidIndices.add(randomIndex);
      centroids.push({
        r: pixels[randomIndex][0],
        g: pixels[randomIndex][1],
        b: pixels[randomIndex][2]
      });
    }
  }
  
  // If we couldn't get enough different centroids, just use what we have
  if (centroids.length < k) {
    k = centroids.length;
  }
  
  // Run k-means algorithm (simplified version with limited iterations)
  let assignments = [];
  let iterations = 0;
  const maxIterations = 10;
  let assignmentsChanged = true;
  
  while (assignmentsChanged && iterations < maxIterations) {
    // Assign each pixel to nearest centroid
    assignmentsChanged = false;
    assignments = pixels.map((pixel, i) => {
      let minDist = Number.MAX_VALUE;
      let minIndex = 0;
      
      for (let j = 0; j < centroids.length; j++) {
        const dist = distance(pixel, [centroids[j].r, centroids[j].g, centroids[j].b]);
        if (dist < minDist) {
          minDist = dist;
          minIndex = j;
        }
      }
      
      // Check if assignment changed
      if (assignments[i] !== minIndex) {
        assignmentsChanged = true;
      }
      
      return minIndex;
    });
    
    // Recalculate centroids based on assignments
    const counts = Array(k).fill(0);
    const sums = Array(k).fill(0).map(() => [0, 0, 0]);
    
    for (let i = 0; i < pixels.length; i++) {
      const centroidIndex = assignments[i];
      counts[centroidIndex]++;
      
      sums[centroidIndex][0] += pixels[i][0]; // R
      sums[centroidIndex][1] += pixels[i][1]; // G
      sums[centroidIndex][2] += pixels[i][2]; // B
    }
    
    // Update centroids
    for (let i = 0; i < k; i++) {
      if (counts[i] > 0) {
        centroids[i] = {
          r: Math.round(sums[i][0] / counts[i]),
          g: Math.round(sums[i][1] / counts[i]),
          b: Math.round(sums[i][2] / counts[i])
        };
      }
    }
    
    iterations++;
  }
  
  // Calculate populations of each cluster
  const populations = Array(k).fill(0);
  for (let i = 0; i < assignments.length; i++) {
    populations[assignments[i]]++;
  }
  
  // Return clusters with their populations
  return centroids.map((centroid, i) => ({
    ...centroid,
    population: populations[i] / pixels.length
  }));
}

/**
 * Calculate Euclidean distance between two RGB points
 */
function distance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) + 
    Math.pow(a[1] - b[1], 2) + 
    Math.pow(a[2] - b[2], 2)
  );
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {object} HSL color object {h, s, l}
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h, s, l };
}

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-1)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {Array} RGB components [r, g, b]
 */
function hslToRgb(h, s, l) {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Provides fallback colors when extraction fails
 * @returns {object} - Object with fallback theme colors
 */
const getFallbackColors = () => {
  console.log("Using fallback colors due to extraction failure");
  return {
    primary: '#3f51b5',    // Material UI primary blue
    secondary: '#f50057',  // Material UI pink
    accent: '#4caf50',     // Material UI green
    background: '#ffffff', // White background
    text: '#212121',       // Dark gray text
    neutral: '#9e9e9e'     // Medium gray
  };
};

/**
 * Convert RGB to hexadecimal string
 * @param {object} rgb - RGB color object {r: 0-255, g: 0-255, b: 0-255}
 * @returns {string} Hexadecimal color string (#RRGGBB)
 */
const rgbToHex = ({ r, g, b }) => {
  return '#' + [r, g, b]
    .map(x => Math.round(x).toString(16).padStart(2, '0'))
    .join('');
};

export { extractColors };
