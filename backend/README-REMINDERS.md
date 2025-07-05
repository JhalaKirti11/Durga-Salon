# Appointment Reminder System

A comprehensive appointment reminder system for Durga Salon that automatically sends email and SMS notifications to customers before their appointments.

## Features

### 🔔 **Automatic Reminders**
- **Email reminders** sent 24 hours before appointment
- **SMS reminders** sent 2 hours before appointment
- **Customizable timing** for different reminder types
- **Automatic creation** when appointments are booked

### 📧 **Email Notifications**
- Professional HTML email templates
- Detailed appointment information
- Salon contact details and policies
- Responsive email design

### 📱 **SMS Notifications**
- Concise appointment details
- Appointment ID for reference
- Arrival instructions

### ⚙️ **User Preferences**
- Enable/disable email reminders
- Enable/disable SMS reminders
- Customizable reminder timing
- Per-appointment reminder management

### 🔄 **Reliability Features**
- **Retry mechanism** with exponential backoff
- **Failed reminder tracking**
- **Manual resend capability**
- **Status monitoring**

## System Architecture

### Models
- **Reminder**: Tracks all reminder instances
- **Appointment**: Enhanced with reminder creation
- **User**: Associated with reminder preferences

### Services
- **ReminderService**: Core reminder logic and delivery
- **Email Service**: Nodemailer integration
- **SMS Service**: Mock implementation (ready for Twilio)

### Controllers
- **ReminderController**: API endpoints for reminder management
- **AppointmentController**: Enhanced with automatic reminder creation

### Cron Jobs
- **Automatic processing**: Every 5 minutes
- **Manual processing**: On-demand via API
- **Graceful shutdown**: Proper cleanup

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer node-cron
```

### 2. Environment Variables
Add to your `.env` file:
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (for Twilio integration)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# Database
MONGO_URI=mongodb://localhost:27017/durga-salon
JWT_SECRET=your-jwt-secret
```

### 3. Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

### 4. Start the Reminder Service
```bash
# Start the main server
npm run dev

# In another terminal, start the reminder processor
npm run reminders
```

## API Endpoints

### Reminder Management
```
POST   /api/reminders/appointments/:appointmentId/reminders
GET    /api/reminders/appointments/:appointmentId/reminders
DELETE /api/reminders/appointments/:appointmentId/reminders
```

### User Preferences
```
GET    /api/reminders/preferences
PUT    /api/reminders/preferences
```

### User Reminders
```
GET    /api/reminders/user
GET    /api/reminders/stats
POST   /api/reminders/:reminderId/resend
```

### Admin/Development
```
POST   /api/reminders/process-pending
POST   /api/reminders/appointments/:appointmentId/test (dev only)
```

## Frontend Integration

### ReminderPreferences Component
- Manage notification preferences
- Customize reminder timing
- Enable/disable reminder types

### Automatic Integration
- Reminders created automatically on appointment booking
- User authentication required for reminder features
- Real-time preference updates

## Reminder Types & Timing

### Default Schedule
- **Email**: 24 hours before appointment
- **SMS**: 2 hours before appointment

### Customizable Options
- Email: 1, 2, 6, 12, 24, 48 hours before
- SMS: 1, 2, 4, 6, 12, 24 hours before

## Email Templates

### 24-Hour Reminder
- Professional greeting
- Complete appointment details
- Salon policies and instructions
- Contact information
- Arrival instructions

### 2-Hour Reminder
- Brief reminder format
- Essential appointment details
- Quick arrival instructions

## SMS Templates

### Format
```
Durga Salon: Your [Service] appointment is in [Time] ([Date] at [Time]). Please arrive 10 min early. ID: [AppointmentID]
```

## Error Handling

### Retry Mechanism
- **3 retry attempts** for failed deliveries
- **Exponential backoff**: 5min, 15min, 30min delays
- **Status tracking**: pending, sent, failed, cancelled

### Failure Recovery
- Manual resend capability
- Detailed error logging
- User notification of failures

## Monitoring & Statistics

### Reminder Stats
- Total reminders created
- Success/failure rates
- Upcoming reminders count
- Status distribution

### User Dashboard
- Reminder history
- Preference management
- Appointment-specific reminders

## Development Features

### Test Reminders
```bash
# Send test reminder for an appointment
POST /api/reminders/appointments/:appointmentId/test
```

### Manual Processing
```bash
# Process pending reminders manually
POST /api/reminders/process-pending
```

### Debug Logging
- Detailed console logging
- Error tracking
- Performance monitoring

## Production Deployment

### Email Service
- Configure production email service (SendGrid, AWS SES)
- Update email templates for branding
- Set up email analytics

### SMS Service
- Integrate with Twilio or similar service
- Configure phone number verification
- Set up SMS analytics

### Cron Jobs
- Use system cron or cloud scheduler
- Monitor job execution
- Set up alerts for failures

### Database
- Ensure proper indexing for performance
- Set up database backups
- Monitor query performance

## Security Considerations

### Authentication
- All reminder endpoints require authentication
- User can only access their own reminders
- Appointment ownership verification

### Data Protection
- Encrypt sensitive information
- Secure email/SMS delivery
- GDPR compliance for user data

### Rate Limiting
- Prevent abuse of reminder endpoints
- Limit manual reminder creation
- Monitor API usage

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check email credentials
   - Verify Gmail App Password
   - Check firewall settings

2. **Reminders not processing**
   - Verify cron job is running
   - Check MongoDB connection
   - Review error logs

3. **SMS not working**
   - Integrate with SMS service
   - Verify phone number format
   - Check SMS service credentials

### Debug Commands
```bash
# Check reminder status
curl -H "Authorization: Bearer TOKEN" http://localhost:5001/api/reminders/stats

# Process reminders manually
curl -X POST -H "Authorization: Bearer TOKEN" http://localhost:5001/api/reminders/process-pending

# Test reminder for specific appointment
curl -X POST -H "Authorization: Bearer TOKEN" http://localhost:5001/api/reminders/appointments/APPOINTMENT_ID/test
```

## Future Enhancements

### Planned Features
- **Push notifications** for mobile app
- **Multi-language support** for reminders
- **Advanced scheduling** (multiple reminders)
- **Reminder analytics** dashboard
- **Integration** with calendar apps

### Scalability
- **Queue system** for high-volume processing
- **Microservices** architecture
- **Cloud deployment** options
- **Load balancing** for reminder processing

## Support

For technical support or questions about the reminder system:
- Check the logs for error details
- Verify configuration settings
- Test with development endpoints
- Review this documentation

The reminder system is designed to be reliable, scalable, and user-friendly while providing comprehensive appointment management capabilities. 