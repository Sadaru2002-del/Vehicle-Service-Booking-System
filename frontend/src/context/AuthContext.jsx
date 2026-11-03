import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fuchsius_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fuchsius_admin_token');
      const storedUser = localStorage.getItem('fuchsius_admin_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          await api.get('/auth/me');
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.success) {
      const { token, user } = response.data;
      localStorage.setItem('fuchsius_admin_token', token);
      localStorage.setItem('fuchsius_admin_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return response.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('fuchsius_admin_token');
    localStorage.removeItem('fuchsius_admin_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

