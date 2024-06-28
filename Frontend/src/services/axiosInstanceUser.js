// import axios from 'axios';
// import Cookies from 'js-cookie';


// const axiosInstanceUser = axios.create({
//   baseURL: 'http://localhost:5000/api/users', // Replace with your backend URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add the auth token to headers
// axiosInstanceUser.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle responses and errors globally
// axiosInstanceUser.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors (e.g., token expiration, network errors)
//     if (error.response && error.response.status === 401) {
//       nav
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstanceUser;


import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstanceUser = axios.create({
  baseURL: 'http://localhost:5000/api/users', 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstanceUser.interceptors.request.use(
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
axiosInstanceUser.interceptors.response.use(
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

export default axiosInstanceUser;
