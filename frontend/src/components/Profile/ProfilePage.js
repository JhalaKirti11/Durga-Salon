import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, onClose, isOpen }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchUserProfile();
    }
  }, [isOpen, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        setEditMode(false);
        // Show success message
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || ''
    });
    setEditMode(false);
  };

  const renderOverviewTab = () => (
    <div className="profile-overview">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <h2>{userProfile?.name || 'User Name'}</h2>
          <p className="user-email">{userProfile?.email}</p>
          <p className="member-since">Member since {new Date(userProfile?.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => setEditMode(true)}
          >
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{userProfile?.appointmentCount || 0}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{userProfile?.reviewCount || 0}</h3>
            <p>Reviews Written</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{userProfile?.pendingAppointments || 0}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <span>{userProfile?.name || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <label>Email Address</label>
            <span>{userProfile?.email || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <label>Phone Number</label>
            <span>{userProfile?.phone || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <label>Address</label>
            <span>{userProfile?.address || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditTab = () => (
    <div className="profile-edit">
      <div className="edit-header">
        <h3>Edit Profile Information</h3>
        <p>Update your personal information and preferences</p>
      </div>

      <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            rows="3"
          ></textarea>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            onClick={handleSaveProfile}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="profile-settings">
      <h3>Account Settings</h3>
      
      <div className="settings-section">
        <h4>Notification Preferences</h4>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            Email Notifications
          </label>
          <p>Receive email updates about appointments and promotions</p>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            SMS Reminders
          </label>
          <p>Get SMS reminders for upcoming appointments</p>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            Push Notifications
          </label>
          <p>Receive push notifications on your device</p>
        </div>
      </div>

      <div className="settings-section">
        <h4>Privacy Settings</h4>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            Show Profile in Reviews
          </label>
          <p>Display your name in public reviews</p>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            Allow Marketing Communications
          </label>
          <p>Receive promotional emails and offers</p>
        </div>
      </div>

      <div className="settings-section">
        <h4>Account Actions</h4>
        <button className="btn-danger">
          <i className="fas fa-trash"></i>
          Delete Account
        </button>
        <p className="warning-text">This action cannot be undone. All your data will be permanently deleted.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      );
    }

    if (editMode) {
      return renderEditTab();
    }

    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Profile Page Overlay */}
      <div className="profile-overlay" onClick={onClose}></div>

      {/* Profile Page Modal */}
      <div className="profile-page">
        {/* Header */}
        <div className="profile-page-header">
          <div className="header-left">
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
            <h1>My Profile</h1>
          </div>
          <div className="header-right">
            {!editMode && (
              <button 
                className="edit-profile-btn"
                onClick={() => setEditMode(true)}
              >
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        {!editMode && (
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-user"></i>
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 