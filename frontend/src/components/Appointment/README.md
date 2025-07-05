# Appointment Form Component

A comprehensive appointment booking form for the Durga Salon application that allows customers to book beauty services online.

## Features

### 📝 Form Sections
- **Personal Information**: Name, email, and phone number
- **Service Details**: Service selection with pricing and duration
- **Appointment Details**: Date, time, and preferred stylist
- **Additional Information**: Special requests and notes

### 🎯 Key Features
- **Service Selection**: 9 different salon services with pricing
- **Stylist Selection**: Choose from 4 professional stylists or any available
- **Time Slots**: 22 available time slots from 9:00 AM to 7:30 PM
- **Date Validation**: Book appointments up to 30 days in advance
- **Form Validation**: Email, phone, and required field validation
- **Responsive Design**: Works perfectly on all device sizes

### 🎨 UI/UX Features
- **Modal Overlay**: Beautiful modal popup with backdrop blur
- **Smooth Animations**: Slide-in animation and hover effects
- **Service Information**: Dynamic display of selected service details
- **Loading States**: Visual feedback during form submission
- **Error Handling**: Clear error messages for validation issues

## Services Available

1. **Hair Cut & Styling** - ₹500 (60 min)
2. **Hair Coloring** - ₹1500 (120 min)
3. **Highlights & Lowlights** - ₹2000 (150 min)
4. **Facial & Skin Care** - ₹800 (90 min)
5. **Manicure** - ₹600 (45 min)
6. **Pedicure** - ₹700 (60 min)
7. **Manicure & Pedicure** - ₹1200 (90 min)
8. **Hair Treatment** - ₹1000 (90 min)
9. **Bridal Package** - ₹5000 (240 min)

## Stylists

- **Priya Sharma** - Hair Coloring, Styling
- **Meera Patel** - Facial, Skin Care
- **Anjali Singh** - Hair Cut, Treatment
- **Kavita Verma** - Manicure, Pedicure
- **Any Available Stylist** - All Services

## Usage

```jsx
import AppointmentForm from './components/Appointment';

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleClose = () => {
    setShowForm(false);
  };

  const handleSuccess = (appointmentData) => {
    console.log('Appointment booked:', appointmentData);
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Book Appointment</button>
      
      {showForm && (
        <AppointmentForm
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
```

## Props

- `onClose`: Function called when the form is closed
- `onSuccess`: Function called when appointment is successfully booked

## API Integration

The form makes a POST request to `/api/appointments/book` with the following data:

```json
{
  "name": "Customer Name",
  "email": "customer@email.com",
  "phone": "9876543210",
  "service": "haircut",
  "date": "2024-01-15",
  "time": "10:00 AM",
  "stylist": "priya",
  "notes": "Special requests..."
}
```

## Validation Rules

- **Name**: Required, text only
- **Email**: Required, valid email format
- **Phone**: Required, 10 digits only
- **Service**: Required, must select from available services
- **Date**: Required, must be tomorrow or later, max 30 days ahead
- **Time**: Required, must select from available time slots
- **Stylist**: Optional, can be left empty for any available stylist
- **Notes**: Optional, text area for additional information

## Styling

The component uses custom CSS classes for styling:
- `.appointment-overlay` - Modal backdrop
- `.appointment-modal` - Main modal container
- `.appointment-form` - Form styling
- `.form-section` - Section dividers
- `.form-group` - Individual form fields
- `.service-details` - Service information display

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Responsive design for mobile, tablet, and desktop
- Accessibility features for screen readers
- Reduced motion support for users with motion sensitivity

# Appointment Confirmation Modal

A comprehensive confirmation modal that displays detailed appointment information after successful booking.

## Features

- **Complete Appointment Details**: Shows all booking information in organized sections
- **Professional Design**: Modern, clean interface with gradient headers and icons
- **Print Functionality**: Users can print their appointment confirmation
- **Contact Integration**: Direct email contact with pre-filled subject
- **Responsive Design**: Adapts to all screen sizes and devices
- **Accessibility**: Supports dark mode, high contrast, and reduced motion
- **Important Information**: Displays salon policies and guidelines

## Components

### AppointmentConfirmationModal
The main confirmation modal component that displays after successful booking.

#### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appointment` | object | Yes | Complete appointment data object |
| `onClose` | function | Yes | Callback when modal is closed |
| `onPrint` | function | Yes | Callback for print functionality |

#### Appointment Data Structure
```javascript
{
  appointmentId: "APT-1234567890",
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  service: "haircut",
  date: "2024-01-15",
  time: "2:30 PM",
  stylist: "priya",
  notes: "Special requests...",
  // Additional backend data
}
```

## Sections Displayed

### 1. Appointment ID
- Prominently displayed at the top
- Unique identifier for the booking

### 2. Appointment Details
- **Date**: Formatted as "Monday, January 15, 2024"
- **Time**: Selected appointment time
- **Duration**: Service duration in minutes

### 3. Personal Information
- **Name**: Customer's full name
- **Email**: Contact email address
- **Phone**: Contact phone number

### 4. Service Information
- **Service**: Selected service name and details
- **Stylist**: Preferred or assigned stylist
- **Price**: Service cost in Indian Rupees

### 5. Special Requests (if any)
- **Notes**: Any additional requests or information

### 6. Important Information
- Arrival instructions
- Medical history requirements
- Payment information
- Cancellation policy
- Reminder notifications

### 7. Contact Information
- Salon address
- Phone number
- Email address

## Actions Available

### Close Button
- Closes the modal and returns to dashboard
- Located in top-right corner

### Print Confirmation
- Opens browser print dialog
- Optimized print styles included
- Hides action buttons in print view

### Contact Us
- Opens email client with pre-filled subject
- Direct communication with salon

## Styling Features

### Visual Design
- **Gradient Header**: Green success gradient with pulsing icon
- **Sectioned Layout**: Organized information in colored sections
- **Icons**: FontAwesome icons for visual hierarchy
- **Color Coding**: Different colors for different information types

### Animations
- **Fade In**: Smooth overlay appearance
- **Slide Up**: Modal slides up from bottom
- **Pulse**: Success icon pulses for emphasis
- **Hover Effects**: Button interactions

### Responsive Design
- **Mobile Optimized**: Stacked layout on small screens
- **Tablet Friendly**: Adjusted spacing and sizing
- **Desktop Enhanced**: Full-width layout with optimal spacing

## Integration with Appointment Form

The confirmation modal is automatically triggered after successful appointment booking:

1. User submits appointment form
2. Backend processes booking
3. Success notification appears
4. **Confirmation modal displays** with all details
5. User can print, contact, or close modal

## Print Styles

When printing, the modal:
- Removes overlay background
- Hides action buttons
- Optimizes layout for paper
- Maintains all appointment information
- Uses clean, professional formatting

## Accessibility Features

- **Keyboard Navigation**: All buttons are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Adapts to system high contrast mode
- **Dark Mode**: Follows system dark mode preference
- **Reduced Motion**: Respects user motion preferences

## Customization

The modal can be customized by modifying:

- **Colors**: Update CSS variables for branding
- **Content**: Modify information sections
- **Styling**: Adjust animations and layout
- **Actions**: Add or remove action buttons
- **Print Layout**: Customize print styles

## Error Handling

- **Missing Data**: Gracefully handles incomplete appointment data
- **Service Mapping**: Falls back to default values for unknown services
- **Stylist Mapping**: Defaults to "Any Available Stylist" for unknown stylists
- **Date Formatting**: Handles various date formats safely 