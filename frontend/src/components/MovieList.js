import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = [...new Set(movies.map(movie => movie.genre))];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleBookMovie = (movie) => {
    navigate(`/booking/${movie.movieId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            🎬 CINEMA EXPERIENCE
          </h1>
          <p className="hero-subtitle">
            Book tickets for the latest blockbuster movies
          </p>
        </div>
        
        <div className="search-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
            
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="form-input filter-select"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ color: 'var(--text-secondary)' }}>
              No movies found
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <div key={movie.movieId} className="movie-card">
                <div className="movie-poster" onClick={() => handleBookMovie(movie)}>
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} />
                  ) : (
                    <span style={{ fontSize: '4rem' }}>🎬</span>
                  )}
                  <div className="movie-badge">
                    NEW
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-description">{movie.description}</p>
                  <div className="movie-meta">
                    <span className="movie-genre">{movie.genre}</span>
                    <span className="movie-rating">⭐ {movie.rating}</span>
                    <span className="movie-price">₹{movie.price}</span>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleBookMovie(movie)}
                  >
                    🎫 Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
