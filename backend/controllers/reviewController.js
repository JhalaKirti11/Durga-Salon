const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create a new review
const createReview = async (req, res) => {
  try {
    const {
      appointmentId,
      rating,
      title,
      review,
      stylist,
      categories,
      photos,
      isAnonymous
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!appointmentId || !rating || !title || !review) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number between 1 and 5'
      });
    }

    // Check if appointment exists and belongs to user
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment is completed (can only review completed appointments)
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed appointments'
      });
    }

    // Check if user has already reviewed this appointment
    const existingReview = await Review.findOne({ appointmentId, userId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this appointment'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create review
    const newReview = new Review({
      appointmentId,
      userId,
      customerName: user.name,
      customerEmail: user.email,
      rating,
      title: title.trim(),
      review: review.trim(),
      service: appointment.service,
      stylist: stylist || appointment.stylist,
      categories: categories || {},
      photos: photos || [],
      isAnonymous: isAnonymous || false
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: {
        id: newReview._id,
        rating: newReview.rating,
        title: newReview.title,
        status: newReview.status,
        createdAt: newReview.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get all reviews (with filtering and pagination)
const getReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating,
      service,
      status = 'approved',
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = { status };
    if (rating) filter.rating = parseInt(rating);
    if (service) filter.service = service;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const reviews = await Review.find(filter)
      .sort({ [sort]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('appointmentId', 'date service')
      .populate('userId', 'name');

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        title: review.title,
        review: review.review,
        service: review.service,
        stylist: review.stylist,
        categories: review.categories,
        photos: review.photos,
        displayName: review.displayName,
        isVerified: review.isVerified,
        helpfulCount: review.helpfulCount,
        response: review.response,
        createdAt: review.createdAt,
        appointment: review.appointmentId
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

// Get a single review
const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate('appointmentId', 'date service')
      .populate('userId', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      review: {
        id: review._id,
        rating: review.rating,
        title: review.title,
        review: review.review,
        service: review.service,
        stylist: review.stylist,
        categories: review.categories,
        photos: review.photos,
        displayName: review.displayName,
        isVerified: review.isVerified,
        helpfulCount: review.helpfulCount,
        reportedCount: review.reportedCount,
        response: review.response,
        status: review.status,
        createdAt: review.createdAt,
        appointment: review.appointmentId
      }
    });

  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get review',
      error: error.message
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only allow updates if review is pending
    if (review.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update approved or rejected reviews'
      });
    }

    // Validate rating if provided
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5 || !Number.isInteger(updateData.rating))) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number between 1 and 5'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['rating', 'title', 'review', 'stylist', 'categories', 'photos', 'isAnonymous'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    Object.assign(review, updates);
    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: {
        id: review._id,
        rating: review.rating,
        title: review.title,
        status: review.status,
        updatedAt: review.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating review:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only allow deletion if review is pending
    if (review.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved or rejected reviews'
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.markHelpful();

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpfulCount: review.helpfulCount
    });

  } catch (error) {
    console.error('Error marking review helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message
    });
  }
};

// Report a review
const reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.report();

    res.json({
      success: true,
      message: 'Review reported successfully',
      reportedCount: review.reportedCount
    });

  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: error.message
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('appointmentId', 'date service');

    const total = await Review.countDocuments({ userId });

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        title: review.title,
        review: review.review,
        service: review.service,
        status: review.status,
        helpfulCount: review.helpfulCount,
        response: review.response,
        createdAt: review.createdAt,
        appointment: review.appointmentId
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user reviews',
      error: error.message
    });
  }
};

// Get review statistics
const getReviewStats = async (req, res) => {
  try {
    const { service } = req.query;
    const filter = service ? { service } : {};

    const [averageRating, categoryAverages] = await Promise.all([
      Review.getAverageRating(filter),
      Review.getCategoryAverages(filter)
    ]);

    const stats = {
      averageRating: averageRating[0]?.averageRating || 0,
      totalReviews: averageRating[0]?.totalReviews || 0,
      ratingDistribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      },
      categoryAverages: categoryAverages[0] || {
        cleanliness: 0,
        service: 0,
        staff: 0,
        value: 0,
        atmosphere: 0
      }
    };

    // Calculate rating distribution
    if (averageRating[0]?.ratingDistribution) {
      averageRating[0].ratingDistribution.forEach(rating => {
        stats.ratingDistribution[rating]++;
      });
    }

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error getting review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get review statistics',
      error: error.message
    });
  }
};

// Get recent reviews
const getRecentReviews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const reviews = await Review.getRecentReviews(parseInt(limit));

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        title: review.title,
        review: review.review,
        displayName: review.displayName,
        service: review.service,
        createdAt: review.createdAt
      }))
    });

  } catch (error) {
    console.error('Error getting recent reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent reviews',
      error: error.message
    });
  }
};

// Get top helpful reviews
const getTopHelpfulReviews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const reviews = await Review.getTopHelpfulReviews(parseInt(limit));

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        title: review.title,
        review: review.review,
        displayName: review.displayName,
        service: review.service,
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt
      }))
    });

  } catch (error) {
    console.error('Error getting top helpful reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top helpful reviews',
      error: error.message
    });
  }
};

// Admin: Moderate reviews
const moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action, notes } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    switch (action) {
      case 'approve':
        await review.approve();
        break;
      case 'reject':
        await review.reject(notes);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Use "approve" or "reject"'
        });
    }

    res.json({
      success: true,
      message: `Review ${action}d successfully`,
      review: {
        id: review._id,
        status: review.status,
        moderationNotes: review.moderationNotes
      }
    });

  } catch (error) {
    console.error('Error moderating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate review',
      error: error.message
    });
  }
};

// Admin: Respond to review
const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { message, from } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.addResponse(message, from);

    res.json({
      success: true,
      message: 'Response added successfully',
      response: review.response
    });

  } catch (error) {
    console.error('Error responding to review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

// Admin: Get pending reviews for moderation
const getPendingReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('appointmentId', 'date service')
      .populate('userId', 'name');

    const total = await Review.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        title: review.title,
        review: review.review,
        service: review.service,
        stylist: review.stylist,
        displayName: review.displayName,
        createdAt: review.createdAt,
        appointment: review.appointmentId
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting pending reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending reviews',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getUserReviews,
  getReviewStats,
  getRecentReviews,
  getTopHelpfulReviews,
  moderateReview,
  respondToReview,
  getPendingReviews
}; 