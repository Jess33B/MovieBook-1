import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState('');
  const [language, setLanguage] = useState('EN');
  const [parking, setParking] = useState(false);
  const [food, setFood] = useState([]);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [userLocation, setUserLocation] = useState('');
  const [nearbyTheaters, setNearbyTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const theaters = [
    { id: 1, name: 'PVR Cinemas - Phoenix Marketcity', distance: '2.3 km' },
    { id: 2, name: 'INOX - City Pride', distance: '3.1 km' },
    { id: 3, name: 'Cinepolis - Seasons Mall', distance: '4.5 km' },
    { id: 4, name: 'PVR - Koregaon Park', distance: '5.2 km' },
    { id: 5, name: 'INOX - Amanora', distance: '6.8 km' }
  ];

  const handleLocationSubmit = () => {
    if (userLocation.trim()) {
      setNearbyTheaters(theaters);
    }
  };

  const theaterLayouts = {
    1: { rows: 8, seatsPerRow: [8, 10, 12, 12, 12, 10, 8, 6] },
    2: { rows: 7, seatsPerRow: [10, 12, 14, 14, 12, 10, 8] },
    3: { rows: 9, seatsPerRow: [6, 8, 10, 12, 12, 10, 8, 6, 4] },
    4: { rows: 6, seatsPerRow: [12, 14, 16, 16, 14, 12] },
    5: { rows: 8, seatsPerRow: [8, 10, 12, 12, 12, 10, 8, 6] }
  };

  const currentLayout = selectedTheater ? theaterLayouts[selectedTheater] : theaterLayouts[1];

  const generateSeats = () => {
    const seats = [];
    const bookedSeats = ['A3', 'A4', 'B5', 'B6', 'C7', 'C8', 'D9', 'D10'];
    
    for (let row = 0; row < currentLayout.rows; row++) {
      for (let seat = 0; seat < currentLayout.seatsPerRow[row]; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seats.push({
          id: seatId,
          row: String.fromCharCode(65 + row),
          number: seat + 1,
          isBooked: bookedSeats.includes(seatId),
          isAvailable: !bookedSeats.includes(seatId)
        });
      }
    }
    return seats;
  };

  const [seats, setSeats] = useState([]);

  useEffect(() => {
    setSeats(generateSeats());
  }, [selectedTheater]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);
    
    if (seatIndex > -1) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else if (selectedSeats.length < numberOfPeople) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    let total = movie ? movie.price * selectedSeats.length : 0;
    food.forEach(item => {
      total += item.price;
    });
    if (parking) total += 50;
    return total;
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert(language === 'EN' ? 'Please select seats' : 'कृपया सीटें चुनें');
      return;
    }

    const bookingData = {
      movieId: movie.movieId,
      seats: selectedSeats,
      showTime,
      food,
      parking,
      total: calculateTotal()
    };

    console.log('Booking data:', bookingData);
    alert(language === 'EN' ? 'Booking confirmed!' : 'बुकिंग की पुष्टि!');
    navigate('/dashboard');
  };

  const foodOptions = [
    { id: 1, name: language === 'EN' ? 'Popcorn' : 'पॉपकॉर्न', price: 150 },
    { id: 2, name: language === 'EN' ? 'Soda' : 'सोडा', price: 80 },
    { id: 3, name: language === 'EN' ? 'Nachos' : 'नाचोस', price: 120 },
    { id: 4, name: language === 'EN' ? 'Candy' : 'कैंडी', price: 60 }
  ];

  if (!movie) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1 className="booking-title">
          {language === 'EN' ? 'Book Tickets' : 'टिकट बुक करें'}
        </h1>
        <div className="language-toggle">
          <button 
            className={`lang-btn ${language === 'EN' ? 'active' : ''}`}
            onClick={() => setLanguage('EN')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${language === 'HI' ? 'active' : ''}`}
            onClick={() => setLanguage('HI')}
          >
            हिंदी
          </button>
        </div>
      </div>

      {!selectedTheater && (
        <div className="location-section">
          <h2>{language === 'EN' ? 'Select Your Location' : 'अपना स्थान चुनें'}</h2>
          <div className="location-input-group">
            <input
              type="text"
              placeholder={language === 'EN' ? 'Enter your location...' : 'अपना स्थान दर्ज करें...'}
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="location-input"
            />
            <button onClick={handleLocationSubmit} className="location-btn">
              {language === 'EN' ? 'Find Theaters' : 'थिएटर खोजें'}
            </button>
          </div>
          
          {nearbyTheaters.length > 0 && (
            <div className="theaters-list">
              <h3>{language === 'EN' ? 'Nearby Theaters' : 'नजदीकी थिएटर'}</h3>
              {nearbyTheaters.map(theater => (
                <div key={theater.id} className="theater-card">
                  <div className="theater-info">
                    <h4>{theater.name}</h4>
                    <span className="distance">{theater.distance}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTheater(theater.id)}
                    className="select-theater-btn"
                  >
                    {language === 'EN' ? 'Select' : 'चुनें'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTheater && (
        <>
          <div className="movie-info">
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
            <div className="movie-details">
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
              <div className="movie-meta">
                <span>{movie.genre}</span>
                <span>{movie.durationMinutes} min</span>
                <span>⭐ {movie.rating}</span>
              </div>
            </div>
          </div>

          <div className="people-selection">
            <h3>{language === 'EN' ? 'Number of People' : 'लोगों की संख्या'}</h3>
            <div className="people-buttons">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setNumberOfPeople(num);
                    setSelectedSeats([]);
                  }}
                  className={`people-btn ${numberOfPeople === num ? 'active' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="showtime-section">
            <h3>{language === 'EN' ? 'Select Show Time' : 'शो समय चुनें'}</h3>
            <div className="showtimes">
              {['10:00 AM', '1:30 PM', '4:30 PM', '7:30 PM', '10:30 PM'].map(time => (
                <button
                  key={time}
                  onClick={() => setShowTime(time)}
                  className={`showtime-btn ${showTime === time ? 'active' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="seat-selection">
            <h3>{language === 'EN' ? 'Select Seats' : 'सीटें चुनें'}</h3>
            <div className="seat-legend">
              <span className="legend-item">
                <div className="seat available"></div> {language === 'EN' ? 'Available' : 'उपलब्ध'}
              </span>
              <span className="legend-item">
                <div className="seat selected"></div> {language === 'EN' ? 'Selected' : 'चयनित'}
              </span>
              <span className="legend-item">
                <div className="seat booked"></div> {language === 'EN' ? 'Booked' : 'बुक'}
              </span>
            </div>
            
            <div className="theater-screen">
              <div className="screen">{language === 'EN' ? 'SCREEN' : 'स्क्रीन'}</div>
            </div>
            
            <div className="seat-map">
              {Array.from({ length: currentLayout.rows }, (_, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>
                  {seats
                    .filter(seat => seat.row === String.fromCharCode(65 + rowIndex))
                    .map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        className={`seat ${seat.isBooked ? 'booked' : ''} ${
                          selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''
                        }`}
                        disabled={seat.isBooked}
                      >
                        {seat.number}
                      </button>
                    ))}
                  <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="food-section">
            <h3>{language === 'EN' ? 'Add Food & Drinks' : 'खाना और पेय पदार्थ जोड़ें'}</h3>
            <div className="food-options">
              {foodOptions.map(item => (
                <label key={item.id} className="food-item">
                  <input
                    type="checkbox"
                    checked={food.some(f => f.id === item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFood([...food, item]);
                      } else {
                        setFood(food.filter(f => f.id !== item.id));
                      }
                    }}
                  />
                  <span>{item.name} - ₹{item.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="parking-section">
            <label className="parking-option">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
              />
              <span>{language === 'EN' ? 'Add Parking' : 'पार्किंग जोड़ें'}</span>
            </label>
          </div>

          <div className="booking-summary">
            <h3>{language === 'EN' ? 'Booking Summary' : 'बुकिंग सारांश'}</h3>
            <div className="summary-item">
              <span>{language === 'EN' ? 'Movie' : 'फिल्म'}:</span>
              <span>{movie.title}</span>
            </div>
            <div className="summary-item">
              <span>{language === 'EN' ? 'Theater' : 'थिएटर'}:</span>
              <span>{nearbyTheaters.find(t => t.id === parseInt(selectedTheater))?.name}</span>
            </div>
            <div className="summary-item">
              <span>{language === 'EN' ? 'Show Time' : 'शो समय'}:</span>
              <span>{showTime}</span>
            </div>
            <div className="summary-item">
              <span>{language === 'EN' ? 'Seats' : 'सीटें'}:</span>
              <span>{selectedSeats.map(s => s.id).join(', ')}</span>
            </div>
            <div className="summary-item">
              <span>{language === 'EN' ? 'Tickets' : 'टिकट'}:</span>
              <span>₹{movie.price} × {selectedSeats.length}</span>
            </div>
            {food.length > 0 && (
              <div className="summary-item">
                <span>{language === 'EN' ? 'Food' : 'खाना'}:</span>
                <span>₹{food.reduce((sum, item) => sum + item.price, 0)}</span>
              </div>
            )}
            {parking && (
              <div className="summary-item">
                <span>{language === 'EN' ? 'Parking' : 'पार्किंग'}:</span>
                <span>₹50</span>
              </div>
            )}
            <div className="summary-total">
              <span>{language === 'EN' ? 'Total' : 'कुल'}:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="booking-actions">
            <button 
              onClick={() => setSelectedTheater('')}
              className="back-btn"
            >
              {language === 'EN' ? 'Change Theater' : 'थिएटर बदलें'}
            </button>
            <button 
              onClick={handleBooking}
              className="book-btn"
              disabled={!showTime || selectedSeats.length === 0}
            >
              {language === 'EN' ? 'Confirm Booking' : 'बुकिंग की पुष्टि करें'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;
