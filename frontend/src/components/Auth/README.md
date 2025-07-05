# Authentication Components

This directory contains React components for user authentication that integrate with the Durga Salon backend API.

## Components

### AuthContainer
The main container component that manages switching between SignIn and SignUp forms.

**Props:**
- `onAuthSuccess` (function): Callback called when authentication is successful

**Usage:**
```jsx
import { AuthContainer } from './components/Auth';

<AuthContainer onAuthSuccess={(userData) => {
  // Handle successful authentication
  console.log('User logged in:', userData);
}} />
```

### SignIn
Component for user sign-in form.

**Props:**
- `onSwitchToSignUp` (function): Callback to switch to sign-up form
- `onSignInSuccess` (function): Callback called when sign-in is successful

**Features:**
- Email and password validation
- Error handling and display
- Loading states
- Automatic token storage in localStorage

### SignUp
Component for user registration form.

**Props:**
- `onSwitchToSignIn` (function): Callback to switch to sign-in form
- `onSignUpSuccess` (function): Callback called when sign-up is successful

**Features:**
- Name, email, and password fields
- Password confirmation validation
- Password strength validation (minimum 6 characters)
- Error handling and display
- Loading states
- Automatic token storage in localStorage

## API Integration

The components integrate with the following backend endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

## Authentication Service

The `AuthService` class provides utility methods for:

- Making API calls to authentication endpoints
- Managing JWT tokens in localStorage
- Storing and retrieving user data
- Checking authentication status
- Logging out users

**Usage:**
```jsx
import AuthService from '../services/authService';

// Check if user is authenticated
if (AuthService.isAuthenticated()) {
  // User is logged in
}

// Get current user data
const user = AuthService.getUser();

// Logout user
AuthService.logout();
```

## Styling

The components use CSS modules with a modern, responsive design:

- Gradient backgrounds
- Card-based layout
- Smooth animations and transitions
- Mobile-responsive design
- Loading states and error messages

## Error Handling

The components handle various error scenarios:

- Network errors
- Invalid credentials
- User already exists (sign-up)
- Validation errors
- Server errors

All errors are displayed to the user in a user-friendly format.

## Security Features

- Passwords are validated for minimum length
- JWT tokens are stored securely in localStorage
- Automatic token management
- Secure API communication

## Dependencies

- React (with hooks)
- Fetch API for HTTP requests
- LocalStorage for token persistence

## Setup Requirements

1. Ensure the Durga Salon backend server is running on `http://localhost:5001`
2. The backend should have CORS configured to allow requests from `http://localhost:3000`
3. The backend should have the authentication routes set up (`/api/auth/signup` and `/api/auth/signin`) 