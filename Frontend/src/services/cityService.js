// src/services/cityService.js
import axios from 'axios';
import axiosInstanceVendor from './axiosInstanceVenndor';

const API_URL = 'https://countriesnow.space/api/v0.1/countries/cities';

export const fetchCities = async () => {
  try {
    const response = await axios.post(API_URL, {
      country: 'India'
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/vendor/service-types');
    console.log(response,"❤️");
    return response.data;  // Assuming response.data contains the service names array
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw new Error('Failed to fetch services');
  }
};

export default { fetchCities, fetchServices };
