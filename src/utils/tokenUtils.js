/**
 * Token utility functions for handling JWT tokens
 */

export const clearExpiredToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decode JWT to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // If token is expired, remove it
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expired, clearing from localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear axios authorization header
      delete require('axios').defaults.headers.common['Authorization'];
      return true; // Token was expired and cleared
    }
    
    return false; // Token is still valid
  } catch (error) {
    // If token is malformed, remove it
    console.log('Malformed token, clearing from localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete require('axios').defaults.headers.common['Authorization'];
    return true; // Token was malformed and cleared
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp && payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};
