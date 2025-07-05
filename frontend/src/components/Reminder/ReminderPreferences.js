import React, { useState, useEffect } from 'react';

const ReminderPreferences = ({ onClose }) => {
  const [preferences, setPreferences] = useState({
    emailReminders: true,
    smsReminders: true,
    reminderTiming: {
      email: 24,
      sms: 2
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/reminders/preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setMessage('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimingChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      reminderTiming: {
        ...prev.reminderTiming,
        [type]: parseInt(value)
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:5001/api/reminders/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        setMessage('Preferences saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="reminder-preferences-overlay">
        <div className="reminder-preferences-modal">
          <div className="loading">Loading preferences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reminder-preferences-overlay">
      <div className="reminder-preferences-modal">
        <div className="preferences-header">
          <h2><i className="fas fa-bell"></i> Reminder Preferences</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="preferences-content">
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="preferences-section">
            <h3>Notification Types</h3>
            
            <div className="preference-item">
              <div className="preference-info">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={preferences.emailReminders}
                    onChange={(e) => handleChange('emailReminders', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <div className="preference-details">
                    <strong>Email Reminders</strong>
                    <p>Receive appointment reminders via email</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={preferences.smsReminders}
                    onChange={(e) => handleChange('smsReminders', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <div className="preference-details">
                    <strong>SMS Reminders</strong>
                    <p>Receive appointment reminders via text message</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="preferences-section">
            <h3>Reminder Timing</h3>
            
            <div className="timing-options">
              <div className="timing-option">
                <label>
                  <strong>Email Reminders</strong>
                  <select
                    value={preferences.reminderTiming.email}
                    onChange={(e) => handleTimingChange('email', e.target.value)}
                    disabled={!preferences.emailReminders}
                  >
                    <option value={1}>1 hour before</option>
                    <option value={2}>2 hours before</option>
                    <option value={6}>6 hours before</option>
                    <option value={12}>12 hours before</option>
                    <option value={24}>24 hours before</option>
                    <option value={48}>48 hours before</option>
                  </select>
                </label>
              </div>

              <div className="timing-option">
                <label>
                  <strong>SMS Reminders</strong>
                  <select
                    value={preferences.reminderTiming.sms}
                    onChange={(e) => handleTimingChange('sms', e.target.value)}
                    disabled={!preferences.smsReminders}
                  >
                    <option value={1}>1 hour before</option>
                    <option value={2}>2 hours before</option>
                    <option value={4}>4 hours before</option>
                    <option value={6}>6 hours before</option>
                    <option value={12}>12 hours before</option>
                    <option value={24}>24 hours before</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="preferences-section">
            <h3>Information</h3>
            <div className="info-content">
              <ul>
                <li>Reminders are automatically sent for all your upcoming appointments</li>
                <li>You can cancel reminders for specific appointments from your appointment list</li>
                <li>Email reminders include detailed appointment information</li>
                <li>SMS reminders are brief and include essential details</li>
                <li>Changes to preferences apply to future appointments only</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="preferences-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPreferences; 