const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getUserAppointments,
  getAppointmentByCode,
  cancelAppointment,
  getAvailableTimeSlots,
  getAllAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/book', optionalAuth, bookAppointment);
router.get('/available-slots', getAvailableTimeSlots);
router.get('/code/:confirmationCode', getAppointmentByCode);

// Debug route for testing
router.post('/test-validation', (req, res) => {
  console.log('Test validation request body:', req.body);
  res.json({
    success: true,
    message: 'Request received',
    body: req.body
  });
});

// Protected routes (authentication required)
router.get('/user', authenticateToken, getUserAppointments);
router.put('/cancel/:appointmentId', authenticateToken, cancelAppointment);

// Admin routes (for salon management)
router.get('/all', authenticateToken, getAllAppointments);
router.put('/status/:appointmentId', authenticateToken, updateAppointmentStatus);

module.exports = router; 