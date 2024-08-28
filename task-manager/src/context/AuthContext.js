import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Store the JWT token in localStorage
      setUser(user); // Update the user state
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout'); // Assuming the server requires logout POST
      localStorage.removeItem('token'); // Remove the JWT token from localStorage
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/auth/current_user', {
            headers: { Authorization: `Bearer ${token}` } // Include JWT token in request
          });
          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch current user', error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
