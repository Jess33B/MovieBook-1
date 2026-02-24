import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User';
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-welcome">
          <div className="user-info">
            <h1>Welcome back, {user.fullName || user.username}!</h1>
            <div className="user-role">{getRoleDisplay(user.role)}</div>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">5</div>
          <div className="stat-label">Movies Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Your Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">4.8</div>
          <div className="stat-label">Avg Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">$48</div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>

      <div className="dashboard-header">
        <h2>Quick Actions</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/movies')}
          style={{ flex: 1 }}
        >
          Browse Movies
        </button>
        {user.role === 'ADMIN' && (
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin')}
            style={{ flex: 1 }}
          >
            Admin Panel
          </button>
        )}
      </div>

      <div className="dashboard-header">
        <h2>Account Information</h2>
      </div>
      
      <div className="dashboard-header">
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <strong>User ID:</strong> {user.userId}
          </div>
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Full Name:</strong> {user.fullName || 'Not provided'}
          </div>
          <div>
            <strong>Role:</strong> {getRoleDisplay(user.role)}
          </div>
          <div>
            <strong>Account Status:</strong> <span style={{ color: 'var(--success-green)' }}>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
