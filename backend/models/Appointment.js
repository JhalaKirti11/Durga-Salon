const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  customerEmail: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerPhone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  service: {
    type: String,
    required: [true, 'Service selection is required'],
    enum: {
      values: [
        'haircut',
        'haircolor',
        'highlights',
        'facial',
        'manicure',
        'pedicure',
        'manicure-pedicure',
        'hair-treatment',
        'bridal'
      ],
      message: 'Please select a valid service'
    }
  },
  serviceName: {
    type: String,
    required: false // Will be set in pre-save hook
  },
  servicePrice: {
    type: String,
    required: false // Will be set in pre-save hook
  },
  serviceDuration: {
    type: Number,
    required: false // Will be set in pre-save hook
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        if (!value) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);
        
        const appointmentDate = new Date(value);
        appointmentDate.setHours(0, 0, 0, 0);
        
        return appointmentDate >= tomorrow && appointmentDate <= maxDate;
      },
      message: 'Appointment date must be between tomorrow and 30 days from now'
    }
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    validate: {
      validator: function(value) {
        if (!value) return false;
        // More flexible time format validation
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i;
        return timeRegex.test(value);
      },
      message: 'Please select a valid time slot (e.g., 10:00 AM, 2:30 PM)'
    }
  },
  stylist: {
    type: String,
    enum: {
      values: ['priya', 'meera', 'anjali', 'kavita', 'any'],
      message: 'Please select a valid stylist'
    },
    default: 'any'
  },
  stylistName: {
    type: String,
    default: 'Any Available Stylist'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for guest bookings
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  confirmationCode: {
    type: String,
    unique: true,
    // required: true
  },
  totalAmount: {
    type: Number,
    // required: false
  }
}, {
  timestamps: true
});

// Generate confirmation code before saving
appointmentSchema.pre('save', function(next) {
  try {
    // Generate confirmation code if not exists
    if (!this.confirmationCode) {
      this.confirmationCode = 'AP' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    
    // Set service details based on service type
    const serviceDetails = {
      haircut: { name: 'Hair Cut & Styling', price: 500, duration: 60 },
      haircolor: { name: 'Hair Coloring', price: 1500, duration: 120 },
      highlights: { name: 'Highlights & Lowlights', price: 2000, duration: 150 },
      facial: { name: 'Facial & Skin Care', price: 800, duration: 90 },
      manicure: { name: 'Manicure', price: 600, duration: 45 },
      pedicure: { name: 'Pedicure', price: 700, duration: 60 },
      'manicure-pedicure': { name: 'Manicure & Pedicure', price: 1200, duration: 90 },
      'hair-treatment': { name: 'Hair Treatment', price: 1000, duration: 90 },
      bridal: { name: 'Bridal Package', price: 5000, duration: 240 }
    };
    
    if (this.service && serviceDetails[this.service]) {
      this.serviceName = serviceDetails[this.service].name;
      this.servicePrice = `₹${serviceDetails[this.service].price}`;
      this.serviceDuration = serviceDetails[this.service].duration;
      this.totalAmount = serviceDetails[this.service].price;
    } else if (this.service) {
      // If service is provided but not found in serviceDetails, throw error
      return next(new Error(`Invalid service: ${this.service}`));
    }
    
    // Set stylist name
    const stylistNames = {
      priya: 'Priya Sharma',
      meera: 'Meera Patel',
      anjali: 'Anjali Singh',
      kavita: 'Kavita Verma',
      any: 'Any Available Stylist'
    };
    
    if (this.stylist && stylistNames[this.stylist]) {
      this.stylistName = stylistNames[this.stylist];
    } else if (this.stylist) {
      // If stylist is provided but not found in stylistNames, throw error
      return next(new Error(`Invalid stylist: ${this.stylist}`));
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Index for better query performance
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1, stylist: 1 });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ confirmationCode: 1 });

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time
appointmentSchema.virtual('formattedTime').get(function() {
  return this.appointmentTime;
});

// Method to check if appointment conflicts
appointmentSchema.methods.hasConflict = async function() {
  const conflictingAppointment = await this.constructor.findOne({
    appointmentDate: this.appointmentDate,
    appointmentTime: this.appointmentTime,
    stylist: { $in: [this.stylist, 'any'] },
    status: { $in: ['pending', 'confirmed'] },
    _id: { $ne: this._id }
  });
  
  return conflictingAppointment !== null;
};

// Static method to get available time slots for a date
appointmentSchema.statics.getAvailableTimeSlots = async function(date, stylist = 'any') {
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
  ];
  
  const bookedSlots = await this.find({
    appointmentDate: date,
    stylist: { $in: [stylist, 'any'] },
    status: { $in: ['pending', 'confirmed'] }
  }).distinct('appointmentTime');
  
  return timeSlots.filter(slot => !bookedSlots.includes(slot));
};

module.exports = mongoose.model('Appointment', appointmentSchema); 