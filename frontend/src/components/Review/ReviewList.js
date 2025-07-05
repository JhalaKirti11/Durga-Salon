import React, { useState, useEffect } from 'react';

const ReviewList = ({ reviews = [], onMarkHelpful, onReport, showFilters = true }) => {
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [filters, setFilters] = useState({
    rating: '',
    service: '',
    sortBy: 'newest'
  });

  const serviceNames = {
    'haircut': 'Hair Cut & Styling',
    'haircolor': 'Hair Coloring',
    'highlights': 'Highlights & Lowlights',
    'facial': 'Facial & Skin Care',
    'manicure': 'Manicure',
    'pedicure': 'Pedicure',
    'manicure-pedicure': 'Manicure & Pedicure',
    'hair-treatment': 'Hair Treatment',
    'bridal': 'Bridal Package'
  };

  useEffect(() => {
    let filtered = [...reviews];

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === parseInt(filters.rating));
    }

    // Apply service filter
    if (filters.service) {
      filtered = filtered.filter(review => review.service === filters.service);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      default:
        break;
    }

    setFilteredReviews(filtered);
  }, [reviews, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map(star => (
          <i
            key={star}
            className={`fas fa-star ${star <= rating ? 'filled' : 'empty'}`}
          ></i>
        ))}
        <span className="rating-number">{rating}/5</span>
      </div>
    );
  };

  const renderCategoryStars = (categories) => {
    if (!categories) return null;

    const categoryLabels = {
      cleanliness: 'Cleanliness',
      service: 'Service',
      staff: 'Staff',
      value: 'Value',
      atmosphere: 'Atmosphere'
    };

    return (
      <div className="category-ratings-display">
        {Object.entries(categories).map(([key, rating]) => {
          if (rating === null) return null;
          return (
            <div key={key} className="category-rating-item">
              <span className="category-label">{categoryLabels[key]}:</span>
              <div className="category-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`fas fa-star ${star <= rating ? 'filled' : 'empty'}`}
                  ></i>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPhotos = (photos) => {
    if (!photos || photos.length === 0) return null;

    return (
      <div className="review-photos">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo.url} alt={photo.caption || `Review photo ${index + 1}`} />
            {photo.caption && <p className="photo-caption">{photo.caption}</p>}
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        if (onMarkHelpful) {
          onMarkHelpful(reviewId);
        }
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const handleReport = async (reviewId) => {
    if (!window.confirm('Are you sure you want to report this review?')) {
      return;
    }

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
        if (onReport) {
          onReport(reviewId);
        }
        alert('Review reported successfully');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <i className="fas fa-comments"></i>
        <h3>No reviews yet</h3>
        <p>Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {showFilters && (
        <div className="review-filters">
          <div className="filter-group">
            <label htmlFor="rating-filter">Filter by Rating:</label>
            <select
              id="rating-filter"
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="service-filter">Filter by Service:</label>
            <select
              id="service-filter"
              name="service"
              value={filters.service}
              onChange={handleFilterChange}
            >
              <option value="">All Services</option>
              {Object.entries(serviceNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      <div className="reviews-container">
        {filteredReviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-name">
                  {review.displayName}
                  {review.isVerified && (
                    <i className="fas fa-check-circle verified-badge" title="Verified Customer"></i>
                  )}
                </div>
                <div className="review-date">{formatDate(review.createdAt)}</div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>

            <div className="review-content">
              <h3 className="review-title">{review.title}</h3>
              <p className="review-text">{review.review}</p>
              
              {renderCategoryStars(review.categories)}
              {renderPhotos(review.photos)}
            </div>

            <div className="review-meta">
              <div className="service-info">
                <span className="service-badge">{serviceNames[review.service]}</span>
                {review.stylist && (
                  <span className="stylist-info">by {review.stylist}</span>
                )}
              </div>

              <div className="review-actions">
                <button
                  className="action-button helpful"
                  onClick={() => handleMarkHelpful(review.id)}
                  title="Mark as helpful"
                >
                  <i className="fas fa-thumbs-up"></i>
                  Helpful ({review.helpfulCount})
                </button>
                <button
                  className="action-button report"
                  onClick={() => handleReport(review.id)}
                  title="Report review"
                >
                  <i className="fas fa-flag"></i>
                  Report
                </button>
              </div>
            </div>

            {review.response && (
              <div className="salon-response">
                <div className="response-header">
                  <i className="fas fa-reply"></i>
                  <span className="response-from">{review.response.from}</span>
                  <span className="response-date">{formatDate(review.response.respondedAt)}</span>
                </div>
                <p className="response-message">{review.response.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && reviews.length > 0 && (
        <div className="no-filtered-reviews">
          <i className="fas fa-filter"></i>
          <h3>No reviews match your filters</h3>
          <p>Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList; 