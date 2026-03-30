import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // States for My Activity
  const [bookings, setBookings] = useState([]);
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [showActivity, setShowActivity] = useState(false);
  
  // States for Wallet
  const [showWallet, setShowWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddMoneyPopup, setShowAddMoneyPopup] = useState(false);
  const [showAddPaymentPopup, setShowAddPaymentPopup] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    upiId: ''
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch bookings
      const bookingsResponse = await axios.get(`http://localhost:8080/api/bookings/user/${user.id}`);
      setBookings(bookingsResponse.data);
      
      // Fetch bookmarked movies
      const bookmarksResponse = await axios.get(`http://localhost:8080/api/bookmarks/user/${user.id}`);
      setBookmarkedMovies(bookmarksResponse.data);
      
      // Fetch wallet data
      const walletResponse = await axios.get(`http://localhost:8080/api/wallet/user/${user.id}`);
      setWalletBalance(walletResponse.data.balance || 0);
      
      // Fetch payment methods
      const paymentResponse = await axios.get(`http://localhost:8080/api/payment-methods/user/${user.id}`);
      setPaymentMethods(paymentResponse.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addMoneyAmount || addMoneyAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      // Redirect to payment (simulation)
      alert(`Redirecting to payment gateway for ₹${addMoneyAmount}`);
      // In real implementation, integrate with payment gateway here
      
      // For demo, just add money to wallet
      const response = await axios.post(`http://localhost:8080/api/wallet/add-money`, {
        userId: user.id,
        amount: parseFloat(addMoneyAmount)
      });
      
      setWalletBalance(response.data.balance);
      setAddMoneyAmount('');
      setShowAddMoneyPopup(false);
      alert('Money added to wallet successfully!');
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money to wallet');
    }
  };

  const handleAddPaymentMethod = async () => {
    if (newPaymentMethod.type === 'card') {
      if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiryDate || !newPaymentMethod.holderName) {
        alert('Please fill all card details');
        return;
      }
    } else {
      if (!newPaymentMethod.upiId) {
        alert('Please enter UPI ID');
        return;
      }
    }
    
    try {
      const response = await axios.post(`http://localhost:8080/api/payment-methods/add`, {
        userId: user.id,
        ...newPaymentMethod
      });
      
      setPaymentMethods([...paymentMethods, response.data]);
      setNewPaymentMethod({
        type: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        holderName: '',
        upiId: ''
      });
      setShowAddPaymentPopup(false);
      alert('Payment method added successfully!');
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method');
    }
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
      <div className="profile-container">
        <div className="profile-header">
          <h1>Please Login</h1>
          <p>You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="user-info">
          <span className="welcome-text">Welcome, {user.username}!</span>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="floating-buttons">
        <button 
          className="floating-btn activity-btn"
          onClick={() => {
            setShowActivity(!showActivity);
            setShowWallet(false);
          }}
        >
          My Activity
        </button>
        <button 
          className="floating-btn wallet-btn"
          onClick={() => {
            setShowWallet(!showWallet);
            setShowActivity(false);
          }}
        >
          My Wallet
        </button>
      </div>

      {/* My Activity Section */}
      {showActivity && (
        <div className="activity-section">
          <div className="activity-row">
            <h3>My Booked Tickets</h3>
            {loading ? (
              <div className="loading">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="no-data">No bookings found</div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <img 
                      src={booking.posterUrl} 
                      alt={booking.movieTitle}
                      className="booking-poster"
                    />
                    <div className="booking-info">
                      <h4>{booking.movieTitle}</h4>
                      <p>Theater: {booking.theater}</p>
                      <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                      <p>Time: {booking.showTime}</p>
                      <p>Seats: {booking.seats.join(', ')}</p>
                      <span className={`booking-status ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="activity-row">
            <h3>Bookmarked Movies</h3>
            {loading ? (
              <div className="loading">Loading bookmarks...</div>
            ) : bookmarkedMovies.length === 0 ? (
              <div className="no-data">No bookmarked movies found</div>
            ) : (
              <div className="movies-grid">
                {bookmarkedMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="movie-info">
                      <h4>{movie.title}</h4>
                      <p>{movie.genre}</p>
                      <p>⭐ {movie.rating}</p>
                      <p>₹{movie.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallet Section */}
      {showWallet && (
        <div className="wallet-section">
          <div className="wallet-header">
            <h3>My Wallet</h3>
            <div className="wallet-balance">
              <span className="balance-label">Current Balance:</span>
              <span className="balance-amount">₹{walletBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="wallet-actions">
            <button 
              className="wallet-action-btn add-money-btn"
              onClick={() => setShowAddMoneyPopup(true)}
            >
              Add Money
            </button>
            <button 
              className="wallet-action-btn add-payment-btn"
              onClick={() => setShowAddPaymentPopup(true)}
            >
              Add Card/UPI
            </button>
          </div>

          {/* Payment Methods */}
          {paymentMethods.length > 0 && (
            <div className="payment-methods">
              <h4>Saved Payment Methods</h4>
              <div className="payment-cards">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="payment-card">
                    {method.type === 'card' ? (
                      <div className="card-info">
                        <div className="card-type">Credit/Debit Card</div>
                        <div className="card-number">**** **** **** {method.cardNumber?.slice(-4)}</div>
                        <div className="card-holder">{method.holderName}</div>
                      </div>
                    ) : (
                      <div className="upi-info">
                        <div className="upi-type">UPI</div>
                        <div className="upi-id">{method.upiId}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Money Popup */}
      {showAddMoneyPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add Money to Wallet</h3>
            <div className="form-group">
              <label>Enter Amount (₹):</label>
              <input 
                type="number"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <div className="popup-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddMoney}
              >
                Add Money
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddMoneyPopup(false);
                  setAddMoneyAmount('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Popup */}
      {showAddPaymentPopup && (
        <div className="popup-overlay">
          <div className="popup payment-popup">
            <h3>Add Payment Method</h3>
            
            <div className="payment-type-selector">
              <label>
                <input 
                  type="radio"
                  value="card"
                  checked={newPaymentMethod.type === 'card'}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value})}
                />
                Credit/Debit Card
              </label>
              <label>
                <input 
                  type="radio"
                  value="upi"
                  checked={newPaymentMethod.type === 'upi'}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value})}
                />
                UPI
              </label>
            </div>

            {newPaymentMethod.type === 'card' ? (
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number:</label>
                  <input 
                    type="text"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date:</label>
                  <input 
                    type="text"
                    value={newPaymentMethod.expiryDate}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className="form-group">
                  <label>CVV:</label>
                  <input 
                    type="text"
                    value={newPaymentMethod.cvv}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvv: e.target.value})}
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
                <div className="form-group">
                  <label>Card Holder Name:</label>
                  <input 
                    type="text"
                    value={newPaymentMethod.holderName}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, holderName: e.target.value})}
                    placeholder={user?.fullName || user?.username || "Your Name"}
                  />
                </div>
              </div>
            ) : (
              <div className="upi-form">
                <div className="form-group">
                  <label>UPI ID:</label>
                  <input 
                    type="text"
                    value={newPaymentMethod.upiId}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, upiId: e.target.value})}
                    placeholder="yourname@upi"
                  />
                </div>
              </div>
            )}

            <div className="popup-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddPaymentMethod}
              >
                Save
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddPaymentPopup(false);
                  setNewPaymentMethod({
                    type: 'card',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    holderName: '',
                    upiId: ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
