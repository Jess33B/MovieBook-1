import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminOnlyAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'ADMIN') {
      navigate('/simple-admin-login');
      return;
    }
    fetchAnalyticsData();
  }, [user, navigate]);

  const fetchAnalyticsData = async () => {
    try {
      const [dashboardRes, sentimentRes, salesRes, predictionsRes, keywordsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/analytics/dashboard'),
        axios.get(`http://localhost:8080/api/analytics/sentiment/${selectedMovie}`),
        axios.get('http://localhost:8080/api/analytics/sales'),
        axios.get('http://localhost:8080/api/analytics/predictions'),
        axios.get(`http://localhost:8080/api/analytics/keywords/${selectedMovie}`)
      ]);

      setDashboardData(dashboardRes.data);
      setSentimentData(sentimentRes.data);
      setSalesData(salesRes.data);
      setPredictions(predictionsRes.data);
      setKeywords(keywordsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  const handleMovieChange = (movieId) => {
    setSelectedMovie(movieId);
    fetchMovieAnalytics(movieId);
  };

  const fetchMovieAnalytics = async (movieId) => {
    try {
      const [sentimentRes, keywordsRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/analytics/sentiment/${movieId}`),
        axios.get(`http://localhost:8080/api/analytics/keywords/${movieId}`)
      ]);

      setSentimentData(sentimentRes.data);
      setKeywords(keywordsRes.data);
    } catch (error) {
      console.error('Error fetching movie analytics:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '2rem', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>🔒 Loading Admin Analytics...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Admin Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'white', margin: '0 0 10px 0' }}>
            🔒 Admin Analytics Dashboard
          </h1>
          <p style={{ color: '#fff', margin: '0' }}>
            Welcome, {user?.fullName || user?.username} (Administrator)
          </p>
        </div>

        {/* Movie Selector */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h3>Select Movie for Analytics</h3>
          <select 
            value={selectedMovie} 
            onChange={(e) => handleMovieChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value={1}>The Matrix</option>
            <option value={2}>Inception</option>
            <option value={3}>The Dark Knight</option>
          </select>
        </div>

        {/* Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Sentiment Analysis */}
          {sentimentData && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>
                💭 Sentiment Analysis
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Positive:</strong> {sentimentData.positive || 0}%
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Neutral:</strong> {sentimentData.neutral || 0}%
              </div>
              <div>
                <strong>Negative:</strong> {sentimentData.negative || 0}%
              </div>
            </div>
          )}

          {/* Sales Data */}
          {salesData && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
                💰 Sales Data
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Total Revenue:</strong> ${salesData.totalRevenue || 0}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Total Bookings:</strong> {salesData.totalBookings || 0}
              </div>
              <div>
                <strong>Average Booking:</strong> ${salesData.averageBooking || 0}
              </div>
            </div>
          )}

          {/* Predictions */}
          {predictions && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
                📊 AI Predictions
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Next Month Revenue:</strong> ${predictions.nextMonthRevenue || 0}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Popular Genre:</strong> {predictions.popularGenre || 'N/A'}
              </div>
              <div>
                <strong>Growth Rate:</strong> {predictions.growthRate || 0}%
              </div>
            </div>
          )}

          {/* Keywords */}
          {keywords && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#6f42c1', marginBottom: '15px' }}>
                🏷️ Top Keywords
              </h3>
              <div>
                {keywords.topKeywords && keywords.topKeywords.map((keyword, index) => (
                  <span key={index} style={{
                    display: 'inline-block',
                    background: '#e9ecef',
                    padding: '5px 10px',
                    margin: '2px',
                    borderRadius: '15px',
                    fontSize: '12px'
                  }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminOnlyAnalytics;
