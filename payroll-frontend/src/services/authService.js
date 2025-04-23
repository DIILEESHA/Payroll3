// src/services/authService.js
import api from './api';

const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

const logout = async () => {
  try {
    await api.get('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export default {
  login,
  register,
  logout
};