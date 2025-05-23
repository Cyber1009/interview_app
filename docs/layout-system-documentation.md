# Layout System Documentation

## Overview

The layout system has been simplified and standardized to provide a consistent user experience across the application. This document explains the key components and how they work together.

## Key Components

### Layout Constants (src/styles/spacing.js)

This file contains centralized layout values used throughout the application:

- `drawerWidth`: Standard width for the main navigation drawer (220px)
- `slimDrawerWidth`: Width for the slim sidebar (60px)
- `contentPadding`: Responsive padding values for content areas
- Other spacing constants for consistent layout

### Layout Components

1. **BaseLayout** (`src/components/core/layout/BaseLayout.js`)
   - Full-featured layout with drawer, app bar, and main content area
   - Used for pages that need navigation with text labels and complex hierarchies

2. **SlimSidebarLayout** (`src/components/core/layout/SlimSidebarLayout.js`)
   - Minimalist layout with icon-only sidebar
   - Used for cleaner interfaces where space efficiency is important

3. **PageContainer** (`src/components/interviewer/PageContainer.js`)
   - Consistent container for page content
   - Provides standard header with icon and title
   - Ensures consistent spacing and maximum width

4. **ConsistentCard** (`src/components/interviewer/ConsistentCard.js`)
   - Standardized card component with consistent styling
   - Used for content blocks throughout the application

### Shared Utilities (src/components/core/layout/LayoutUtils.js)

Shared layout utilities to reduce code duplication:

- `MainContentArea`: Common main content container used by both layouts
- `getDrawerPaperStyles`: Consistent drawer styling for both layouts

## Usage Guidelines

1. Use `BaseLayout` for pages that need full navigation with text labels
2. Use `SlimSidebarLayout` for pages where space efficiency is important
3. Always wrap page content in `PageContainer` for consistent spacing
4. Use `ConsistentCard` for content blocks to maintain visual consistency
5. Always reference layout values from `spacing.js` instead of hardcoding values

## Theming Integration

The layout components use CSS variables for theming to ensure consistent appearance:

- `--theme-background-color`: Main background color
- `--theme-text-color`: Main text color
- `--theme-background-paper`: Card and surface background color

These variables are automatically updated when the theme changes.

## Responsive Behavior

The layout system is designed to be responsive:
- On mobile devices, navigation drawers collapse into hamburger menus
- Content padding adjusts based on screen size using the `contentPadding` values
- Maximum widths ensure readability on larger screens
