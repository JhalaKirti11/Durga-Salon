import React, { useState, useEffect } from 'react';
import SuccessNotification from '../Notification/SuccessNotification';
import AppointmentConfirmationModal from './AppointmentConfirmationModal';

const AppointmentForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    stylist: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('showConfirmation changed:', showConfirmation);
    console.log('appointmentData changed:', appointmentData);
  }, [showConfirmation, appointmentData]);

  const services = [
    { id: 'haircut', name: 'Hair Cut & Styling', duration: 60, price: '₹500' },
    { id: 'haircolor', name: 'Hair Coloring', duration: 120, price: '₹1500' },
    { id: 'highlights', name: 'Highlights & Lowlights', duration: 150, price: '₹2000' },
    { id: 'facial', name: 'Facial & Skin Care', duration: 90, price: '₹800' },
    { id: 'manicure', name: 'Manicure', duration: 45, price: '₹600' },
    { id: 'pedicure', name: 'Pedicure', duration: 60, price: '₹700' },
    { id: 'manicure-pedicure', name: 'Manicure & Pedicure', duration: 90, price: '₹1200' },
    { id: 'hair-treatment', name: 'Hair Treatment', duration: 90, price: '₹1000' },
    { id: 'bridal', name: 'Bridal Package', duration: 240, price: '₹5000' }
  ];

  const stylists = [
    { id: 'priya', name: 'Priya Sharma', specialties: ['Hair Coloring', 'Styling'] },
    { id: 'meera', name: 'Meera Patel', specialties: ['Facial', 'Skin Care'] },
    { id: 'anjali', name: 'Anjali Singh', specialties: ['Hair Cut', 'Treatment'] },
    { id: 'kavita', name: 'Kavita Verma', specialties: ['Manicure', 'Pedicure'] },
    { id: 'any', name: 'Any Available Stylist', specialties: ['All Services'] }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Simulate API call
      const response = await fetch('http://localhost:5001/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to book appointment');
      }

      const data = await response.json();
      
      console.log('Appointment booking successful:', data);
      
      // Show success notification
      const appointmentDate = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setSuccessMessage(`Appointment booked successfully for ${appointmentDate} at ${formData.time}! We'll send you a confirmation email shortly.`);
      setShowSuccess(true);
      
      // Store appointment data and show confirmation modal
      const appointmentDataToShow = {
        ...formData,
        appointmentId: data.appointmentId || data._id || `APT-${Date.now()}`,
        ...data
      };
      
      console.log('Setting appointment data:', appointmentDataToShow);
      setAppointmentData(appointmentDataToShow);
      setShowConfirmation(true);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(data);
      }

    } catch (err) {
      console.error('Appointment booking error:', err);
      setError(err.message);
      
      // Fallback: Show confirmation modal even if backend fails (for testing)
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Showing confirmation modal as fallback');
        const fallbackData = {
          ...formData,
          appointmentId: `APT-${Date.now()}`,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };
        setAppointmentData(fallbackData);
        setShowConfirmation(true);
        setSuccessMessage('Appointment booked successfully! (Development mode)');
        setShowSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(service => service.id === formData.service);

  return (
    <>
      {/* <SuccessNotification
        message={successMessage}
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      /> */}
      <div className="appointment-overlay">
        <div className="appointment-modal">
        <div className="appointment-header">
          <h2>Book Your Appointment</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
      
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your 10-digit phone number"
                maxLength="10"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Service Details</h3>
            <div className="form-group">
              <label htmlFor="service">Select Service </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Choose a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price} ({service.duration} min)
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="service-details">
                <h4>Service Information</h4>
                <div className="service-info">
                  <p><strong>Service:</strong> {selectedService.name}</p>
                  <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
                  <p><strong>Price:</strong> {selectedService.price}</p>
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Appointment Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Preferred Date </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={getMinDate()}
                  max={getMaxDate()}
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Preferred Time </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stylist">Preferred Stylist</label>
              <select
                id="stylist"
                name="stylist"
                value={formData.stylist}
                onChange={handleChange}
              >
                <option value="">Any available stylist</option>
                {stylists.map(stylist => (
                  <option key={stylist.id} value={stylist.id}>
                    {stylist.name} - {stylist.specialties.join(', ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <label htmlFor="notes">Special Requests or Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requests, allergies, or additional information..."
                rows="4"
              ></textarea>
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
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    {/* Confirmation Modal - rendered outside appointment form */}
    {showConfirmation && appointmentData && (
      <AppointmentConfirmationModal
        appointment={appointmentData}
        onClose={() => {
          console.log('Closing confirmation modal');
          setShowConfirmation(false);
          if (onClose) {
            onClose();
          }
        }}
        onPrint={() => {
          window.print();
        }}
      />
    )}
    </>
  );
};

export default AppointmentForm; 