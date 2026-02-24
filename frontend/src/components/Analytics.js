import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Analytics Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights into movie performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Bookings</h3>
          <div className="metric-value">{dashboardData?.totalBookings?.toLocaleString() || 0}</div>
          <div className="metric-label">Tickets Sold</div>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <div className="metric-value">₹{dashboardData?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="metric-label">Revenue Generated</div>
        </div>
        <div className="metric-card">
          <h3>Average Rating</h3>
          <div className="metric-value">{dashboardData?.averageRating?.toFixed(1) || 0}/5.0</div>
          <div className="metric-label">User Satisfaction</div>
        </div>
        <div className="metric-card">
          <h3>Total Reviews</h3>
          <div className="metric-value">{dashboardData?.totalReviews || 0}</div>
          <div className="metric-label">User Feedback</div>
        </div>
      </div>

      {/* Text Mining Section */}
      <div className="analytics-section">
        <h2>Text Mining Analytics</h2>
        
        <div className="movie-selector">
          <label>Select Movie for Analysis:</label>
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
            <option value={4}>Kumbalangi Nights</option>
            <option value={5}>Joseph</option>
          </select>
        </div>

        <div className="text-mining-grid">
          {/* Sentiment Analysis */}
          <div className="analytics-card">
            <h3>Sentiment Analysis</h3>
            <div className="sentiment-stats">
              <div className="sentiment-item positive">
                <span className="sentiment-label">Positive</span>
                <span className="sentiment-count">{sentimentData?.positive || 0}</span>
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-fill positive-fill" 
                    style={{width: `${(sentimentData?.positive / sentimentData?.total * 100) || 0}%`}}
                  ></div>
                </div>
              </div>
              <div className="sentiment-item negative">
                <span className="sentiment-label">Negative</span>
                <span className="sentiment-count">{sentimentData?.negative || 0}</span>
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-fill negative-fill" 
                    style={{width: `${(sentimentData?.negative / sentimentData?.total * 100) || 0}%`}}
                  ></div>
                </div>
              </div>
              <div className="sentiment-item mixed">
                <span className="sentiment-label">Mixed</span>
                <span className="sentiment-count">{sentimentData?.mixed || 0}</span>
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-fill mixed-fill" 
                    style={{width: `${(sentimentData?.mixed / sentimentData?.total * 100) || 0}%`}}
                  ></div>
                </div>
              </div>
            </div>
            <div className="average-sentiment">
              <strong>Average Sentiment Score:</strong> 
              <span className={`sentiment-score ${sentimentData?.averageSentiment > 0 ? 'positive' : sentimentData?.averageSentiment < 0 ? 'negative' : 'neutral'}`}>
                {sentimentData?.averageSentiment?.toFixed(2) || 0}
              </span>
            </div>
          </div>

          {/* Keywords Extraction */}
          <div className="analytics-card">
            <h3>Top Keywords from Reviews</h3>
            <div className="keywords-cloud">
              {Object.entries(keywords || {}).map(([keyword, count]) => (
                <span 
                  key={keyword} 
                  className="keyword-tag"
                  style={{fontSize: `${Math.min(count * 2 + 12, 24)}px`}}
                >
                  {keyword} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="analytics-section">
        <h2>Visual Analytics</h2>
        
        <div className="visual-analytics-grid">
          {/* Sales Chart */}
          <div className="analytics-card">
            <h3>Sales Trend</h3>
            <div className="chart-container">
              <div className="simple-chart">
                {salesData?.map((day, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{height: `${(day.tickets / Math.max(...salesData.map(d => d.tickets))) * 200}px`}}
                    >
                      <span className="chart-value">{day.tickets}</span>
                    </div>
                    <span className="chart-label">{day.date.split('-')[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Movies */}
          <div className="analytics-card">
            <h3>Top Performing Movies</h3>
            <div className="top-movies-list">
              {dashboardData?.topMovies?.slice(0, 5).map((movie, index) => (
                <div key={movie.id} className="top-movie-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="movie-title">{movie.title}</span>
                  <span className="movie-stats">{movie.bookings} bookings</span>
                  <span className="movie-revenue">₹{movie.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Future Lens Section */}
      <div className="analytics-section">
        <h2>Predictive Analytics</h2>
        
        <div className="predictions-grid">
          <div className="analytics-card">
            <h3>Demand Predictions</h3>
            <div className="prediction-item">
              <span className="prediction-label">Tomorrow's Expected Demand:</span>
              <span className="prediction-value">{predictions?.nextDayPrediction || 0} tickets</span>
            </div>
            <div className="prediction-item">
              <span className="prediction-label">Weekly Prediction:</span>
              <span className="prediction-value">{predictions?.weeklyPrediction || 0} tickets</span>
            </div>
            <div className="prediction-item">
              <span className="prediction-label">Monthly Prediction:</span>
              <span className="prediction-value">{predictions?.monthlyPrediction || 0} tickets</span>
            </div>
            <div className="prediction-trend">
              <strong>Trend:</strong>
              <span className={`trend-indicator ${predictions?.trend}`}>
                {predictions?.trend === 'increasing' ? 'Rising' : predictions?.trend === 'decreasing' ? 'Falling' : 'Stable'}
              </span>
            </div>
            <div className="confidence-score">
              <strong>Confidence Level:</strong>
              <span className="confidence-value">{predictions?.confidence ? (predictions.confidence * 100).toFixed(0) : 0}%</span>
            </div>
          </div>

<div className="analytics-card">
            <h3>Business Insights</h3>
            <div className="insights-list">
              <div className="insight-item">
                <span>Demand is {predictions?.trend === 'increasing' ? 'increasing' : 'stable'} - consider increasing show times</span>
              </div>
              <div className="insight-item">
                <span>Top performing movies should get more screen time</span>
              </div>
              <div className="insight-item">
                <span>Positive sentiment indicates high customer satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
