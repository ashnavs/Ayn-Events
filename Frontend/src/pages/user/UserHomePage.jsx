
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import HeroBanner from '../../components/HeroBanner';
import VendorCategory from '../../components/VendorCategory';
import VendorsFound from '../../components/VendorsFound';
import Footer from '../../components/Footer';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UserHomePage() {
  const user = useSelector((state) => state.auth.user);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAllVendors = async () => {
      try {
        const response = await axiosInstanceUser.get('/vendors');
        console.log("API Response:", response.data);
        const vendors = response.data;
        setVendors(vendors);

        // Extract unique services from vendors
        const allServices = vendors.flatMap(vendor => vendor.services.map(service => service.name));
        const uniqueServices = [...new Set(allServices)];

        // Create categories with image URLs
        const categories = uniqueServices.map(serviceName => {
          const service = vendors.flatMap(vendor => vendor.services).find(service => service.name === serviceName);
          return {
            name: serviceName,
            imageUrl: service ? service.imageUrl : '' 
          };
        });

        setCategories(categories);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchAllVendors();
  }, []);

  useEffect(() => {
    console.log('vendors:', vendors);
  }, [vendors]);

  useEffect(() => {
    console.log('matchingServices:', categories);
  }, [categories]);



  const handleSetVendors = (vendorData) => {
    setVendors(vendorData);
  

    const uniqueServices = [
      ...new Set(vendorData.flatMap(vendor => vendor.services ? vendor.services.flatMap(service => service.name) : []))
    ];
  

    const filteredCategories = uniqueServices.map(serviceName => {
      const category = categories.find(category => category.name === serviceName);
      return {
        name: serviceName,
        imageUrl: category ? category.imageUrl : ''
      };
    });
  
    setCategories(filteredCategories);
  };
  return (
    <div>
      <Header />
      <HeroBanner setVendors={handleSetVendors} />
      <VendorCategory categories={categories} />
      <VendorsFound vendors={vendors} />
      <Footer />
    </div>
  );
}

export default UserHomePage;

