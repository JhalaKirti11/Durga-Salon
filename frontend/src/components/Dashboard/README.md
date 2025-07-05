# Dashboard Component

A comprehensive dashboard component for the Durga Salon application that showcases salon images, services, and details.

## Features

### 🎨 Hero Section
- Beautiful gradient background with animated text
- Salon name, tagline, and description
- Call-to-action buttons for booking appointments

### 📸 Image Gallery
- Responsive grid layout showcasing salon images
- Hover effects with image overlays
- Professional salon interior and service photos

### 💇‍♀️ Services Section
- Service cards with icons and pricing
- Hover animations and modern design
- Comprehensive service offerings

### 📞 Contact Information
- Complete contact details (address, phone, email)
- Working hours for all days of the week
- Salon features and benefits

### 🎯 Call-to-Action
- Engaging section to encourage bookings
- Consistent design with the overall theme

## Styling Features

- **Responsive Design**: Works perfectly on all device sizes
- **Modern Animations**: Smooth hover effects and transitions
- **Gradient Backgrounds**: Beautiful color schemes
- **Card-based Layout**: Clean and organized information display
- **Accessibility**: Proper focus states and semantic HTML

## Usage

```jsx
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}
```

## Dependencies

- Font Awesome 6.0.0 (for icons)
- React (for component structure)

## Customization

The component uses data objects that can be easily modified:
- `salonImages`: Array of salon photos
- `salonServices`: Array of service offerings
- `salonDetails`: Object containing all salon information

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Responsive design for mobile, tablet, and desktop 