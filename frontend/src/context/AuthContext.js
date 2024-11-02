import React, { createContext, useState, useEffect } from 'react';
import userApi from '../api/userApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = JSON.parse(sessionStorage.getItem('user'));

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setIsAuthenticated(true);
    } else if (savedToken) {
      fetchUserDetails(savedToken);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    console.log("FETCHING USER DETAILS")
    try {
      const userData = await userApi.getUserDetails(token);
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    }
  };

  const login = (token) => {
    sessionStorage.setItem('token', token);
    setToken(token);
    setIsAuthenticated(true);
    fetchUserDetails(token);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
