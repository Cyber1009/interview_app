# Theme System Simplification Plan

## Goals
- Single source of truth for theme/colors
- Simplified structure without light/dark mode
- Minimal color palette with clear naming
- Remove redundancy in theme-related code

## Current Issues
1. Multiple theme-related files scattered across:
   - `src/styles/theme/`
   - `src/context/`
   - `src/components/core/theme/`
   - `src/utils/`
2. Redundant color definitions and utilities
3. Complex theming with light/dark modes
4. Inconsistent naming (gray vs accent_color)

## New Structure
```
src/styles/
  theme/
    colors.ts       # Single source of truth for colors
    variables.css   # CSS variables
    index.ts       # Main theme export
    utils.ts       # Essential theme utilities
```

## Color Palette Simplification
```typescript
// Base colors
primary: '#091326'     // Main brand color
accent: '#52606d'      // Previously gray, for secondary elements
background: '#b6c2c9'  // Main background
surface: '#ffffff'     // Card/component background
text: '#52606d'       // Text color

// Status colors (unchanged)
success: '#7bae7e'
warning: '#ff9800'
error: '#e75552'
info: '#a4cae5'
```

## Implementation Steps

### Step 1: Consolidate Color Definitions
1. Update `colors.js` with simplified palette
2. Remove redundant color mappings
3. Update component color references

### Step 2: Establish CSS Variables
1. Create `variables.css` for global CSS variables
2. Import in main index.css
3. Update components to use CSS variables

### Step 3: Clean Up Files
Files to remove:
- `src/context/ThemeContext.js`
- `src/context/UnifiedThemeProvider.js`
- `src/components/core/theme/ThemePreview.js`
- `src/utils/colorUtils.js` (merge essential functions into theme/utils.ts)
- All theme manager UI components (since we're removing theme customization)

### Step 4: Update Imports
1. Update all theme-related imports to point to new structure
2. Remove unused theme references
3. Update component styles to use new color names

### Step 5: Documentation
1. Document new color system
2. Add usage examples
3. Remove old theme documentation

## Migration Notes
- All colors will be accessed from `styles/theme`
- Components should use CSS variables for styling
- MUI theme will use our CSS variables
- Remove all theme customization UI
- Simplified theme provider with basic MUI integration
