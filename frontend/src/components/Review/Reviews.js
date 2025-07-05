import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewStats from './ReviewStats';

const Reviews = ({ showReviewForm = false, appointmentForReview = null }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(showReviewForm);
  const [selectedAppointment, setSelectedAppointment] = useState(appointmentForReview);
  const [filters, setFilters] = useState({
    rating: '',
    service: '',
    page: 1,
    limit: 10
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.service && { service: filters.service })
      });

      const response = await fetch(`http://localhost:5001/api/reviews?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch review statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/reviews/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch review statistics');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      const data = await response.json();
      
      // Add the new review to the list
      setReviews(prev => [data.review, ...prev]);
      
      // Refresh stats
      fetchStats();
      
      // Close form
      setShowForm(false);
      setSelectedAppointment(null);
      
      // Show success message
      alert('Review submitted successfully! Thank you for your feedback.');
      
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle marking review as helpful
  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Update the review in the list
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: review.helpfulCount + 1 }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  // Handle reporting review
  const handleReportReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: 'Inappropriate content' })
      });

      if (response.ok) {
        alert('Review reported successfully. Thank you for helping us maintain quality.');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Open review form for specific appointment
  const openReviewForm = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  // Close review form
  const closeReviewForm = () => {
    setShowForm(false);
    setSelectedAppointment(null);
  };

  // Load data on component mount
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  // Refetch reviews when filters change
  useEffect(() => {
    fetchReviews();
  }, [filters]);

  // Update form visibility when prop changes
  useEffect(() => {
    setShowForm(showReviewForm);
    setSelectedAppointment(appointmentForReview);
  }, [showReviewForm, appointmentForReview]);

  if (loading && reviews.length === 0) {
    return (
      <div className="reviews-container loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="reviews-container error">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Reviews</h3>
        <p>{error}</p>
        <button onClick={fetchReviews} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      {/* Review Statistics */}
      <ReviewStats stats={stats} />

      {/* Review Form Modal */}
      {showForm && (
        <ReviewForm
          appointment={selectedAppointment}
          onClose={closeReviewForm}
          onSuccess={handleReviewSubmit}
        />
      )}

      {/* Review List */}
      <ReviewList
        reviews={reviews}
        onMarkHelpful={handleMarkHelpful}
        onReport={handleReportReview}
        showFilters={true}
      />

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="btn-secondary"
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          
          <span className="page-info">
            Page {filters.page} of {Math.ceil(reviews.length / filters.limit)}
          </span>
          
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={reviews.length < filters.limit}
            className="btn-secondary"
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Write Review Button */}
      {!showForm && (
        <div className="write-review-section">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary write-review-btn"
          >
            <i className="fas fa-star"></i>
            Write a Review
          </button>
          <p className="review-hint">
            Share your experience and help others discover our services
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews; 