import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Simple search filter
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookMovie = (movie) => {
    navigate(`/booking/${movie.movieId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#d4af37', marginBottom: '10px', fontWeight: '800' }}>
          CINEMA EXPERIENCE
        </h1>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem' }}>
          Book tickets for the latest blockbuster movies
        </p>
      </div>
      
      {/* Simple Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <input
          type="text"
          placeholder="Search movies by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            border: '2px solid #333333',
            borderRadius: '10px',
            outline: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      {/* Movies Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {filteredMovies.map(movie => (
          <div key={movie.movieId} style={{ 
            background: 'rgba(26, 26, 26, 0.95)', 
            borderRadius: '15px', 
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Movie Poster */}
            <div style={{ height: '350px', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
              {movie.posterUrl ? (
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem; color: #d4af37;">
                        🎬
                      </div>
                    `;
                  }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', color: '#d4af37' }}>
                  🎬
                </div>
              )}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#d4af37',
                color: '#000000',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 10
              }}>
                NEW
              </div>
            </div>
            
            {/* Movie Info */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#d4af37', fontWeight: '600' }}>{movie.title}</h3>
              <p style={{ color: '#a0a0a0', marginBottom: '15px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {movie.description}
              </p>
              
              {/* Movie Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem' }}>
                <span style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  {movie.genre}
                </span>
                <span style={{ color: '#d4af37' }}>
                  ⭐ {movie.rating}
                </span>
                <span style={{ color: '#d4af37', fontWeight: 'bold' }}>
                  ₹{movie.price}
                </span>
              </div>
              
              {/* Book Button */}
              <button 
                onClick={() => handleBookMovie(movie)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #d4af37, #f4e4bc)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                }}
              >
                Book Tickets
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredMovies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>No movies found</h2>
          <p style={{ color: '#a0a0a0' }}>No movies matching "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d4af37, #f4e4bc)',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '15px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;
