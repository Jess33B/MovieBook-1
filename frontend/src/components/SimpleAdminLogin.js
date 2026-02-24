import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import simpleAuthService from '../services/simpleAuthService';

const SimpleAdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await simpleAuthService.login(formData.username, formData.password);
      
      // Check if user is admin
      if (userData.role === 'ADMIN') {
        navigate('/analytics');
      } else {
        setError('Access denied. Admin credentials required.');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
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
      background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
    }}>
      <div style={{
        width: '400px',
        padding: '30px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#dc3545',
            borderRadius: '50%',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            👤
          </div>
          <h2 style={{ margin: '0', color: '#333' }}>Admin Login</h2>
        </div>
        
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Enter administrator credentials to access admin panel.
        </p>
        
        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Admin Username
            </label>
            <input
              type="text"
              name="username"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Admin Password
            </label>
            <input
              type="password"
              name="password"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Admin Login'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
              Default Admin Credentials:
            </p>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#dc3545' }}>
              Username: <span style={{ fontFamily: 'monospace' }}>admin</span><br/>
              Password: <span style={{ fontFamily: 'monospace' }}>123</span>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/simple-login" style={{ color: '#007bff', textDecoration: 'none' }}>
              ← Back to User Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;
