import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateField, sanitizeInput, sanitizeSQL, isValidGmail, gmailValidation } from '../utils/validation';

const AdminManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('movies');
  
  // Movie management state
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: '',
    durationMinutes: '',
    rating: '',
    price: '',
    posterUrl: '',
    trailer: '',
    cast: '',
    director: '',
    story: '',
    isActive: true
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieErrors, setMovieErrors] = useState({});
  
  // Show management state
  const [showForm, setShowForm] = useState({
    movieId: '',
    theater: '',
    screen: '',
    time: '',
    date: '',
    availableSeats: 0
  });
  const [editingShow, setEditingShow] = useState(null);
  const [showErrors, setShowErrors] = useState({});

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [moviesRes, showsRes, usersRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/movies'),
        axios.get('http://localhost:8080/api/admin/shows'),
        axios.get('http://localhost:8080/api/admin/users'),
        axios.get('http://localhost:8080/api/admin/bookings')
      ]);
      
      setMovies(moviesRes.data);
      setShows(showsRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  // Movie validation
  const validateMovieForm = () => {
    const errors = {};
    
    const titleValidation = validateField('movieTitle', movieForm.title);
    if (!titleValidation.valid) errors.title = titleValidation.message;
    
    const priceValidation = validateField('price', movieForm.price);
    if (!priceValidation.valid) errors.price = priceValidation.message;
    
    const durationValidation = validateField('duration', movieForm.durationMinutes);
    if (!durationValidation.valid) errors.duration = durationValidation.message;
    
    const ratingValidation = validateField('rating', movieForm.rating);
    if (!ratingValidation.valid) errors.rating = ratingValidation.message;
    
    setMovieErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Show validation
  const validateShowForm = () => {
    const errors = {};
    
    if (!showForm.movieId) errors.movieId = 'Movie is required';
    if (!showForm.theater) errors.theater = 'Theater is required';
    if (!showForm.screen) errors.screen = 'Screen is required';
    if (!showForm.time) errors.time = 'Time is required';
    if (!showForm.date) errors.date = 'Date is required';
    if (!showForm.availableSeats || showForm.availableSeats <= 0) errors.availableSeats = 'Available seats must be greater than 0';
    
    setShowErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Movie operations
  const handleAddMovie = async () => {
    if (!validateMovieForm()) return;
    
    try {
      // Check for duplicate movie
      const exists = movies.some(m => 
        m.title.toLowerCase() === movieForm.title.toLowerCase()
      );
      
      if (exists) {
        setMovieErrors({ title: 'Movie with this title already exists' });
        return;
      }

      const newMovie = {
        movieId: movies.length + 1,
        ...movieForm,
        cast: movieForm.cast.split(',').map(name => ({ name: name.trim(), role: 'Actor' })),
        durationMinutes: parseInt(movieForm.durationMinutes),
        rating: parseFloat(movieForm.rating),
        price: parseFloat(movieForm.price),
        isActive: movieForm.isActive
      };

      await axios.post('http://localhost:8080/api/admin/movies', newMovie);
      
      // Refresh movies list
      const response = await axios.get('http://localhost:8080/api/movies');
      setMovies(response.data);
      
      // Reset form
      setMovieForm({
        title: '',
        description: '',
        genre: '',
        durationMinutes: '',
        rating: '',
        price: '',
        posterUrl: '',
        trailer: '',
        cast: '',
        director: '',
        story: '',
        isActive: true
      });
      setMovieErrors({});
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie');
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      durationMinutes: movie.durationMinutes,
      rating: movie.rating,
      price: movie.price,
      posterUrl: movie.posterUrl,
      trailer: movie.trailer,
      cast: movie.cast.map(c => c.name).join(', '),
      director: movie.director,
      story: movie.story,
      isActive: movie.isActive
    });
  };

  const handleUpdateMovie = async () => {
    if (!validateMovieForm()) return;
    
    try {
      const updatedMovie = {
        ...movieForm,
        cast: movieForm.cast.split(',').map(name => ({ name: name.trim(), role: 'Actor' })),
        durationMinutes: parseInt(movieForm.durationMinutes),
        rating: parseFloat(movieForm.rating),
        price: parseFloat(movieForm.price)
      };

      await axios.put(`http://localhost:8080/api/admin/movies/${editingMovie.movieId}`, updatedMovie);
      
      // Refresh movies list
      const response = await axios.get('http://localhost:8080/api/movies');
      setMovies(response.data);
      
      setEditingMovie(null);
      setMovieErrors({});
      alert('Movie updated successfully!');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    // Check if movie has active bookings
    const movieBookings = bookings.filter(b => b.movieId === movieId && b.status === 'confirmed');
    
    if (movieBookings.length > 0) {
      alert('Cannot delete movie with active bookings');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/movies/${movieId}`);
      
      // Refresh movies list
      const response = await axios.get('http://localhost:8080/api/movies');
      setMovies(response.data);
      
      alert('Movie deleted successfully!');
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    }
  };

  // Show operations
  const handleAddShow = async () => {
    if (!validateShowForm()) return;
    
    try {
      const newShow = {
        id: shows.length + 1,
        ...showForm,
        availableSeats: parseInt(showForm.availableSeats)
      };

      await axios.post('http://localhost:8080/api/admin/shows', newShow);
      
      // Refresh shows list
      const response = await axios.get('http://localhost:8080/api/admin/shows');
      setShows(response.data);
      
      // Reset form
      setShowForm({
        movieId: '',
        theater: '',
        screen: '',
        time: '',
        date: '',
        availableSeats: 0
      });
      setShowErrors({});
      alert('Show added successfully!');
    } catch (error) {
      console.error('Error adding show:', error);
      alert('Failed to add show');
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/shows/${showId}`);
      
      // Refresh shows list
      const response = await axios.get('http://localhost:8080/api/admin/shows');
      setShows(response.data);
      
      alert('Show deleted successfully!');
    } catch (error) {
      console.error('Error deleting show:', error);
      alert('Failed to delete show');
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div><p>Loading Admin Panel...</p></div>;
  }

  return (
    <div className="admin-management">
      <div className="admin-header">
        <h1>Admin Management Panel</h1>
        <div className="admin-tabs">
          <button 
            className={activeTab === 'movies' ? 'active' : ''}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button 
            className={activeTab === 'shows' ? 'active' : ''}
            onClick={() => setActiveTab('shows')}
          >
            Shows
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>
      </div>

      {/* Movies Management */}
      {activeTab === 'movies' && (
        <div className="admin-section">
          <h2>Movies Management</h2>
          
          {/* Add/Edit Movie Form */}
          <div className="admin-form">
            <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
            
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={movieForm.title}
                onChange={(e) => setMovieForm({...movieForm, title: sanitizeInput(e.target.value)})}
                placeholder="Movie title"
              />
              {movieErrors.title && <div className="error">{movieErrors.title}</div>}
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={movieForm.description}
                onChange={(e) => setMovieForm({...movieForm, description: sanitizeInput(e.target.value)})}
                placeholder="Movie description"
              />
            </div>

            <div className="form-group">
              <label>Genre:</label>
              <input
                type="text"
                value={movieForm.genre}
                onChange={(e) => setMovieForm({...movieForm, genre: sanitizeInput(e.target.value)})}
                placeholder="Genre"
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes):</label>
              <input
                type="number"
                value={movieForm.durationMinutes}
                onChange={(e) => setMovieForm({...movieForm, durationMinutes: e.target.value})}
                placeholder="Duration in minutes"
              />
              {movieErrors.duration && <div className="error">{movieErrors.duration}</div>}
            </div>

            <div className="form-group">
              <label>Rating:</label>
              <input
                type="number"
                step="0.1"
                value={movieForm.rating}
                onChange={(e) => setMovieForm({...movieForm, rating: e.target.value})}
                placeholder="Rating (0-10)"
              />
              {movieErrors.rating && <div className="error">{movieErrors.rating}</div>}
            </div>

            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                value={movieForm.price}
                onChange={(e) => setMovieForm({...movieForm, price: e.target.value})}
                placeholder="Price in INR"
              />
              {movieErrors.price && <div className="error">{movieErrors.price}</div>}
            </div>

            <div className="form-group">
              <label>Cast (comma-separated):</label>
              <input
                type="text"
                value={movieForm.cast}
                onChange={(e) => setMovieForm({...movieForm, cast: e.target.value})}
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div className="form-group">
              <label>Director:</label>
              <input
                type="text"
                value={movieForm.director}
                onChange={(e) => setMovieForm({...movieForm, director: sanitizeInput(e.target.value)})}
                placeholder="Director name"
              />
            </div>

            <div className="form-group">
              <label>Trailer URL:</label>
              <input
                type="text"
                value={movieForm.trailer}
                onChange={(e) => setMovieForm({...movieForm, trailer: sanitizeInput(e.target.value)})}
                placeholder="YouTube embed URL"
              />
            </div>

            <div className="form-group">
              <label>Poster URL:</label>
              <input
                type="text"
                value={movieForm.posterUrl}
                onChange={(e) => setMovieForm({...movieForm, posterUrl: sanitizeInput(e.target.value)})}
                placeholder="Poster image URL"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={movieForm.isActive}
                  onChange={(e) => setMovieForm({...movieForm, isActive: e.target.checked})}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              {editingMovie ? (
                <>
                  <button onClick={handleUpdateMovie} className="btn btn-primary">Update Movie</button>
                  <button onClick={() => setEditingMovie(null)} className="btn btn-secondary">Cancel</button>
                </>
              ) : (
                <button onClick={handleAddMovie} className="btn btn-primary">Add Movie</button>
              )}
            </div>
          </div>

          {/* Movies List */}
          <div className="admin-list">
            <h3>Existing Movies</h3>
            {movies.map(movie => (
              <div key={movie.movieId} className="list-item">
                <div className="item-info">
                  <h4>{movie.title}</h4>
                  <p>Genre: {movie.genre} | Rating: {movie.rating} | Price: ₹{movie.price}</p>
                  <p>Status: {movie.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEditMovie(movie)} className="btn btn-small">Edit</button>
                  <button onClick={() => handleDeleteMovie(movie.movieId)} className="btn btn-small btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shows Management */}
      {activeTab === 'shows' && (
        <div className="admin-section">
          <h2>Shows Management</h2>
          
          {/* Add Show Form */}
          <div className="admin-form">
            <h3>Add New Show</h3>
            
            <div className="form-group">
              <label>Movie:</label>
              <select
                value={showForm.movieId}
                onChange={(e) => setShowForm({...showForm, movieId: e.target.value})}
              >
                <option value="">Select Movie</option>
                {movies.map(movie => (
                  <option key={movie.movieId} value={movie.movieId}>
                    {movie.title}
                  </option>
                ))}
              </select>
              {showErrors.movieId && <div className="error">{showErrors.movieId}</div>}
            </div>

            <div className="form-group">
              <label>Theater:</label>
              <input
                type="text"
                value={showForm.theater}
                onChange={(e) => setShowForm({...showForm, theater: sanitizeInput(e.target.value)})}
                placeholder="Theater name"
              />
              {showErrors.theater && <div className="error">{showErrors.theater}</div>}
            </div>

            <div className="form-group">
              <label>Screen:</label>
              <input
                type="text"
                value={showForm.screen}
                onChange={(e) => setShowForm({...showForm, screen: sanitizeInput(e.target.value)})}
                placeholder="Screen number"
              />
              {showErrors.screen && <div className="error">{showErrors.screen}</div>}
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={showForm.date}
                onChange={(e) => setShowForm({...showForm, date: e.target.value})}
              />
              {showErrors.date && <div className="error">{showErrors.date}</div>}
            </div>

            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={showForm.time}
                onChange={(e) => setShowForm({...showForm, time: e.target.value})}
              />
              {showErrors.time && <div className="error">{showErrors.time}</div>}
            </div>

            <div className="form-group">
              <label>Available Seats:</label>
              <input
                type="number"
                value={showForm.availableSeats}
                onChange={(e) => setShowForm({...showForm, availableSeats: e.target.value})}
                placeholder="Number of available seats"
              />
              {showErrors.availableSeats && <div className="error">{showErrors.availableSeats}</div>}
            </div>

            <div className="form-actions">
              <button onClick={handleAddShow} className="btn btn-primary">Add Show</button>
            </div>
          </div>

          {/* Shows List */}
          <div className="admin-list">
            <h3>Existing Shows</h3>
            {shows.map(show => (
              <div key={show.id} className="list-item">
                <div className="item-info">
                  <h4>{show.theater} - {show.screen}</h4>
                  <p>Movie: {movies.find(m => m.movieId == show.movieId)?.title}</p>
                  <p>{show.date} at {show.time}</p>
                  <p>Available Seats: {show.availableSeats}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleDeleteShow(show.id)} className="btn btn-small btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Users Management</h2>
          <div className="admin-list">
            {users.map(user => (
              <div key={user.id} className="list-item">
                <div className="item-info">
                  <h4>{user.fullName || user.username}</h4>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                  <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="admin-section">
          <h2>Bookings Management</h2>
          <div className="admin-list">
            {bookings.map(booking => (
              <div key={booking.id} className="list-item">
                <div className="item-info">
                  <h4>{booking.movieTitle}</h4>
                  <p>User: {booking.userName}</p>
                  <p>Theater: {booking.theater}</p>
                  <p>Date: {booking.date}</p>
                  <p>Time: {booking.showTime}</p>
                  <p>Seats: {booking.seats.join(', ')}</p>
                  <p>Total: ₹{booking.total}</p>
                  <p>Status: {booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
