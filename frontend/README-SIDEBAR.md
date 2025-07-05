# Sidebar Component Documentation

## Overview

The Sidebar component provides a comprehensive navigation and user management interface for the Durga Salon application. It includes user profile information, navigation menu, review functionality, and logout options.

## Features

### 🎯 Core Functionality
- **User Profile Display**: Shows user information, avatar, and statistics
- **Navigation Menu**: Dashboard, appointments, reviews, reminders, and profile sections
- **Review Integration**: Full review and rating functionality within the sidebar
- **Logout Functionality**: Secure logout with session cleanup
- **Responsive Design**: Mobile-friendly interface

### 📱 User Interface
- **Modern Design**: Clean, professional appearance with gradient backgrounds
- **Smooth Animations**: Slide-in/out animations and hover effects
- **Icon Integration**: Font Awesome icons for visual appeal
- **Overlay Support**: Dark overlay when sidebar is open

## Component Structure

### Sidebar Component (`Sidebar.js`)
```javascript
import React, { useState, useEffect } from 'react';
import { Reviews } from '../Review';

const Sidebar = ({ isOpen, onClose, user }) => {
  // State management for different sections
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showReviews, setShowReviews] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // Component logic and rendering
};
```

### Header Component (`Header.js`)
```javascript
import React from 'react';

const Header = ({ onToggleSidebar, user }) => {
  // Header with sidebar toggle and user info
};
```

## Props

### Sidebar Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls sidebar visibility |
| `onClose` | function | Yes | Callback to close sidebar |
| `user` | object | Yes | User data object |

### Header Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onToggleSidebar` | function | Yes | Callback to toggle sidebar |
| `user` | object | Yes | User data object |

## Sections

### 1. Dashboard Section
- Welcome message
- Quick action buttons
- User statistics overview

### 2. Appointments Section
- Appointment summary cards
- Upcoming and completed appointments
- Quick booking access

### 3. Reviews & Ratings Section
- Full review functionality integration
- Review form and list display
- Rating statistics

### 4. Reminder Settings Section
- Email reminder preferences
- SMS reminder settings
- Push notification options

### 5. Profile Section
- Personal information display
- Account statistics
- User activity overview

## User Profile Data

The sidebar fetches and displays comprehensive user profile information:

```javascript
const userProfile = {
  name: "User Name",
  email: "user@example.com",
  phone: "+1234567890",
  appointmentCount: 15,
  reviewCount: 8,
  pendingAppointments: 2
};
```

## API Integration

### Profile Endpoint
```javascript
// GET /api/auth/profile
const response = await fetch('http://localhost:5001/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Response Format
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "appointmentCount": 15,
    "reviewCount": 8,
    "pendingAppointments": 2
  }
}
```

## Styling

### CSS Classes
- `.sidebar`: Main sidebar container
- `.sidebar-header`: Header with logo and close button
- `.sidebar-user-info`: User profile section
- `.sidebar-navigation`: Navigation menu
- `.sidebar-content-area`: Content display area
- `.sidebar-footer`: Footer with logout button

### Key Styling Features
- **Gradient Backgrounds**: Modern gradient designs
- **Smooth Transitions**: 0.3s ease-out animations
- **Responsive Breakpoints**: Mobile-first design
- **Custom Scrollbars**: Styled webkit scrollbars
- **Focus States**: Accessibility improvements

## Responsive Design

### Breakpoints
- **Desktop**: 400px sidebar width
- **Tablet**: 100% width sidebar
- **Mobile**: Optimized spacing and typography

### Mobile Features
- Full-width sidebar on mobile
- Touch-friendly button sizes
- Simplified navigation
- Optimized content layout

## Integration with App.js

```javascript
import React, { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(userData);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="App">
      <Header onToggleSidebar={toggleSidebar} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} user={user} />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}
```

## State Management

### Local State
- `activeSection`: Current active navigation section
- `showReviews`: Controls review component visibility
- `showReviewForm`: Controls review form display
- `userProfile`: User profile data from API

### State Transitions
```javascript
// Section changes
const handleSectionChange = (section) => {
  setActiveSection(section);
  setShowReviews(section === 'reviews');
  setShowReviewForm(false);
};

// Review form toggle
const handleWriteReview = () => {
  setShowReviewForm(true);
  setShowReviews(true);
  setActiveSection('reviews');
};
```

## Event Handlers

### Navigation
- `handleSectionChange()`: Switch between sidebar sections
- `handleWriteReview()`: Open review form
- `handleCloseReviews()`: Close review section

### User Actions
- `handleLogout()`: Logout user and clear session
- `fetchUserProfile()`: Fetch user profile data

## Error Handling

### API Error Handling
```javascript
try {
  const response = await fetch('/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    const data = await response.json();
    setUserProfile(data.user);
  }
} catch (error) {
  console.error('Error fetching user profile:', error);
}
```

### Fallback States
- Loading states for profile data
- Default values for missing user information
- Graceful error handling for API failures

## Accessibility Features

### Keyboard Navigation
- Tab navigation through menu items
- Enter key to activate buttons
- Escape key to close sidebar

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for interactive elements
- Focus management for modal dialogs

### Visual Indicators
- Focus outlines for keyboard navigation
- Hover states for interactive elements
- Active state indicators

## Performance Optimizations

### Lazy Loading
- Profile data fetched on demand
- Review component loaded when needed
- Conditional rendering based on state

### Memory Management
- Cleanup of event listeners
- Proper state reset on logout
- Efficient re-renders with React.memo

## Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### CSS Features Used
- CSS Grid and Flexbox
- CSS Custom Properties
- CSS Animations and Transitions
- Modern CSS Selectors

## Testing Considerations

### Unit Tests
- Component rendering
- State management
- Event handlers
- API integration

### Integration Tests
- Sidebar-header interaction
- Navigation flow
- User authentication flow
- Responsive behavior

### E2E Tests
- Complete user workflows
- Mobile responsiveness
- Cross-browser compatibility

## Troubleshooting

### Common Issues

#### Sidebar Not Opening
- Check `isOpen` prop value
- Verify event handler is connected
- Check for CSS conflicts

#### Profile Data Not Loading
- Verify authentication token
- Check API endpoint availability
- Review network requests

#### Styling Issues
- Check CSS file inclusion
- Verify class names
- Test responsive breakpoints

### Debug Mode
```javascript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Sidebar state:', { isOpen, activeSection, showReviews });
}
```

## Future Enhancements

### Planned Features
- **Dark Mode**: Theme switching capability
- **Customization**: User-configurable sidebar sections
- **Notifications**: Real-time notification display
- **Search**: Global search functionality
- **Shortcuts**: Keyboard shortcuts for navigation

### Performance Improvements
- **Virtual Scrolling**: For large lists
- **Code Splitting**: Lazy load sections
- **Caching**: Profile data caching
- **Optimization**: Bundle size reduction

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Run tests: `npm test`
4. Build for production: `npm run build`

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add proper JSDoc comments

### Git Workflow
1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Submit pull request

## License

This component is part of the Durga Salon application and follows the project's licensing terms. 