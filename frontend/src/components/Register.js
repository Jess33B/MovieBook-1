import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { isValidGmail, isValidPhone, checkPasswordStrength } from '../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'weak', score: 0, message: '' });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check password strength when password changes
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate Gmail
    if (!isValidGmail(formData.email)) {
      setError('Please enter a valid Gmail address (username@gmail.com)');
      return;
    }

    // Validate phone number (exactly 10 digits)
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      setError('Please enter exactly 10 digits for phone number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.phoneNumber
      );
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join MovieBook and start booking movies</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              minLength="3"
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email (Gmail only)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="username@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">
              Phone Number (10 digits only)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              maxLength="10"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({
                  ...formData,
                  phoneNumber: digitsOnly
                });
              }}
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
            />
            {formData.password && (
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span>Password Strength:</span>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: passwordStrength.strength === 'strong' ? '#28a745' : 
                           passwordStrength.strength === 'medium' ? '#ffc107' : '#dc3545'
                  }}>
                    {passwordStrength.strength.toUpperCase()}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '4px',
                  marginBottom: '4px'
                }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: level <= passwordStrength.score ? 
                          (passwordStrength.strength === 'strong' ? '#28a745' : 
                           passwordStrength.strength === 'medium' ? '#ffc107' : '#dc3545') : '#e9ecef',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
                <div style={{ color: '#6c757d', fontSize: '11px' }}>
                  {passwordStrength.message}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-24">
          Already have an account? <Link to="/login" className="nav-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
