import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateField, sanitizeInput, sanitizeSQL, isValidGmail, gmailValidation, isValidPhone, checkPasswordStrength } from '../utils/validation';

const SimpleRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'weak', score: 0, message: '' });

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(sanitizeSQL(value));
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    // Check password strength when password changes
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(sanitizedValue));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate each field
    const usernameValidation = validateField('username', formData.username);
    if (!usernameValidation.valid) newErrors.username = usernameValidation.message;
    
    // Validate email using Gmail validation
    if (!isValidGmail(formData.email)) {
      newErrors.email = 'Please enter a valid Gmail address (username@gmail.com)';
    }
    
    const passwordValidation = validateField('password', formData.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.message;
    
    const fullNameValidation = validateField('fullName', formData.fullName);
    if (!fullNameValidation.valid) newErrors.fullName = fullNameValidation.message;
    
    // Validate phone number (exactly 10 digits)
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter exactly 10 digits for phone number';
    }
    
    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(
        sanitizeSQL(formData.username), 
        sanitizeSQL(formData.email), 
        sanitizeSQL(formData.password), 
        sanitizeSQL(formData.fullName), 
        sanitizeSQL(formData.phoneNumber)
      );
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        width: '400px',
        padding: '30px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Sign Up
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Please fill this form to create an account.
        </p>
        
        {errors.general && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.fullName ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {errors.fullName}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.username ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
            {errors.username && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {errors.username}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email (Gmail only)
            </label>
            <input
              type="email"
              name="email"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.email}
              onChange={handleChange}
              placeholder="username@gmail.com"
            />
            {errors.email && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Phone Number (10 digits only)
            </label>
            <input
              type="tel"
              name="phoneNumber"
              maxLength="10"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.phoneNumber ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.phoneNumber}
              onChange={(e) => {
                // Only allow digits
                const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({
                  ...formData,
                  phoneNumber: digitsOnly
                });
              }}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phoneNumber && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {errors.phoneNumber}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            {errors.password && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {errors.password}
              </div>
            )}
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              style={{
                width: '100%',
                padding: '10px',
                border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account? <Link to="/simple-login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SimpleRegister;
