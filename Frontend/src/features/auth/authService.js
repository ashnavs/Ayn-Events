// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const API_URL_Admin = 'http://localhost:5000/api/admin';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  console.log(response);
  return response;
};

const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL_Admin}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response ? error.response.data : new Error('Server Error');
  }
};

const authService = {
  login,
  adminLogin
};

export default authService;

