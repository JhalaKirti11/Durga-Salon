const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number between 1 and 5'
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  service: {
    type: String,
    required: true,
    enum: [
      'haircut', 'haircolor', 'highlights', 'facial', 'manicure',
      'pedicure', 'manicure-pedicure', 'hair-treatment', 'bridal'
    ]
  },
  stylist: {
    type: String,
    trim: true
  },
  categories: {
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    service: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    staff: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    atmosphere: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: 100
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  moderationNotes: {
    type: String,
    maxlength: 500
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportedCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  response: {
    from: {
      type: String,
      default: 'Durga Salon'
    },
    message: {
      type: String,
      maxlength: 500
    },
    respondedAt: {
      type: Date
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
reviewSchema.index({ appointmentId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ service: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ helpfulCount: -1, createdAt: -1 });
reviewSchema.index({ 'categories.cleanliness': 1 });
reviewSchema.index({ 'categories.service': 1 });
reviewSchema.index({ 'categories.staff': 1 });
reviewSchema.index({ 'categories.value': 1 });
reviewSchema.index({ 'categories.atmosphere': 1 });

// Pre-save hook to generate tags
reviewSchema.pre('save', function(next) {
  if (this.isModified('review') || this.isModified('title')) {
    this.tags = this.generateTags();
  }
  next();
});

// Instance method to generate tags from review content
reviewSchema.methods.generateTags = function() {
  const tags = [];
  const content = `${this.title} ${this.review}`.toLowerCase();
  
  // Service-specific tags
  const serviceTags = {
    'haircut': ['haircut', 'hair', 'style', 'trim'],
    'haircolor': ['color', 'dye', 'haircolor', 'coloring'],
    'highlights': ['highlights', 'lowlights', 'balayage'],
    'facial': ['facial', 'skin', 'beauty', 'treatment'],
    'manicure': ['manicure', 'nails', 'polish'],
    'pedicure': ['pedicure', 'feet', 'toes'],
    'manicure-pedicure': ['manicure', 'pedicure', 'nails'],
    'hair-treatment': ['treatment', 'hair', 'therapy'],
    'bridal': ['bridal', 'wedding', 'special', 'occasion']
  };
  
  if (serviceTags[this.service]) {
    tags.push(...serviceTags[this.service]);
  }
  
  // Sentiment tags
  if (this.rating >= 4) {
    tags.push('positive', 'satisfied', 'happy');
  } else if (this.rating <= 2) {
    tags.push('negative', 'dissatisfied');
  } else {
    tags.push('neutral');
  }
  
  // Common words
  const commonWords = ['great', 'good', 'excellent', 'amazing', 'wonderful', 'professional', 'clean', 'friendly'];
  commonWords.forEach(word => {
    if (content.includes(word)) {
      tags.push(word);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
};

// Static method to get average rating
reviewSchema.statics.getAverageRating = function(filter = {}) {
  return this.aggregate([
    { $match: { ...filter, status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
};

// Static method to get category averages
reviewSchema.statics.getCategoryAverages = function(filter = {}) {
  return this.aggregate([
    { $match: { ...filter, status: 'approved' } },
    {
      $group: {
        _id: null,
        cleanliness: { $avg: '$categories.cleanliness' },
        service: { $avg: '$categories.service' },
        staff: { $avg: '$categories.staff' },
        value: { $avg: '$categories.value' },
        atmosphere: { $avg: '$categories.atmosphere' }
      }
    }
  ]);
};

// Static method to get recent reviews
reviewSchema.statics.getRecentReviews = function(limit = 10, filter = {}) {
  return this.find({ ...filter, status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('appointmentId', 'date service')
    .populate('userId', 'name');
};

// Static method to get top helpful reviews
reviewSchema.statics.getTopHelpfulReviews = function(limit = 10, filter = {}) {
  return this.find({ ...filter, status: 'approved' })
    .sort({ helpfulCount: -1, createdAt: -1 })
    .limit(limit)
    .populate('appointmentId', 'date service')
    .populate('userId', 'name');
};

// Instance method to mark as helpful
reviewSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

// Instance method to report review
reviewSchema.methods.report = function() {
  this.reportedCount += 1;
  if (this.reportedCount >= 3) {
    this.status = 'flagged';
  }
  return this.save();
};

// Instance method to approve review
reviewSchema.methods.approve = function() {
  this.status = 'approved';
  return this.save();
};

// Instance method to reject review
reviewSchema.methods.reject = function(notes = '') {
  this.status = 'rejected';
  this.moderationNotes = notes;
  return this.save();
};

// Instance method to add response
reviewSchema.methods.addResponse = function(message, from = 'Durga Salon') {
  this.response = {
    from,
    message,
    respondedAt: new Date()
  };
  return this.save();
};

// Virtual for display name (anonymous or real)
reviewSchema.virtual('displayName').get(function() {
  return this.isAnonymous ? 'Anonymous Customer' : this.customerName;
});

// Virtual for average category rating
reviewSchema.virtual('averageCategoryRating').get(function() {
  const categories = Object.values(this.categories).filter(rating => rating !== null);
  return categories.length > 0 ? categories.reduce((a, b) => a + b, 0) / categories.length : null;
});

// Ensure virtuals are included in JSON
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema); 