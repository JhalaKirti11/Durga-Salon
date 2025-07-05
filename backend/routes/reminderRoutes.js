const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Appointment-specific reminder routes
router.post('/appointments/:appointmentId/reminders', reminderController.createAppointmentReminders);
router.get('/appointments/:appointmentId/reminders', reminderController.getAppointmentReminders);
router.delete('/appointments/:appointmentId/reminders', reminderController.cancelAppointmentReminders);

// User reminder preferences
router.get('/preferences', reminderController.getReminderPreferences);
router.put('/preferences', reminderController.updateReminderPreferences);

// User reminders
router.get('/user', reminderController.getUserReminders);
router.get('/stats', reminderController.getReminderStats);

// Individual reminder actions
router.post('/:reminderId/resend', reminderController.resendReminder);

// Test reminder (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/appointments/:appointmentId/test', reminderController.testReminder);
}

// Admin routes (for processing reminders)
router.post('/process-pending', reminderController.processPendingReminders);

module.exports = router; 