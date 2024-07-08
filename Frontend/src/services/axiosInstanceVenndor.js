import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstanceVendor = axios.create({
    baseURL: 'http://localhost:5000/api/vendor',
    headers: {
      'Content-Type': 'application/json',
    },
  });


axiosInstanceVendor.interceptors.request.use(
  (config) => {
    const token = Cookies.get('tokenvendor');
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
axiosInstanceVendor.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors (e.g., token expiration, network errors)
    if (error.response && error.response.status === 401) {
      // Redirect or handle unauthorized access
      console.error('Unauthorized access:', error);
      // Example: redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceVendor;
