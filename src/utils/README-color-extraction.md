# Enhanced Color Extraction Algorithm

This module provides sophisticated color extraction from uploaded logos, with specific optimizations for company branding applications.

## Key Features

1. **K-means Color Clustering**
   - Extracts dominant colors from images using k-means clustering
   - Sorts colors by frequency/dominance in the image

2. **Corner Detection**
   - Samples the four corners of an image to detect potential background colors
   - Determines if the image has a consistent background

3. **Single Color Handling**
   - Detects logos with only one dominant color
   - Falls back to generated color palettes for minimal logos

4. **Intelligent Color Assignment**
   - Assigns appropriate roles to colors based on their characteristics:
     - Background color from consistent corners
     - Primary/accent colors from dominant non-background colors
     - Text colors with guaranteed contrast

5. **Accessibility**
   - Ensures all color combinations meet WCAG AA contrast requirements
   - Adjusts text colors automatically to maintain readability

## Usage

The enhanced algorithm is integrated into the existing color extraction workflow:

```javascript
// Extract colors from a logo
const extractedColors = await extractColors(logoDataUrl, {
  colorCount: 5, // Number of colors to extract
  quality: 8     // Quality level (1-10)
});

// The result contains:
// - primary: Main brand color (hex)
// - secondary: Secondary/accent color (hex)
// - background: Suggested background color (hex)
// - text: Text color with good contrast (hex)
// - accent: Alternative accent color (hex)
// - neutral: Neutral color for borders, etc. (hex)
```

## Algorithm Flow

1. Sample pixels from the image
2. Apply k-means clustering to find dominant color clusters
3. Extract colors from the four corners of the image
4. Determine if corners have consistent color (potential background)
5. Apply decision logic:
   - If image has only one dominant color, use fallback colors
   - If corners are consistent, use as background and extract other colors from k-means
   - If corners aren't consistent, use standard k-means extraction
6. Ensure all color combinations have appropriate contrast

## Debugging

For debugging or testing the extraction algorithm on specific images:

```javascript
import { testColorExtraction } from '../utils/advancedColorExtraction';

// Test extraction on a specific image
const analysis = await testColorExtraction(imageUrl);
console.log(analysis);
```

This returns detailed information about the extraction process including:
- Corner colors and consistency
- K-means results
- Recommendations for color assignments
