import React, { useState, useEffect } from 'react';

const ReviewStats = ({ stats, service = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryLabels = {
    cleanliness: 'Cleanliness',
    service: 'Service Quality',
    staff: 'Staff Friendliness',
    value: 'Value for Money',
    atmosphere: 'Atmosphere'
  };

  const renderStars = (rating, size = 'medium') => {
    const starClass = `star-display ${size}`;
    return (
      <div className={starClass}>
        {[1, 2, 3, 4, 5].map(star => (
          <i
            key={star}
            className={`fas fa-star ${star <= rating ? 'filled' : 'empty'}`}
          ></i>
        ))}
        <span className="rating-number">{rating.toFixed(1)}/5</span>
      </div>
    );
  };

  const renderRatingBar = (rating, count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="rating-bar">
        <div className="rating-label">{rating} stars</div>
        <div className="rating-progress">
          <div 
            className="rating-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="rating-count">{count}</div>
      </div>
    );
  };

  const renderCategoryBar = (category, rating) => {
    const percentage = (rating / 5) * 100;
    return (
      <div className="category-bar">
        <div className="category-label">{categoryLabels[category]}</div>
        <div className="category-progress">
          <div 
            className="category-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="category-rating">{rating.toFixed(1)}/5</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="review-stats loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-stats error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="review-stats empty">
        <i className="fas fa-chart-bar"></i>
        <p>No statistics available</p>
      </div>
    );
  }

  const totalReviews = stats.totalReviews;
  const averageRating = stats.averageRating;
  const ratingDistribution = stats.ratingDistribution || {};
  const categoryAverages = stats.categoryAverages || {};

  return (
    <div className="review-stats">
      <div className="stats-header">
        <h3>
          <i className="fas fa-chart-bar"></i>
          Customer Reviews
          {service && <span className="service-filter"> - {service}</span>}
        </h3>
        {totalReviews > 0 && (
          <div className="overall-stats">
            <div className="average-rating">
              <div className="rating-display">
                {renderStars(averageRating, 'large')}
              </div>
              <div className="rating-summary">
                <div className="total-reviews">{totalReviews} reviews</div>
                <div className="rating-text">
                  {averageRating >= 4.5 && 'Excellent'}
                  {averageRating >= 4.0 && averageRating < 4.5 && 'Very Good'}
                  {averageRating >= 3.5 && averageRating < 4.0 && 'Good'}
                  {averageRating >= 3.0 && averageRating < 3.5 && 'Average'}
                  {averageRating < 3.0 && 'Below Average'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {totalReviews > 0 && (
        <>
          <div className="stats-section">
            <h4>Rating Distribution</h4>
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => 
                renderRatingBar(rating, ratingDistribution[rating] || 0, totalReviews)
              )}
            </div>
          </div>

          <div className="stats-section">
            <h4>Category Ratings</h4>
            <div className="category-ratings">
              {Object.entries(categoryAverages).map(([category, rating]) => {
                if (rating === 0 || rating === null) return null;
                return (
                  <div key={category} className="category-item">
                    {renderCategoryBar(category, rating)}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="stats-summary">
            <div className="summary-item">
              <i className="fas fa-star"></i>
              <div className="summary-content">
                <div className="summary-label">Average Rating</div>
                <div className="summary-value">{averageRating.toFixed(1)}/5</div>
              </div>
            </div>
            <div className="summary-item">
              <i className="fas fa-comments"></i>
              <div className="summary-content">
                <div className="summary-label">Total Reviews</div>
                <div className="summary-value">{totalReviews}</div>
              </div>
            </div>
            <div className="summary-item">
              <i className="fas fa-thumbs-up"></i>
              <div className="summary-content">
                <div className="summary-label">5-Star Reviews</div>
                <div className="summary-value">
                  {ratingDistribution[5] || 0} ({totalReviews > 0 ? ((ratingDistribution[5] || 0) / totalReviews * 100).toFixed(1) : 0}%)
                </div>
              </div>
            </div>
            <div className="summary-item">
              <i className="fas fa-chart-line"></i>
              <div className="summary-content">
                <div className="summary-label">4+ Star Reviews</div>
                <div className="summary-value">
                  {(ratingDistribution[5] || 0) + (ratingDistribution[4] || 0)} ({totalReviews > 0 ? (((ratingDistribution[5] || 0) + (ratingDistribution[4] || 0)) / totalReviews * 100).toFixed(1) : 0}%)
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {totalReviews === 0 && (
        <div className="no-stats">
          <i className="fas fa-star"></i>
          <h4>No reviews yet</h4>
          <p>Be the first to share your experience and help others!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewStats; 