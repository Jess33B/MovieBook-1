import React, { createContext, useContext, useState, useEffect } from 'react';
import simpleAuthService from '../services/simpleAuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = simpleAuthService.getCurrentUser();
        if (currentUser) {
          const isValid = await simpleAuthService.validateToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            simpleAuthService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        simpleAuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const userData = await simpleAuthService.login(usernameOrEmail, password);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password, fullName, phoneNumber) => {
    try {
      const userData = await simpleAuthService.register(username, email, password, fullName, phoneNumber);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    simpleAuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
