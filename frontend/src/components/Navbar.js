import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">MB</div>
          MovieBook
        </Link>
        
        <nav className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/movies" className="nav-link">
                Movies
              </Link>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Sign Up
              </Link>
              <Link to="/admin-login" className="nav-link">
                Admin Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
