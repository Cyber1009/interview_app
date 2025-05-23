# Theme System Alignment Plan

## 1. Standardized Naming Convention
✅ **Completed**:
- Changed all references from `accent_color` to `accent_color` throughout the application
- Updated `cssVarUtils.js` to use `--theme-secondary-color` CSS variable
- Added backward compatibility for `--theme-accent-color` to support existing components
- Modified `ThemeSettings.js` to use `accent_color` consistently
- Updated `themeService.js` to prioritize `accent_color` over `accent_color`
- Updated `InterviewerPanel.js` to use `secondaryColor` as the primary source

## 2. Centralized Theme Management

### Create a ThemeContext for global theme state
- Implement a React Context to store the current theme
- Add methods to update theme and notify components of changes
- Create a Provider component to wrap the application

### Unified Theme Format Conversion
- Create consistent functions to convert between formats:
  - Backend API format (`primary_color`, `accent_color`, etc.)
  - Frontend state format (`primaryColor`, `secondaryColor`, etc.)
  - MUI theme format (`palette.primary.main`, `palette.secondary.main`, etc.)
  - CSS variables format (`--theme-primary-color`, `--theme-secondary-color`, etc.)

## 3. MUI Theme and CSS Variables Integration

### Create a ThemeSynchronizer Component
- Automatically sync MUI theme changes to CSS variables
- Observe CSS variable changes and update MUI theme when needed
- Handle background color propagation to all components

### Improved Theme Provider
- Extend MUI's ThemeProvider with automatic CSS variable syncing
- Add support for dynamic theme switching without full page reload
- Ensure proper propagation of theme changes to all components

## 4. Component Updates

### Standardize Theme Access
- Create common hooks for accessing theme values:
  - `useThemeColor()` - access theme colors consistently
  - `useThemeVariables()` - access all theme variables
  - `useThemeUpdater()` - update theme colors/variables

### Migration Strategy
- Update components to use standard hooks instead of direct CSS or MUI theme access
- Prioritize components with known theme issues:
  - InterviewerPanel
  - ThemeSettings
  - Interview tabs/pages

## 5. Theme Propagation Fixes

### Fix Background Color Handling
- Ensure consistent background color across main content and sidebar
- Handle nested components that need separate background colors
- Improve contrast handling for text on different backgrounds

### CSS Variable Optimization
- Define a complete set of CSS variables for all theme properties
- Create derived variables for common use cases (hover states, disabled states, etc.)
- Document all available variables and their purpose

## 6. Testing and Validation

### Manual Testing Checklist
- Verify theme consistency across all pages/tabs
- Test theme switching and persistence
- Check background color synchronization
- Validate contrast and accessibility

### Automated Tests
- Add theme-related unit tests
- Create visual regression tests for theme changes
- Test theme persistence across sessions

## 7. Documentation

### Developer Documentation
- Update README with theme architecture explanation
- Document theme hooks and utilities
- Provide examples of proper theme usage

### Code Comments
- Add descriptive comments to theme-related functions
- Document backward compatibility considerations
- Note any edge cases or special handling
