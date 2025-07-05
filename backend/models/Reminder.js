const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'push'],
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  sentAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'cancelled'],
    default: 'pending'
  },
  content: {
    subject: String,
    message: String,
    template: String
  },
  deliveryDetails: {
    email: String,
    phone: String,
    sentTo: String,
    errorMessage: String
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  nextRetryAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
reminderSchema.index({ appointmentId: 1, type: 1 });
reminderSchema.index({ scheduledFor: 1, status: 1 });
reminderSchema.index({ userId: 1, status: 1 });
reminderSchema.index({ status: 'pending', scheduledFor: { $lte: new Date() } });

// Pre-save hook to set next retry time
reminderSchema.pre('save', function(next) {
  if (this.isModified('retryCount') && this.retryCount > 0 && this.status === 'failed') {
    // Exponential backoff: 5min, 15min, 30min
    const retryDelays = [5, 15, 30];
    const delayMinutes = retryDelays[Math.min(this.retryCount - 1, retryDelays.length - 1)];
    this.nextRetryAt = new Date(Date.now() + delayMinutes * 60 * 1000);
  }
  next();
});

// Static method to get pending reminders
reminderSchema.statics.getPendingReminders = function() {
  return this.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() }
  }).populate('appointmentId').populate('userId');
};

// Static method to get reminders for an appointment
reminderSchema.statics.getAppointmentReminders = function(appointmentId) {
  return this.find({ appointmentId }).populate('appointmentId').populate('userId');
};

// Instance method to mark as sent
reminderSchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.sentAt = new Date();
  return this.save();
};

// Instance method to mark as failed
reminderSchema.methods.markAsFailed = function(errorMessage) {
  this.status = 'failed';
  this.retryCount += 1;
  this.deliveryDetails.errorMessage = errorMessage;
  
  if (this.retryCount >= this.maxRetries) {
    this.status = 'failed';
  } else {
    this.status = 'pending';
  }
  
  return this.save();
};

// Instance method to cancel reminder
reminderSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

module.exports = mongoose.model('Reminder', reminderSchema); 