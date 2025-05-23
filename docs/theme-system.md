# Theme System Documentation

The theme system has been simplified to provide a single source of truth for colors and styles across the application.

## Core Components

### 1. Color Definitions (`src/styles/theme/colors.js`)
```javascript
export const colors = {
  primary: '#091326',    // Main brand color
  accent: '#52606d',     // Secondary actions
  background: '#b6c2c9', // Main app background
  surface: '#ffffff',    // Card/component background
  text: '#52606d',       // Main text color
}
```

### 2. CSS Variables (`src/styles/theme/variables.css`)
Global CSS variables that make the theme colors available throughout the application:
```css
:root {
  --color-primary: #091326;
  --color-accent: #52606d;
  --color-background: #b6c2c9;
  --color-surface: #ffffff;
  --color-text: #52606d;
}
```

### 3. Theme Service (`src/services/themeService.js`)
Handles theme management and persistence:
- `getUserTheme()`: Retrieves user theme preferences
- `updateTheme()`: Updates theme colors

## Usage

1. Import colors from the central colors file:
```javascript
import { colors } from '../styles/theme/colors';
```

2. Use CSS variables in your styles:
```css
.my-component {
  background-color: var(--color-surface);
  color: var(--color-text);
}
```

3. Update theme programmatically:
```javascript
import themeService from '../services/themeService';

await themeService.updateTheme({
  primary: '#new-color',
  accent: '#new-accent',
  // ...
});
```

## Files Removed
The following files have been removed as part of simplification:
- src/context/ThemeContext.js
- src/components/core/theme/ThemePreview.js
- src/components/core/theme/ColorPicker.js
- src/styles/theme/utils.js
- src/styles/theme/typography.js
- src/styles/theme/spacing.js
- src/styles/theme/palette.js
- src/styles/theme/componentStyles.js

## Best Practices
1. Always use CSS variables for theme colors in components
2. Keep color definitions in the central colors.js file
3. Use semantic color names that describe their purpose
4. Update colors through ThemeService to ensure persistence
