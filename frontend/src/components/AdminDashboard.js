import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalReviews: 0
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [usersRes, bookingsRes, reviewsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/users'),
        axios.get('http://localhost:8080/api/admin/bookings'),
        axios.get('http://localhost:8080/api/admin/reviews')
      ]);

      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setReviews(reviewsRes.data);

      setStats({
        totalUsers: usersRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalRevenue: bookingsRes.data.reduce((sum, b) => sum + (b.totalCost || 0), 0),
        totalReviews: reviewsRes.data.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-badge">Administrator</div>
      </div>

      {/* Admin Stats Grid */}
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Total Users</h3>
          <div className="metric-value">{stats.totalUsers}</div>
          <div className="metric-label">Registered Users</div>
        </div>
        <div className="admin-card">
          <h3>Total Bookings</h3>
          <div className="metric-value">{stats.totalBookings}</div>
          <div className="metric-label">Movie Tickets Sold</div>
        </div>
        <div className="admin-card">
          <h3>Total Revenue</h3>
          <div className="metric-value">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="metric-label">Revenue Generated</div>
        </div>
        <div className="admin-card">
          <h3>Total Reviews</h3>
          <div className="metric-value">{stats.totalReviews}</div>
          <div className="metric-label">User Reviews</div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Recent Users</h3>
          <div className="recent-list">
            {users.slice(-5).reverse().map((user) => (
              <div key={user.id} className="recent-item">
                <span className="item-name">{user.fullName || user.username}</span>
                <span className="item-role">{user.role}</span>
                <span className="item-date">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>Recent Bookings</h3>
          <div className="recent-list">
            {bookings.slice(-5).reverse().map((booking) => (
              <div key={booking.id} className="recent-item">
                <span className="item-name">{booking.movieTitle}</span>
                <span className="item-role">User {booking.userId}</span>
                <span className="item-date">
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>Recent Reviews</h3>
          <div className="recent-list">
            {reviews.slice(-5).reverse().map((review) => (
              <div key={review.id} className="recent-item">
                <span className="item-name">
                  {review.comment.substring(0, 30)}...
                </span>
                <span className="item-role">{review.sentiment}</span>
                <span className="item-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
