# Interview App Component Structure

This directory contains all React components organized by domain in alignment with the backend structure.

## Directory Organization

```
components/
├── core/                 # Core components used across domains
│   ├── auth/             # Authentication-related core components
│   ├── error/            # Error handling components
│   ├── ui/               # Shared UI components
│   └── theme/            # Theming and styling components
├── admin/                # Admin-specific components
├── auth/                 # Authentication flow components
├── candidate/            # Candidate interview interface
├── interviewer/          # Interviewer management components
├── layout/               # Layout components and templates
└── payment/              # Payment and subscription components
```

## Component Types

### Core Components

Reusable components that provide core functionality across the application:
- **ProtectedRoute**: Route protection based on authentication status
- **ErrorBoundary**: Application-wide error catching
- **LoadingOverlay**: Loading indicators and overlays
- **NotFound**: Standard 404 page
- **ThemeManager**: Application theming system

### Domain Components

Components specific to business domains, aligning with the backend structure:
- **Admin**: System administration and user management
- **Auth**: User authentication, login, registration
- **Candidate**: Interview taking and recording
- **Interviewer**: Interview creation and management
- **Payment**: Subscription handling

### Layout Components

Components that provide page structure:
- **Layout**: Base page layout with navigation
- **DashboardLayout**: Dashboard-specific layout

## Best Practices

1. **Domain-Driven Design**: Keep components organized by domain
2. **Component Composition**: Build complex components from simpler ones
3. **Consistent Naming**: Follow naming conventions for component types
4. **Centralized Exports**: Use index files for clean imports
5. **Separation of Concerns**: Keep UI, state, and logic separated