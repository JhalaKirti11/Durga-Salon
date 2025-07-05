import React from 'react';

const AppointmentConfirmationModal = ({ appointment, onClose, onPrint }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getServiceDetails = (serviceId) => {
    const services = {
      'haircut': { name: 'Hair Cut & Styling', price: '₹500', duration: '60 min' },
      'haircolor': { name: 'Hair Coloring', price: '₹1500', duration: '120 min' },
      'highlights': { name: 'Highlights & Lowlights', price: '₹2000', duration: '150 min' },
      'facial': { name: 'Facial & Skin Care', price: '₹800', duration: '90 min' },
      'manicure': { name: 'Manicure', price: '₹600', duration: '45 min' },
      'pedicure': { name: 'Pedicure', price: '₹700', duration: '60 min' },
      'manicure-pedicure': { name: 'Manicure & Pedicure', price: '₹1200', duration: '90 min' },
      'hair-treatment': { name: 'Hair Treatment', price: '₹1000', duration: '90 min' },
      'bridal': { name: 'Bridal Package', price: '₹5000', duration: '240 min' }
    };
    return services[serviceId] || { name: 'Service', price: '₹0', duration: '60 min' };
  };

  const getStylistName = (stylistId) => {
    const stylists = {
      'priya': 'Priya Sharma',
      'meera': 'Meera Patel',
      'anjali': 'Anjali Singh',
      'kavita': 'Kavita Verma',
      'any': 'Any Available Stylist'
    };
    return stylists[stylistId] || 'Any Available Stylist';
  };

  const serviceDetails = getServiceDetails(appointment.service);
  const stylistName = getStylistName(appointment.stylist);

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Appointment Confirmed!</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="confirmation-content">
          <div className="appointment-id">
            <h3>Appointment ID: <span>{appointment.appointmentId}</span></h3>
          </div>

          <div className="confirmation-sections">
            <div className="confirmation-section">
              <h4><i className="fas fa-calendar-alt"></i> Appointment Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(appointment.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Time:</span>
                  <span className="value">{formatTime(appointment.time)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">{serviceDetails.duration}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h4><i className="fas fa-user"></i> Personal Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{appointment.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{appointment.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{appointment.phone}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h4><i className="fas fa-cut"></i> Service Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Service:</span>
                  <span className="value">{serviceDetails.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Stylist:</span>
                  <span className="value">{stylistName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value price">{serviceDetails.price}</span>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className="confirmation-section">
                <h4><i className="fas fa-sticky-note"></i> Special Requests</h4>
                <div className="notes-content">
                  <p>{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="important-notes">
            <h4><i className="fas fa-info-circle"></i> Important Information</h4>
            <ul>
              <li>Please arrive 10 minutes before your appointment time</li>
              <li>Bring any relevant medical history or allergy information</li>
              <li>Payment will be collected at the salon</li>
              <li>24-hour cancellation notice is required</li>
              <li>We'll send you a reminder 24 hours before your appointment</li>
            </ul>
          </div>

          <div className="contact-info">
            <h4><i className="fas fa-phone"></i> Contact Information</h4>
            <div className="contact-details">
              <p><strong>Durga Salon</strong></p>
              <p><i className="fas fa-map-marker-alt"></i> 123 Beauty Street, City Center</p>
              <p><i className="fas fa-phone"></i> +91 98765 43210</p>
              <p><i className="fas fa-envelope"></i> info@durgasalon.com</p>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i> Close
          </button>
          <button className="btn-primary" onClick={onPrint}>
            <i className="fas fa-print"></i> Print Confirmation
          </button>
          <button className="btn-success" onClick={() => window.open('mailto:info@durgasalon.com?subject=Appointment Query')}>
            <i className="fas fa-envelope"></i> Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmationModal; 