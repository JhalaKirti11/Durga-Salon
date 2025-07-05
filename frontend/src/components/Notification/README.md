# Success Notification Component

A beautiful, animated success notification component that displays popup messages for successful actions.

## Features

- **Animated Entry/Exit**: Smooth slide-in from right with bounce effect
- **Auto-dismiss**: Automatically closes after 5 seconds
- **Progress Bar**: Visual countdown showing when the notification will close
- **Manual Close**: Users can close the notification manually
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Supports reduced motion preferences and high contrast mode
- **Dark Mode**: Automatically adapts to system dark mode preference

## Usage

```jsx
import SuccessNotification from '../Notification/SuccessNotification';

const MyComponent = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleSuccess = () => {
    setMessage('Your action was completed successfully!');
    setShowSuccess(true);
  };

  return (
    <>
      <SuccessNotification
        message={message}
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      {/* Your other components */}
    </>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | Yes | The success message to display |
| `show` | boolean | Yes | Controls visibility of the notification |
| `onClose` | function | Yes | Callback function when notification is closed |

## Styling

The component uses CSS animations and includes:

- **Slide-in animation** from the right
- **Bounce effect** for emphasis
- **Progress bar** showing auto-dismiss countdown
- **Pulse animation** on the success icon
- **Hover effects** on the close button

## Accessibility Features

- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **High Contrast**: Adapts to high contrast mode
- **Dark Mode**: Supports system dark mode preference
- **Keyboard Navigation**: Close button is keyboard accessible

## Integration with Appointment Form

The success notification is integrated into the AppointmentForm component and displays:

- Appointment date and time
- Confirmation message
- Auto-dismiss after 5 seconds
- Form closes automatically after 2 seconds

## Customization

You can customize the notification by modifying the CSS variables in `SuccessNotification.css`:

- Colors and gradients
- Animation timing
- Position and size
- Typography
- Spacing and padding 