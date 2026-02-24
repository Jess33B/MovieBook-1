import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ movieId, movieTitle, onReviewSubmit }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [sentiment, setSentiment] = useState({
    score: 0,
    label: 'neutral',
    emoji: '😐'
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/movie/${movieId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const analyzeSentiment = async (text) => {
    if (!text.trim()) return;
    
    setAnalyzing(true);
    try {
      // Simple sentiment analysis simulation
      const positiveWords = ['amazing', 'great', 'excellent', 'awesome', 'fantastic', 'wonderful', 'brilliant', 'outstanding', 'perfect', 'love', 'best', 'incredible'];
      const negativeWords = ['boring', 'terrible', 'awful', 'horrible', 'disappointing', 'worst', 'bad', 'poor', 'hate', 'disgusting', 'useless'];
      
      const words = text.toLowerCase().split(' ');
      let score = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
      });
      
      let sentimentType = 'neutral';
      if (score > 0) sentimentType = 'positive';
      else if (score < 0) sentimentType = 'negative';
      
      setSentiment({
        type: sentimentType,
        score: score,
        confidence: Math.min(Math.abs(score) * 0.2 + 0.6, 0.95)
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCommentChange = (e) => {
    const comment = e.target.value;
    setNewReview({ ...newReview, comment });
    
    // Analyze sentiment in real-time
    if (comment.length > 10) {
      analyzeSentiment(comment);
    } else {
      setSentiment({
        score: 0,
        label: 'neutral'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setSubmitting(true);
    try {
      const reviewData = {
        ...newReview,
        movieId,
        movieTitle,
        sentiment: sentiment?.label || 'neutral',
        sentimentScore: sentiment?.score || 0,
        date: new Date().toISOString()
      };

      await axios.post('http://localhost:8080/api/reviews', reviewData);
      
      // Update existing reviews
      setReviews([reviewData, ...reviews]);
      
      // Reset form
      setNewReview({ rating: 5, comment: '' });
      setSentiment({
        score: 0,
        label: 'neutral'
      });
      
      if (onReviewSubmit) {
        onReviewSubmit(reviewData);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentEmoji = (type) => {
    switch(type) {
      case 'positive': return 'Positive';
      case 'negative': return 'Negative';
      default: return 'Neutral';
    }
  };

  const getSentimentColor = (type) => {
    switch(type) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <div className="review-section">
      <div className="review-header">
        <h2>Reviews & Ratings</h2>
        <div className="review-stats">
          <span className="total-reviews">{reviews.length} Reviews</span>
          <span className="average-rating">
            {reviews.length > 0 
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'
            }
          </span>
        </div>
      </div>

      {/* Review Form */}
      <div className="review-form-container">
        <h3>Share Your Experience</h3>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= newReview.rating ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  {star <= newReview.rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="comment-input">
            <label>Your Review:</label>
            <textarea
              value={newReview.comment}
              onChange={handleCommentChange}
              placeholder="Share your thoughts about this movie..."
              rows="4"
              maxLength="500"
            />
            <div className="comment-footer">
              <span className="char-count">{newReview.comment.length}/500</span>
              <div className="sentiment-indicator">
                {analyzing && <span className="analyzing">Analyzing...</span>}
                {sentiment && !analyzing && (
                  <span className="sentiment-text" style={{ color: getSentimentColor(sentiment.label) }}>
                    {getSentimentEmoji(sentiment.label)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-review-btn"
            disabled={submitting || !newReview.comment.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Existing Reviews */}
      <div className="existing-reviews">
        <h3>User Reviews</h3>
        {reviews.length === 0 ? (
          <div className="no-reviews">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header-info">
                  <div className="reviewer-info">
                    <span className="reviewer-name">User {review.userId}</span>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`star ${star <= review.rating ? 'active' : ''}`}>
                          {star <= review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="review-sentiment">
                    <span className="sentiment-label" style={{ color: getSentimentColor(review.sentiment) }}>
                      {getSentimentEmoji(review.sentiment)}
                    </span>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-footer">
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
