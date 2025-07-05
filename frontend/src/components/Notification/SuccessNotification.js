import React, { useEffect } from 'react';

const SuccessNotification = ({ message, onClose, show }) => {
  useEffect(() => {
    if (show) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="notification-overlay">
      <div className="success-notification">
        <div className="notification-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="notification-content">
          <h3>Success!</h3>
          <p>{message}</p>
        </div>
        <button className="notification-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="notification-progress"></div>
      </div>
    </div>
  );
};

export default SuccessNotification; 