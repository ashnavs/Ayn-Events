import React, { useEffect, useState } from 'react';
import { fetchCities, fetchServices } from '../services/cityService';
import axiosInstanceUser from '../services/axiosInstanceUser';

const HeroBanner = ({ setVendors }) => {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch cities and services when the component mounts
    const getCities = async () => {
      try {
        const citiesData = await fetchCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    const getServices = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    getCities();
    getServices();
  }, []);

  const handleFilter = async () => {
    try {
      // Fetch vendors based on selected filters
      const response = await axiosInstanceUser.get('/vendors', {
        params: { service: category, city }
      });
      setVendors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error filtering vendors:', error);
    }
  };

  return (
    <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: `url('https://nypost.com/wp-content/uploads/sites/2/2023/05/shutterstock_372069916.jpg')` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-black">
        <div className="bg-white bg-opacity-75 rounded-lg p-4 flex flex-col md:flex-row items-center">
          <div className="flex items-center mb-4 md:mb-0 md:mr-4">
            <select
              className="form-select block w-full mt-1 rounded-md shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select vendor Category</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-4 md:mb-0 md:mr-4">
            <select
              className="form-select block w-full mt-1 rounded-md shadow-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="bg-[#a39f74] text-white px-4 py-2 rounded-md shadow-sm"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
