import axios from 'axios';
import Cookies from 'js-cookie';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors (e.g., token expiration, network errors)
    if (error.response && error.response.status === 401) {
      nav
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;