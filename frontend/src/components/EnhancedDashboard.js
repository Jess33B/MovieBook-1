import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateField, sanitizeInput, sanitizeSQL, isValidGmail, gmailValidation, isValidPhone } from '../utils/validation';

const EnhancedDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    bio: ''
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || ''
      });
      fetchUserBookings();
    }
  }, [user]);

  // Refresh bookings when component gains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchUserBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const userId = user?.id || 1;
      console.log('Fetching bookings for user:', userId);
      const response = await axios.get(`http://localhost:8080/api/bookings/user/${userId}`);
      console.log('Bookings received:', response.data);
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    const newErrors = {};
    
    // Validate full name using centralized validation
    const fullNameValidation = validateField('fullName', profileData.fullName);
    if (!fullNameValidation.valid) {
      newErrors.fullName = fullNameValidation.message;
    }

    // Validate email using Gmail validation
    if (!isValidGmail(profileData.email)) {
      newErrors.email = 'Please enter a valid Gmail address (username@gmail.com)';
    }

    // Validate phone number (exactly 10 digits)
    if (profileData.phoneNumber && !isValidPhone(profileData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter exactly 10 digits for phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      // Show validation errors
      const errorMessages = Object.values(newErrors).join('\n');
      alert(`Please fix the following errors:\n${errorMessages}`);
      return;
    }

    setSaving(true);
    try {
      // Sanitize all inputs before sending to backend
      const sanitizedData = {
        fullName: sanitizeSQL(sanitizeInput(profileData.fullName)),
        email: sanitizeSQL(sanitizeInput(profileData.email)),
        phoneNumber: sanitizeSQL(sanitizeInput(profileData.phoneNumber)),
        bio: sanitizeSQL(sanitizeInput(profileData.bio))
      };

      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      default: return '';
    }
  };

  if (!user) {
    return (
      <div className="enhanced-dashboard">
        <div className="admin-header">
          <h1>Please Login</h1>
          <p>You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard">
      <div className="admin-header">
        <h1>User Dashboard</h1>
        <div className="user-info">
          <span className="welcome-text">Welcome, {user.username}!</span>
          <span className="user-role-badge">{user.role}</span>
        </div>
      </div>

      <div className="admin-grid">
        {/* Profile Completion */}
        <div className="profile-completion">
          <h3>Complete Your Profile</h3>
          <div className="profile-form">
            <div className="form-group">
              <label>User ID:</label>
              <input type="text" value={user.id} disabled />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input type="text" value={user.username} disabled />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Full Name:</label>
              <input 
                type="text" 
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                placeholder={profileData.fullName || "Not provided"}
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input 
                type="tel" 
                name="phoneNumber"
                value={profileData.phoneNumber}
                maxLength="10"
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setProfileData({
                    ...profileData,
                    phoneNumber: digitsOnly
                  });
                }}
                placeholder="Enter 10-digit phone number"
              />
            </div>
            <button 
              className="save-profile-btn"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Account Status */}
        <div className="admin-card">
          <h3>Account Status</h3>
          <div className="status-info">
            <div className="status-item">
              <span className="status-label">Account Type:</span>
              <span className="status-value">{user.role}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Email:</span>
              <span className="status-value">{user.email}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Full Name:</span>
              <span className="status-value">
                {user.fullName || "Not provided"}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Account Status:</span>
              <span className="status-value status-active">Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">Member Since:</span>
              <span className="status-value">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Bookings */}
      <div className="current-bookings">
        <h3>Your Current Movie Bookings</h3>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't booked any movies yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/movies')}
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <img 
                  src={booking.posterUrl} 
                  alt={booking.movieTitle}
                  className="booking-poster"
                />
                <div className="booking-details">
                  <h4 className="booking-title">{booking.movieTitle}</h4>
                  <div className="booking-info">
                    <span>Theater: {booking.theater}</span>
                    <span>Time: {booking.showTime}</span>
                    <span>Date: {new Date(booking.date).toLocaleDateString()}</span>
                    <span>Seats: {booking.seats.join(', ')}</span>
                    <span>Price: ₹{booking.total}</span>
                  </div>
                  <span className={`booking-status ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/movies')}
            >
              Browse Movies
            </button>
            {user.role === 'ADMIN' && (
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/analytics')}
              >
                View Analytics
              </button>
            )}
            <button 
              className="btn btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="admin-card">
          <h3>Your Stats</h3>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">{bookings.length}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                ₹{bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0).toLocaleString()}
              </span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {bookings.filter(b => b.status === 'confirmed').length}
              </span>
              <span className="stat-label">Confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
