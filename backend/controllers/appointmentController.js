const Appointment = require('../models/Appointment');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Book a new appointment
const bookAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      date,
      time,
      stylist = 'any',
      notes
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Validate service
    const validServices = [
      'haircut', 'haircolor', 'highlights', 'facial', 'manicure',
      'pedicure', 'manicure-pedicure', 'hair-treatment', 'bridal'
    ];
    if (!validServices.includes(service)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid service'
      });
    }

    // Validate date
    const appointmentDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    maxDate.setHours(23, 59, 59, 999);

    if (appointmentDate < tomorrow || appointmentDate > maxDate) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be between tomorrow and 30 days from now'
      });
    }

    // Validate time format
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid time slot (e.g., 10:00 AM, 2:30 PM)'
      });
    }

    // Check for appointment conflicts
    const existingAppointment = await Appointment.findOne({
      appointmentDate: appointmentDate,
      appointmentTime: time,
      stylist: { $in: [stylist, 'any'] },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please select a different time.'
      });
    }

    // Get user ID from token if available
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        if (user) {
          userId = user._id;
        }
      } catch (error) {
        // Token is invalid, continue as guest booking
        console.log('Invalid token, proceeding as guest booking');
      }
    }

    // Create appointment
    console.log('Creating appointment with data:', {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      service: service,
      appointmentDate: appointmentDate,
      appointmentTime: time,
      stylist: stylist,
      notes: notes || '',
      userId: userId
    });

    const appointment = new Appointment({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      service: service,
      appointmentDate: appointmentDate,
      appointmentTime: time,
      stylist: stylist,
      notes: notes || '',
      userId: userId
    });

    console.log('Appointment object created, attempting to save...');
    await appointment.save();
    console.log('Appointment saved successfully');

    // Prepare response data
    const responseData = {
      _id: appointment._id,
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      customerPhone: appointment.customerPhone,
      service: appointment.service,
      serviceName: appointment.serviceName,
      servicePrice: appointment.servicePrice,
      serviceDuration: appointment.serviceDuration,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      stylist: appointment.stylist,
      stylistName: appointment.stylistName,
      notes: appointment.notes,
      status: appointment.status,
      confirmationCode: appointment.confirmationCode,
      totalAmount: appointment.totalAmount,
      bookingDate: appointment.bookingDate,
      formattedDate: appointment.formattedDate,
      formattedTime: appointment.formattedTime
    };

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: responseData
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    console.error('Request body:', req.body);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Appointment with this confirmation code already exists'
      });
    }

    // Handle pre-save hook errors
    if (error.message && error.message.includes('Invalid service')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message && error.message.includes('Invalid stylist')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's appointments
const getUserAppointments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const appointments = await Appointment.find({ userId: user._id })
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error('Error fetching user appointments:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get appointment by confirmation code
const getAppointmentByCode = async (req, res) => {
  try {
    const { confirmationCode } = req.params;

    const appointment = await Appointment.findOne({ confirmationCode });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: user._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed appointment'
      });
    }

    // Check if appointment is within 24 hours
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const appointmentTime = appointment.appointmentTime;
    const [time, period] = appointmentTime.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (period === 'PM' && hours !== '12') {
      hours = parseInt(hours) + 12;
    } else if (period === 'AM' && hours === '12') {
      hours = 0;
    }
    
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const timeDifference = appointmentDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({
        success: false,
        message: 'Appointments can only be cancelled at least 24 hours in advance'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available time slots for a date
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, stylist = 'any' } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    const availableSlots = await Appointment.getAvailableTimeSlots(appointmentDate, stylist);

    res.status(200).json({
      success: true,
      data: {
        date: date,
        stylist: stylist,
        availableSlots: availableSlots
      }
    });

  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin: Get all appointments (for salon management)
const getAllAppointments = async (req, res) => {
  try {
    const { status, date, stylist, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }
    
    if (stylist && stylist !== 'any') {
      query.stylist = stylist;
    }

    const skip = (page - 1) * limit;
    
    const appointments = await Appointment.find(query)
      .populate('userId', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalAppointments: total,
          hasNextPage: skip + appointments.length < total,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin: Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, completed, cancelled'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  bookAppointment,
  getUserAppointments,
  getAppointmentByCode,
  cancelAppointment,
  getAvailableTimeSlots,
  getAllAppointments,
  updateAppointmentStatus
}; 