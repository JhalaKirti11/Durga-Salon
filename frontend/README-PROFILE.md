# Profile Page Component Documentation

## Overview

The Profile Page component provides a comprehensive user profile management interface for the Durga Salon application. It allows users to view and edit their personal information, manage account settings, and view their activity statistics.

## Features

### 🎯 Core Functionality
- **Profile Overview**: Display user information, avatar, and statistics
- **Profile Editing**: Edit personal information with form validation
- **Account Settings**: Manage notification preferences and privacy settings
- **Statistics Display**: Show appointment count, reviews, and pending appointments
- **Modal Interface**: Full-screen modal with overlay and smooth animations

### 📱 User Interface
- **Modern Design**: Clean, professional appearance with gradient backgrounds
- **Tab Navigation**: Overview and Settings tabs for organized content
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Form Validation**: Real-time validation and error handling

## Component Structure

### ProfilePage Component (`ProfilePage.js`)
```javascript
import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, onClose, isOpen }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Component logic and rendering
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | object | Yes | User data object |
| `onClose` | function | Yes | Callback to close profile page |
| `isOpen` | boolean | Yes | Controls profile page visibility |

## Sections

### 1. Overview Tab
- **Profile Header**: User avatar, name, email, and member since date
- **Statistics Cards**: Appointment count, review count, pending appointments
- **Personal Information**: Detailed view of user data
- **Edit Button**: Quick access to edit mode

### 2. Edit Mode
- **Form Fields**: Name, email, phone, address
- **Validation**: Required field validation and email format checking
- **Save/Cancel Actions**: Form submission and cancellation
- **Success Feedback**: User feedback on successful updates

### 3. Settings Tab
- **Notification Preferences**: Email, SMS, and push notification settings
- **Privacy Settings**: Profile visibility and marketing preferences
- **Account Actions**: Delete account option with warning

## User Profile Data

The profile page displays comprehensive user information:

```javascript
const userProfile = {
  _id: "user_id",
  name: "User Name",
  email: "user@example.com",
  phone: "+1234567890",
  address: "123 Main St, City, State",
  createdAt: "2024-01-01T00:00:00.000Z",
  appointmentCount: 15,
  reviewCount: 8,
  pendingAppointments: 2
};
```

## API Integration

### Get Profile Endpoint
```javascript
// GET /api/auth/profile
const response = await fetch('http://localhost:5001/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Update Profile Endpoint
```javascript
// PUT /api/auth/profile
const response = await fetch('http://localhost:5001/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(formData)
});
```

### Request/Response Format
```json
// Request
{
  "name": "Updated Name",
  "email": "updated@email.com",
  "phone": "+1234567890",
  "address": "Updated Address"
}

// Response
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "updated@email.com",
    "phone": "+1234567890",
    "address": "Updated Address",
    "appointmentCount": 15,
    "reviewCount": 8,
    "pendingAppointments": 2
  }
}
```

## State Management

### Local State
- `userProfile`: User profile data from API
- `loading`: Loading state for API calls
- `activeTab`: Current active tab (overview/settings)
- `editMode`: Edit mode toggle
- `formData`: Form data for editing

### State Transitions
```javascript
// Tab switching
const handleTabChange = (tab) => {
  setActiveTab(tab);
  setEditMode(false);
};

// Edit mode toggle
const handleEditMode = () => {
  setEditMode(true);
  setActiveTab('overview');
};

// Form submission
const handleSaveProfile = async () => {
  // API call and state updates
  setEditMode(false);
  setUserProfile(updatedData);
};
```

## Event Handlers

### Profile Management
- `fetchUserProfile()`: Fetch user profile data
- `handleInputChange()`: Handle form input changes
- `handleSaveProfile()`: Save profile changes
- `handleCancelEdit()`: Cancel edit mode

### Navigation
- `handleTabChange()`: Switch between tabs
- `handleEditMode()`: Enter edit mode
- `handleClose()`: Close profile page

## Form Validation

### Required Fields
- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Phone**: Optional, phone number format
- **Address**: Optional, text area

### Validation Rules
```javascript
const validateForm = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  return errors;
};
```

## Styling

### CSS Classes
- `.profile-page`: Main modal container
- `.profile-page-header`: Header with close button and title
- `.profile-tabs`: Tab navigation
- `.profile-content`: Content area with scrolling
- `.profile-overview`: Overview tab content
- `.profile-edit`: Edit mode content
- `.profile-settings`: Settings tab content

### Key Styling Features
- **Modal Design**: Fixed positioning with overlay
- **Gradient Backgrounds**: Modern gradient designs
- **Smooth Animations**: Slide-in and fade animations
- **Responsive Grid**: CSS Grid for layout
- **Custom Scrollbars**: Styled webkit scrollbars

## Responsive Design

### Breakpoints
- **Desktop**: 800px max-width modal
- **Tablet**: 95% width, adjusted spacing
- **Mobile**: Full-screen modal, stacked layout

### Mobile Features
- Full-screen modal on mobile
- Stacked form fields
- Touch-friendly button sizes
- Optimized typography

## Integration with App.js

```javascript
import React, { useState } from 'react';
import ProfilePage from './components/Profile/ProfilePage';

function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(userData);

  const openProfile = () => setProfileOpen(true);
  const closeProfile = () => setProfileOpen(false);

  return (
    <div className="App">
      <Header onOpenProfile={openProfile} user={user} />
      <Sidebar onOpenProfile={openProfile} user={user} />
      <ProfilePage
        user={user}
        isOpen={profileOpen}
        onClose={closeProfile}
      />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}
```

## Backend Integration

### User Model Updates
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  address: { type: String, trim: true }
}, { timestamps: true });
```

### Controller Functions
- `getProfile()`: Fetch user profile with statistics
- `updateProfile()`: Update user profile information

### Routes
- `GET /api/auth/profile`: Get user profile
- `PUT /api/auth/profile`: Update user profile

## Error Handling

### API Error Handling
```javascript
try {
  const response = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(formData)
  });
  
  if (response.ok) {
    const data = await response.json();
    setUserProfile(data.user);
    alert('Profile updated successfully!');
  } else {
    const error = await response.json();
    alert(error.message || 'Failed to update profile');
  }
} catch (error) {
  console.error('Error updating profile:', error);
  alert('Failed to update profile. Please try again.');
}
```

### Form Validation Errors
- Required field validation
- Email format validation
- Duplicate email checking
- Network error handling

## Accessibility Features

### Keyboard Navigation
- Tab navigation through form fields
- Enter key to submit forms
- Escape key to close modal
- Focus management for modal dialogs

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for form fields
- Proper heading hierarchy
- Descriptive button text

### Visual Indicators
- Focus outlines for keyboard navigation
- Loading states with spinners
- Success/error message display
- Form validation indicators

## Performance Optimizations

### Lazy Loading
- Profile data fetched on demand
- Conditional rendering based on state
- Efficient re-renders with React.memo

### Memory Management
- Cleanup of event listeners
- Proper state reset on close
- Efficient API calls with caching

## Testing Considerations

### Unit Tests
- Component rendering
- State management
- Form validation
- API integration

### Integration Tests
- Profile update flow
- Error handling
- Navigation between tabs
- Modal open/close behavior

### E2E Tests
- Complete profile update workflow
- Mobile responsiveness
- Cross-browser compatibility

## Troubleshooting

### Common Issues

#### Profile Not Loading
- Check authentication token
- Verify API endpoint availability
- Review network requests
- Check user permissions

#### Form Submission Fails
- Validate required fields
- Check email format
- Verify email uniqueness
- Review server logs

#### Modal Not Opening
- Check `isOpen` prop value
- Verify event handler connection
- Check for CSS conflicts
- Review z-index values

### Debug Mode
```javascript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Profile state:', { 
    isOpen, 
    activeTab, 
    editMode, 
    userProfile 
  });
}
```

## Future Enhancements

### Planned Features
- **Profile Picture Upload**: Avatar upload functionality
- **Password Change**: Secure password update
- **Two-Factor Authentication**: Enhanced security
- **Activity History**: Detailed user activity log
- **Preferences Management**: Advanced user preferences

### Performance Improvements
- **Image Optimization**: Compressed profile pictures
- **Caching Strategy**: Profile data caching
- **Offline Support**: Offline profile viewing
- **Progressive Loading**: Lazy load profile sections

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