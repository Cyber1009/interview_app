# Interviewer Components

This directory contains components used in the interviewer section of the application.

## Recent Refactoring (May 2025)

### Component Consolidation

1. **InterviewList → InterviewsTab**
   - `InterviewList.js` has been merged into `InterviewsTab.js`
   - For backward compatibility, `InterviewsTab.js` exports a compatibility component called `InterviewList`
   - Always use `InterviewsTab` for new code

2. **StyledComponents → theme.js**
   - All styling utilities from `StyledComponents.js` have been moved to `src/styles/theme.js`
   - Import component styling functions directly from theme.js:
     ```javascript
     import { 
       getStandardCardStyles, 
       getStandardCardHeaderStyles,
       // other styling utilities...
     } from '../../styles/theme';
     ```

## Component Dependencies

- Most components in this directory depend on Material-UI components
- Styling is provided via theme.js and custom styling functions
- Navigation is handled through React Router v6

## Naming Conventions

- Component files should use PascalCase (e.g., `InterviewerDashboard.js`)
- Component names should match their file names
- Utility functions should use camelCase

## Best Practices

1. Use the provided styling utilities from theme.js
2. Follow the layout guidelines in docs/layout-guide.md
3. For new components, follow the patterns established in existing components
4. Use the PageContainer component for consistent page layouts

## Deprecated Components

The following components have been deprecated and should not be used in new code:
- ~~InterviewList~~ - Use InterviewsTab instead
