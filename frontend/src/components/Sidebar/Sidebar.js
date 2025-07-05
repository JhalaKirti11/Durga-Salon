import React, { useState, useEffect } from 'react';
import { Reviews } from '../Review';

const Sidebar = ({ isOpen, onClose, user, onOpenProfile }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'reviews') {
      setShowReviews(true);
    } else {
      setShowReviews(false);
    }
    setShowReviewForm(false);
  };

  const handleWriteReview = () => {
    setShowReviewForm(true);
    setShowReviews(true);
    setActiveSection('reviews');
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    setShowReviewForm(false);
    setActiveSection('dashboard');
  };

  const handleProfileClick = () => {
    if (onOpenProfile) {
      onOpenProfile();
    }
    setActiveSection('profile');
  };

  const renderUserInfo = () => {
    if (!user) return null;

    return (
      <div className="sidebar-user-info">
        <div className="user-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="user-details">
          <h3>{user.name || 'User'}</h3>
          <p>{user.email}</p>
          {userProfile && (
            <div className="user-stats">
              <span className="stat">
                <i className="fas fa-calendar-check"></i>
                {userProfile.appointmentCount || 0} Appointments
              </span>
              <span className="stat">
                <i className="fas fa-star"></i>
                {userProfile.reviewCount || 0} Reviews
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    return (
      <nav className="sidebar-navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSectionChange('dashboard')}
            >
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </button>
          </li>
          
          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'appointments' ? 'active' : ''}`}
              onClick={() => handleSectionChange('appointments')}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>My Appointments</span>
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'reviews' ? 'active' : ''}`}
              onClick={() => handleSectionChange('reviews')}
            >
              <i className="fas fa-star"></i>
              <span>Reviews & Ratings</span>
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'reminders' ? 'active' : ''}`}
              onClick={() => handleSectionChange('reminders')}
            >
              <i className="fas fa-bell"></i>
              <span>Reminder Settings</span>
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={handleProfileClick}
            >
              <i className="fas fa-user"></i>
              <span>View Profile</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const renderQuickActions = () => {
    return (
      <div className="sidebar-quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => handleSectionChange('appointments')}
          >
            <i className="fas fa-plus"></i>
            Book Appointment
          </button>
          
          <button
            className="action-btn secondary"
            onClick={handleWriteReview}
          >
            <i className="fas fa-star"></i>
            Write Review
          </button>
          
          <button
            className="action-btn secondary"
            onClick={() => handleSectionChange('reminders')}
          >
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="sidebar-content">
            <h2>Welcome Back!</h2>
            <p>Manage your appointments, reviews, and preferences from here.</p>
            {renderQuickActions()}
          </div>
        );

      case 'appointments':
        return (
          <div className="sidebar-content">
            <h2>My Appointments</h2>
            <p>View and manage your upcoming appointments.</p>
            <div className="appointment-summary">
              <div className="summary-card">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Upcoming</h4>
                  <span>2 appointments</span>
                </div>
              </div>
              <div className="summary-card">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Completed</h4>
                  <span>15 appointments</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="sidebar-content reviews-section">
            <div className="reviews-header">
              <h2>Reviews & Ratings</h2>
              <button
                className="close-reviews-btn"
                onClick={handleCloseReviews}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {showReviews && (
              <Reviews
                showReviewForm={showReviewForm}
                appointmentForReview={null}
              />
            )}
          </div>
        );

      case 'reminders':
        return (
          <div className="sidebar-content">
            <h2>Reminder Settings</h2>
            <p>Configure your appointment reminders and notifications.</p>
            <div className="reminder-settings">
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Email Reminders
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  SMS Reminders
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  Push Notifications
                </label>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="sidebar-content">
            <h2>My Profile</h2>
            {userProfile ? (
              <div className="profile-details">
                <div className="profile-section">
                  <h4>Personal Information</h4>
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{userProfile.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{userProfile.phone || 'Not provided'}</span>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h4>Account Statistics</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <i className="fas fa-calendar-check"></i>
                      <div>
                        <span className="stat-number">{userProfile.appointmentCount || 0}</span>
                        <span className="stat-label">Appointments</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-star"></i>
                      <div>
                        <span className="stat-number">{userProfile.reviewCount || 0}</span>
                        <span className="stat-label">Reviews</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-clock"></i>
                      <div>
                        <span className="stat-number">{userProfile.pendingAppointments || 0}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading profile information...</p>
            )}
          </div>
        );

      default:
        return (
          <div className="sidebar-content">
            <h2>Dashboard</h2>
            <p>Select an option from the menu to get started.</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-cut"></i>
            <span>Durga Salon</span>
          </div>
          <button className="close-sidebar-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* User Info */}
        {renderUserInfo()}

        {/* Navigation */}
        {renderNavigation()}

        {/* Content Area */}
        <div className="sidebar-content-area">
          {renderContent()}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 