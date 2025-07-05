const reminderService = require('../services/reminderService');
const Reminder = require('../models/Reminder');
const Appointment = require('../models/Appointment');

// Create reminders for a new appointment
const createAppointmentReminders = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Verify appointment exists and belongs to user
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const reminders = await reminderService.createAppointmentReminders(appointmentId, userId);
    
    res.status(201).json({
      message: 'Reminders created successfully',
      reminders: reminders.map(r => ({
        id: r._id,
        type: r.type,
        scheduledFor: r.scheduledFor,
        status: r.status
      }))
    });
  } catch (error) {
    console.error('Error creating appointment reminders:', error);
    res.status(500).json({ message: 'Failed to create reminders', error: error.message });
  }
};

// Get reminders for an appointment
const getAppointmentReminders = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Verify appointment belongs to user
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const reminders = await reminderService.getAppointmentReminders(appointmentId);
    
    res.json({
      appointmentId,
      reminders: reminders.map(r => ({
        id: r._id,
        type: r.type,
        scheduledFor: r.scheduledFor,
        sentAt: r.sentAt,
        status: r.status,
        retryCount: r.retryCount,
        content: {
          subject: r.content.subject,
          template: r.content.template
        }
      }))
    });
  } catch (error) {
    console.error('Error getting appointment reminders:', error);
    res.status(500).json({ message: 'Failed to get reminders', error: error.message });
  }
};

// Cancel reminders for an appointment
const cancelAppointmentReminders = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Verify appointment belongs to user
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const cancelledCount = await reminderService.cancelAppointmentReminders(appointmentId);
    
    res.json({
      message: `Cancelled ${cancelledCount} reminders`,
      cancelledCount
    });
  } catch (error) {
    console.error('Error cancelling appointment reminders:', error);
    res.status(500).json({ message: 'Failed to cancel reminders', error: error.message });
  }
};

// Get user's reminder preferences
const getReminderPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's upcoming appointments with reminders
    const appointments = await Appointment.find({ 
      userId, 
      date: { $gte: new Date() },
      status: { $in: ['confirmed', 'pending'] }
    }).sort({ date: 1 });

    const preferences = {
      emailReminders: true,
      smsReminders: true,
      reminderTiming: {
        email: 24, // hours before
        sms: 2     // hours before
      },
      upcomingAppointments: appointments.length
    };

    res.json(preferences);
  } catch (error) {
    console.error('Error getting reminder preferences:', error);
    res.status(500).json({ message: 'Failed to get preferences', error: error.message });
  }
};

// Update user's reminder preferences
const updateReminderPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailReminders, smsReminders, reminderTiming } = req.body;

    const preferences = {
      emailReminders: emailReminders !== undefined ? emailReminders : true,
      smsReminders: smsReminders !== undefined ? smsReminders : true,
      reminderTiming: {
        email: reminderTiming?.email || 24,
        sms: reminderTiming?.sms || 2
      }
    };

    await reminderService.updateReminderPreferences(userId, preferences);
    
    res.json({
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Error updating reminder preferences:', error);
    res.status(500).json({ message: 'Failed to update preferences', error: error.message });
  }
};

// Get all reminders for a user
const getUserReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type, limit = 20, page = 1 } = req.query;

    const query = { userId };
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    
    const reminders = await Reminder.find(query)
      .populate('appointmentId', 'date time service name')
      .sort({ scheduledFor: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Reminder.countDocuments(query);

    res.json({
      reminders: reminders.map(r => ({
        id: r._id,
        type: r.type,
        scheduledFor: r.scheduledFor,
        sentAt: r.sentAt,
        status: r.status,
        appointment: r.appointmentId ? {
          id: r.appointmentId._id,
          date: r.appointmentId.date,
          time: r.appointmentId.time,
          service: r.appointmentId.service,
          name: r.appointmentId.name
        } : null,
        content: {
          subject: r.content.subject,
          template: r.content.template
        }
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user reminders:', error);
    res.status(500).json({ message: 'Failed to get reminders', error: error.message });
  }
};

// Resend a failed reminder
const resendReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOne({ _id: reminderId, userId });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (reminder.status !== 'failed') {
      return res.status(400).json({ message: 'Can only resend failed reminders' });
    }

    // Reset reminder for immediate processing
    reminder.status = 'pending';
    reminder.retryCount = 0;
    reminder.scheduledFor = new Date();
    await reminder.save();

    // Process the reminder immediately
    await reminderService.sendReminder(reminder);
    
    res.json({
      message: 'Reminder resent successfully',
      reminder: {
        id: reminder._id,
        type: reminder.type,
        status: reminder.status,
        sentAt: reminder.sentAt
      }
    });
  } catch (error) {
    console.error('Error resending reminder:', error);
    res.status(500).json({ message: 'Failed to resend reminder', error: error.message });
  }
};

// Test reminder (for development)
const testReminder = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Verify appointment belongs to user
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Create a test reminder for immediate sending
    const testReminder = new Reminder({
      appointmentId,
      userId,
      type: 'email',
      scheduledFor: new Date(),
      status: 'pending',
      content: reminderService.generateEmailContent(appointment, '24h'),
      deliveryDetails: {
        email: appointment.email,
        phone: appointment.phone
      }
    });

    await testReminder.save();
    await reminderService.sendReminder(testReminder);
    
    res.json({
      message: 'Test reminder sent successfully',
      reminder: {
        id: testReminder._id,
        type: testReminder.type,
        status: testReminder.status,
        sentAt: testReminder.sentAt
      }
    });
  } catch (error) {
    console.error('Error sending test reminder:', error);
    res.status(500).json({ message: 'Failed to send test reminder', error: error.message });
  }
};

// Process pending reminders (admin endpoint)
const processPendingReminders = async (req, res) => {
  try {
    await reminderService.processPendingReminders();
    
    res.json({
      message: 'Pending reminders processed successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error processing pending reminders:', error);
    res.status(500).json({ message: 'Failed to process reminders', error: error.message });
  }
};

// Get reminder statistics
const getReminderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Reminder.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalReminders = await Reminder.countDocuments({ userId });
    const upcomingReminders = await Reminder.countDocuments({ 
      userId, 
      status: 'pending',
      scheduledFor: { $gte: new Date() }
    });

    const statsObject = {
      total: totalReminders,
      upcoming: upcomingReminders,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json(statsObject);
  } catch (error) {
    console.error('Error getting reminder stats:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

module.exports = {
  createAppointmentReminders,
  getAppointmentReminders,
  cancelAppointmentReminders,
  getReminderPreferences,
  updateReminderPreferences,
  getUserReminders,
  resendReminder,
  testReminder,
  processPendingReminders,
  getReminderStats
}; 