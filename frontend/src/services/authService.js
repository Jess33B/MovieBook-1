import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const authService = {
  login: async (usernameOrEmail, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        usernameOrEmail,
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

  register: async (username, email, password, fullName, phoneNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
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

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  validateToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) return false;
      
      const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      authService.logout();
      return false;
    }
  },

  getAuthHeaders: () => {
    const token = authService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default authService;
