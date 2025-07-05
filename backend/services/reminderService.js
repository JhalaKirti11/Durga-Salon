const Reminder = require('../models/Reminder');
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

class ReminderService {
  constructor() {
    // Email transporter (configure for your email service)
    this.emailTransporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  // Create reminders for a new appointment
  async createAppointmentReminders(appointmentId, userId) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const appointmentDate = new Date(appointment.date + ' ' + appointment.time);
      const now = new Date();

      // Calculate reminder times
      const reminderTimes = this.calculateReminderTimes(appointmentDate);
      const reminders = [];

      for (const reminderTime of reminderTimes) {
        if (reminderTime > now) {
          // Email reminder (24 hours before)
          if (reminderTime.getTime() === appointmentDate.getTime() - 24 * 60 * 60 * 1000) {
            const emailReminder = await this.createReminder({
              appointmentId,
              userId,
              type: 'email',
              scheduledFor: reminderTime,
              content: this.generateEmailContent(appointment, '24h')
            });
            reminders.push(emailReminder);
          }

          // SMS reminder (2 hours before)
          if (reminderTime.getTime() === appointmentDate.getTime() - 2 * 60 * 60 * 1000) {
            const smsReminder = await this.createReminder({
              appointmentId,
              userId,
              type: 'sms',
              scheduledFor: reminderTime,
              content: this.generateSMSContent(appointment, '2h')
            });
            reminders.push(smsReminder);
          }
        }
      }

      return reminders;
    } catch (error) {
      console.error('Error creating appointment reminders:', error);
      throw error;
    }
  }

  // Calculate reminder times
  calculateReminderTimes(appointmentDate) {
    const times = [];
    
    // 24 hours before
    times.push(new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000));
    
    // 2 hours before
    times.push(new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000));
    
    // 30 minutes before (optional)
    times.push(new Date(appointmentDate.getTime() - 30 * 60 * 1000));
    
    return times;
  }

  // Create a single reminder
  async createReminder(reminderData) {
    try {
      const reminder = new Reminder({
        ...reminderData,
        deliveryDetails: {
          email: reminderData.content.email || '',
          phone: reminderData.content.phone || ''
        }
      });
      
      return await reminder.save();
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  // Generate email content
  generateEmailContent(appointment, type) {
    const serviceNames = {
      'haircut': 'Hair Cut & Styling',
      'haircolor': 'Hair Coloring',
      'highlights': 'Highlights & Lowlights',
      'facial': 'Facial & Skin Care',
      'manicure': 'Manicure',
      'pedicure': 'Pedicure',
      'manicure-pedicure': 'Manicure & Pedicure',
      'hair-treatment': 'Hair Treatment',
      'bridal': 'Bridal Package'
    };

    const serviceName = serviceNames[appointment.service] || 'Beauty Service';
    const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let subject, message;

    if (type === '24h') {
      subject = `Reminder: Your appointment at Durga Salon tomorrow at ${appointment.time}`;
      message = `
        Dear ${appointment.name},

        This is a friendly reminder about your upcoming appointment at Durga Salon.

        Appointment Details:
        - Date: ${appointmentDate}
        - Time: ${appointment.time}
        - Service: ${serviceName}
        - Appointment ID: ${appointment.appointmentId}

        Please arrive 10 minutes before your scheduled time.

        Important Notes:
        - Bring any relevant medical history or allergy information
        - Payment will be collected at the salon
        - If you need to reschedule, please call us at least 24 hours in advance

        Contact Information:
        Durga Salon
        123 Beauty Street, City Center
        Phone: +91 98765 43210
        Email: info@durgasalon.com

        We look forward to seeing you!

        Best regards,
        Team Durga Salon
      `;
    } else {
      subject = `Reminder: Your appointment at Durga Salon in 2 hours`;
      message = `
        Dear ${appointment.name},

        Your appointment at Durga Salon is in 2 hours!

        Appointment Details:
        - Date: ${appointmentDate}
        - Time: ${appointment.time}
        - Service: ${serviceName}
        - Appointment ID: ${appointment.appointmentId}

        Please arrive 10 minutes before your scheduled time.

        See you soon!

        Best regards,
        Team Durga Salon
      `;
    }

    return {
      subject: subject.trim(),
      message: message.trim(),
      email: appointment.email,
      template: type
    };
  }

  // Generate SMS content
  generateSMSContent(appointment, type) {
    const serviceNames = {
      'haircut': 'Hair Cut & Styling',
      'haircolor': 'Hair Coloring',
      'highlights': 'Highlights & Lowlights',
      'facial': 'Facial & Skin Care',
      'manicure': 'Manicure',
      'pedicure': 'Pedicure',
      'manicure-pedicure': 'Manicure & Pedicure',
      'hair-treatment': 'Hair Treatment',
      'bridal': 'Bridal Package'
    };

    const serviceName = serviceNames[appointment.service] || 'Beauty Service';
    const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    let message;

    if (type === '2h') {
      message = `Durga Salon: Your ${serviceName} appointment is in 2 hours (${appointmentDate} at ${appointment.time}). Please arrive 10 min early. ID: ${appointment.appointmentId}`;
    } else {
      message = `Durga Salon: Your ${serviceName} appointment is in 30 minutes (${appointmentDate} at ${appointment.time}). Please arrive soon. ID: ${appointment.appointmentId}`;
    }

    return {
      message: message.trim(),
      phone: appointment.phone,
      template: type
    };
  }

  // Process pending reminders
  async processPendingReminders() {
    try {
      const pendingReminders = await Reminder.getPendingReminders();
      console.log(`Processing ${pendingReminders.length} pending reminders`);

      for (const reminder of pendingReminders) {
        try {
          await this.sendReminder(reminder);
        } catch (error) {
          console.error(`Error processing reminder ${reminder._id}:`, error);
          await reminder.markAsFailed(error.message);
        }
      }
    } catch (error) {
      console.error('Error processing pending reminders:', error);
      throw error;
    }
  }

  // Send a single reminder
  async sendReminder(reminder) {
    try {
      if (reminder.type === 'email') {
        await this.sendEmailReminder(reminder);
      } else if (reminder.type === 'sms') {
        await this.sendSMSReminder(reminder);
      }

      await reminder.markAsSent();
      console.log(`Reminder ${reminder._id} sent successfully`);
    } catch (error) {
      console.error(`Error sending reminder ${reminder._id}:`, error);
      await reminder.markAsFailed(error.message);
      throw error;
    }
  }

  // Send email reminder
  async sendEmailReminder(reminder) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@durgasalon.com',
        to: reminder.deliveryDetails.email,
        subject: reminder.content.subject,
        text: reminder.content.message,
        html: this.generateEmailHTML(reminder.content.message)
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Send SMS reminder (mock implementation - integrate with SMS service)
  async sendSMSReminder(reminder) {
    try {
      // Mock SMS sending - replace with actual SMS service integration
      console.log(`SMS would be sent to ${reminder.deliveryDetails.phone}: ${reminder.content.message}`);
      
      // Example integration with Twilio or other SMS service:
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: reminder.content.message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: reminder.deliveryDetails.phone
      // });

      return { success: true, messageId: `sms-${Date.now()}` };
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  // Generate HTML email
  generateEmailHTML(textMessage) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Durga Salon</h1>
          </div>
          <div class="content">
            ${textMessage.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>Thank you for choosing Durga Salon</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Cancel reminders for an appointment
  async cancelAppointmentReminders(appointmentId) {
    try {
      const reminders = await Reminder.find({ appointmentId, status: 'pending' });
      for (const reminder of reminders) {
        await reminder.cancel();
      }
      console.log(`Cancelled ${reminders.length} reminders for appointment ${appointmentId}`);
      return reminders.length;
    } catch (error) {
      console.error('Error cancelling reminders:', error);
      throw error;
    }
  }

  // Get reminders for an appointment
  async getAppointmentReminders(appointmentId) {
    try {
      return await Reminder.getAppointmentReminders(appointmentId);
    } catch (error) {
      console.error('Error getting appointment reminders:', error);
      throw error;
    }
  }

  // Update reminder preferences
  async updateReminderPreferences(userId, preferences) {
    try {
      // This would typically update user preferences
      // For now, we'll just log the preferences
      console.log('Updating reminder preferences for user:', userId, preferences);
      return { success: true };
    } catch (error) {
      console.error('Error updating reminder preferences:', error);
      throw error;
    }
  }
}

module.exports = new ReminderService(); 