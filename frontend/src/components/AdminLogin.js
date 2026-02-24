import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple admin check - no complex logic
    if (credentials.username === 'admin' && credentials.password === '123') {
      // Create admin user
      const adminUser = {
        id: 0,
        username: 'admin',
        email: 'admin@moviebook.com',
        fullName: 'System Administrator',
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('token', 'admin-token-' + Date.now());
      
      // Navigate immediately
      navigate('/admin');
    } else {
      setError('Invalid credentials. Use admin/123');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Admin Portal</h1>
          <p>System Administrator Login</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="admin"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="123"
              className="form-input"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <a href="/login" style={{ color: 'var(--primary-gold)', textDecoration: 'none' }}>
              Back to User Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
