const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', reviewController.getReviews);
router.get('/stats', reviewController.getReviewStats);
router.get('/recent', reviewController.getRecentReviews);
router.get('/top-helpful', reviewController.getTopHelpfulReviews);
router.get('/:reviewId', reviewController.getReview);

// User routes (authentication required)
router.use(auth);

// Review management
router.post('/', reviewController.createReview);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

// User-specific routes
router.get('/user/reviews', reviewController.getUserReviews);

// Review interactions
router.post('/:reviewId/helpful', reviewController.markHelpful);
router.post('/:reviewId/report', reviewController.reportReview);

// Admin routes (for moderation)
router.get('/admin/pending', reviewController.getPendingReviews);
router.post('/admin/:reviewId/moderate', reviewController.moderateReview);
router.post('/admin/:reviewId/respond', reviewController.respondToReview);

module.exports = router; 