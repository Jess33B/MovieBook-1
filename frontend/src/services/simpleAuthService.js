import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const simpleAuthService = {
  // Simple login
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        usernameOrEmail: username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Simple registration
  register: async (username, email, password, fullName, phoneNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
        fullName,
        phoneNumber
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Simple logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Simple token validation
  validateToken: async () => {
    try {
      const token = simpleAuthService.getToken();
      if (!token) return false;
      
      const response = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      simpleAuthService.logout();
      return false;
    }
  }
};

export default simpleAuthService;
