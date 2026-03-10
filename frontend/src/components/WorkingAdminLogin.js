import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkingAdminLogin = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        usernameOrEmail: username,
        password: password
      });

      if (response.data.token) {
        // Store in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Force redirect to analytics
        window.location.href = '/analytics';
      } else {
        setError('No token received');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)'
    }}>
      <div style={{
        width: '400px',
        padding: '40px',
        background: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#d4af37', fontSize: '2rem', fontWeight: '800' }}>
          Admin Login
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#a0a0a0' }}>
          Enter your admin credentials to access the admin panel.
        </p>
        
        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: 'rgba(229, 9, 20, 0.1)',
            color: '#e50914',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#d4af37' }}>
              Username
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #333333',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                transition: 'all 0.3s ease'
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              onFocus={(e) => {
                e.target.style.borderColor = '#d4af37';
                e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333333';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#d4af37' }}>
              Password
            </label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #333333',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                transition: 'all 0.3s ease'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              onFocus={(e) => {
                e.target.style.borderColor = '#d4af37';
                e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333333';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #d4af37, #f4e4bc)',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}
              disabled={loading}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px', 
            paddingTop: '20px', 
            borderTop: '1px solid rgba(212, 175, 55, 0.2)' 
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#a0a0a0' }}>
              Test Credentials:
            </p>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#d4af37' }}>
              Username: <span style={{ fontFamily: 'monospace', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>admin</span><br/>
              Password: <span style={{ fontFamily: 'monospace', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>123</span>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/simple-login" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }}>
              ← Back to User Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default WorkingAdminLogin;
