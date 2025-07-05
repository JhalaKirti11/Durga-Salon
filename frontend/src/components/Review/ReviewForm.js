import React, { useState, useEffect } from 'react';

const ReviewForm = ({ appointment, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    review: '',
    stylist: appointment?.stylist || '',
    categories: {
      cleanliness: null,
      service: null,
      staff: null,
      value: null,
      atmosphere: null
    },
    photos: [],
    isAnonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);

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

  const categoryLabels = {
    cleanliness: 'Cleanliness',
    service: 'Service Quality',
    staff: 'Staff Friendliness',
    value: 'Value for Money',
    atmosphere: 'Atmosphere'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: rating
      }
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      url: URL.createObjectURL(file),
      caption: '',
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const updatePhotoCaption = (index, caption) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) => 
        i === index ? { ...photo, caption } : photo
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.rating) {
      setError('Please provide a rating');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please provide a review title');
      return;
    }

    if (!formData.review.trim()) {
      setError('Please provide a review');
      return;
    }

    if (formData.review.length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      setLoading(true);

      // Upload photos first (if any)
      const uploadedPhotos = [];
      for (const photo of formData.photos) {
        if (photo.file) {
          // In a real app, you'd upload to cloud storage
          // For now, we'll simulate with a placeholder
          uploadedPhotos.push({
            url: photo.url,
            caption: photo.caption
          });
        }
      }

      const reviewData = {
        appointmentId: appointment._id,
        rating: formData.rating,
        title: formData.title.trim(),
        review: formData.review.trim(),
        stylist: formData.stylist,
        categories: formData.categories,
        photos: uploadedPhotos,
        isAnonymous: formData.isAnonymous
      };

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
      
      if (onSuccess) {
        onSuccess(data.review);
      }

      if (onClose) {
        onClose();
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, onRatingChange, hovered, onHover) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hovered || rating) ? 'filled' : ''}`}
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
          >
            <i className="fas fa-star"></i>
          </button>
        ))}
      </div>
    );
  };

  const renderCategoryRating = (category, label) => {
    const rating = formData.categories[category];
    const hovered = hoveredCategory === category ? hoveredCategory : 0;

    return (
      <div className="category-rating">
        <label>{label}</label>
        <div className="category-stars">
          {renderStars(
            rating || 0,
            (value) => handleCategoryChange(category, value),
            hovered,
            (value) => setHoveredCategory(value)
          )}
          {rating && <span className="rating-text">{rating}/5</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-modal">
        <div className="review-form-header">
          <h2><i className="fas fa-star"></i> Write a Review</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="review-form-content">
          {appointment && (
            <div className="appointment-info">
              <h3>Reviewing your appointment</h3>
              <div className="appointment-details">
                <p><strong>Service:</strong> {serviceNames[appointment.service]}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                {appointment.stylist && (
                  <p><strong>Stylist:</strong> {appointment.stylist}</p>
                )}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Overall Rating</h3>
              <div className="overall-rating">
                {renderStars(
                  formData.rating,
                  handleRatingClick,
                  hoveredRating,
                  setHoveredRating
                )}
                {formData.rating > 0 && (
                  <span className="rating-text">{formData.rating}/5</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Review Details</h3>
              <div className="form-group">
                <label htmlFor="title">Review Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Summarize your experience"
                  maxLength="100"
                  required
                />
                <span className="char-count">{formData.title.length}/100</span>
              </div>

              <div className="form-group">
                <label htmlFor="review">Your Review *</label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  placeholder="Share your experience with us..."
                  rows="6"
                  maxLength="1000"
                  required
                ></textarea>
                <span className="char-count">{formData.review.length}/1000</span>
              </div>

              <div className="form-group">
                <label htmlFor="stylist">Stylist (Optional)</label>
                <input
                  type="text"
                  id="stylist"
                  name="stylist"
                  value={formData.stylist}
                  onChange={handleChange}
                  placeholder="Who provided your service?"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Category Ratings (Optional)</h3>
              <div className="category-ratings">
                {Object.entries(categoryLabels).map(([key, label]) => 
                  renderCategoryRating(key, label)
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Photos (Optional)</h3>
              <div className="photo-upload">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photos" className="upload-button">
                  <i className="fas fa-camera"></i>
                  Add Photos
                </label>
                <p className="upload-hint">Upload photos of your experience (max 5 photos)</p>
              </div>

              {formData.photos.length > 0 && (
                <div className="photo-gallery">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo.url} alt={`Review photo ${index + 1}`} />
                      <input
                        type="text"
                        placeholder="Add caption (optional)"
                        value={photo.caption}
                        onChange={(e) => updatePhotoCaption(index, e.target.value)}
                        maxLength="100"
                      />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removePhoto(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-section">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Post review anonymously
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm; 