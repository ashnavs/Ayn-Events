// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  console.log(response);
  return response;
};

const authService = {
  login,
};

export default authService;

