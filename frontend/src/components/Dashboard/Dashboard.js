import React, { useState } from 'react';
import AppointmentForm from '../Appointment';

const Dashboard = () => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const salonImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      alt: 'Salon Interior',
      title: 'Elegant Interior'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      alt: 'Hair Styling',
      title: 'Professional Hair Styling'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      alt: 'Beauty Services',
      title: 'Beauty & Wellness'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      alt: 'Salon Equipment',
      title: 'Modern Equipment'
    }
  ];

  const salonServices = [
    {
      name: 'Hair Cutting & Styling',
      description: 'Professional haircuts, styling, and hair treatments',
      price: 'Starting from ₹500'
    },
    {
      name: 'Hair Coloring',
      description: 'Expert hair coloring, highlights, and treatments',
      price: 'Starting from ₹1500'
    },
    {
      name: 'Facial & Skin Care',
      description: 'Rejuvenating facials and skin care treatments',
      price: 'Starting from ₹800'
    },
    {
      name: 'Manicure & Pedicure',
      description: 'Relaxing nail care and grooming services',
      price: 'Starting from ₹600'
    }
  ];

  const salonDetails = {
    name: 'Durga Salon',
    tagline: 'Where Beauty Meets Excellence',
    description: 'Welcome to Durga Salon, your premier destination for beauty and wellness. We offer a comprehensive range of professional beauty services in a luxurious and relaxing environment.',
    address: '123 Beauty Street, Fashion District, City - 123456',
    phone: '+91 98765 43210',
    email: 'info@durgasalon.com',
    hours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM'
    },
    features: [
      'Professional Stylists',
      'Premium Products',
      'Hygienic Environment',
      'Modern Equipment',
      'Comfortable Seating',
      'Free Consultation'
    ]
  };

  const handleBookAppointment = () => {
    setShowAppointmentForm(true);
  };

  const handleCloseAppointmentForm = () => {
    setShowAppointmentForm(false);
  };

  const handleAppointmentSuccess = (appointmentData) => {
    // You can add success notification here
    console.log('Appointment booked successfully:', appointmentData);
    setShowAppointmentForm(false);
  };

  return (
    <div className="dashboard-container">
      {showAppointmentForm && (
        <AppointmentForm
          onClose={handleCloseAppointmentForm}
          onSuccess={handleAppointmentSuccess}
        />
      )}
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="salon-name">{salonDetails.name}</h1>
          <p className="salon-tagline">{salonDetails.tagline}</p>
          <p className="salon-description">{salonDetails.description}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleBookAppointment}>Book Appointment</button>
            <button className="btn-secondary">View Services</button>
          </div>
        </div>
      </section>

      {/* Salon Images Gallery */}
      <section className="gallery-section">
        <h2>Our Salon</h2>
        <div className="image-gallery">
          {salonImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.src} alt={image.alt} />
              <div className="image-overlay">
                <h3>{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {salonServices.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className="fas fa-spa"></i>
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="service-price">{service.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Salon Details Section */}
      <section className="details-section">
        <div className="details-grid">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{salonDetails.address}</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>{salonDetails.phone}</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>{salonDetails.email}</span>
            </div>
          </div>

          <div className="working-hours">
            <h3>Working Hours</h3>
            <div className="hours-list">
              {Object.entries(salonDetails.hours).map(([day, hours]) => (
                <div key={day} className="hours-item">
                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  <span className="time">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="features-list">
            <h3>Why Choose Us</h3>
            <ul>
              {salonDetails.features.map((feature, index) => (
                <li key={index}>
                  <i className="fas fa-check"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Look?</h2>
          <p>Book your appointment today and experience the difference!</p>
          <button className="btn-primary" onClick={handleBookAppointment}>Book Now</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 