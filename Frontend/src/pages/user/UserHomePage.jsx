// import React, { useEffect, useState } from 'react';
// import Header from '../../components/Header';
// import HeroBanner from '../../components/HeroBanner';
// import VendorCategory from '../../components/VendorCategory';
// import VendorsFound from '../../components/VendorsFound';
// import Footer from '../../components/Footer';
// import axiosInstanceUser from '../../services/axiosInstanceUser';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// function UserHomePage() {
//   const user = useSelector((state) => state.auth.user);
//   const [vendors, setVendors] = useState([]);
//   const [categories, setCategories] = useState([]);

 
//   // useEffect(() => { 
//   //   const fetchAllVendors = async () => {
//   //     try {
//   //       const response = await axiosInstanceUser.get('/vendors');
//   //       console.log(response)
//   //       const { vendors, matchingServices } = response.data;
//   //       console.log(matchingServices)
//   //       setVendors(vendors);
//   //       setCategories(matchingServices)
//   //       console.log("vendor:",vendors)
//   //       console.log("matchingServices:",categories)
        
       
//   //     } catch (error) {
//   //       console.error('Error fetching vendors:', error);
//   //     }
//   //   };

//   //   fetchAllVendors();
//   // }, []);

//   useEffect(() => {
//     const fetchAllVendors = async () => {
//       try {
//         const response = await axiosInstanceUser.get('/vendors'); // Replace with your API endpoint
//         console.log(response);
//         const { vendors, matchingServices } = response.data;
//         setVendors(vendors);
//         setCategories(matchingServices);
//       } catch (error) {
//         console.error('Error fetching vendors:', error);
//       }
//     };

//     fetchAllVendors();
//   }, []);

//   useEffect(() => {
//     console.log("vendors:", vendors);
//   }, [vendors]);

//   useEffect(() => {
//     console.log("matchingServices:", categories);
//   }, [categories]);

//   const handleSetVendors = (vendorData) => {
//     setVendors(vendorData);

//     // Flatten arrays of services and ensure unique categories
//     const filteredCategories = [
//       ...new Set(
//         vendorData.flatMap(vendor => vendor.service)
//       )
//     ];
//     setCategories(filteredCategories);
//   };

//   return (
//     <div>
//       <Header />
//       <HeroBanner setVendors={handleSetVendors} />
//       <VendorCategory categories={categories} />
//       <VendorsFound vendors={vendors} />
//       <Footer />
//     </div>
//   );
// }

// export default UserHomePage;


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
        console.log(response);
        const { vendors, matchingServices } = response.data;
        setVendors(vendors);
        // Ensure matchingServices is an array of objects with 'name' and 'imageUrl' fields
        setCategories(matchingServices.map(service => ({ name: service.name, imageUrl: service.imageUrl })));
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

    // Extract and flatten unique services
    const uniqueServices = [...new Set(vendorData.flatMap(vendor => vendor.service))];
    
    // Map the unique services to their corresponding categories
    const filteredCategories = uniqueServices.map(service => {
      const category = categories.find(category => category.name === service);
      return {
        name: service,
        imageUrl: category ? category.imageUrl : ''  // Set to an empty string or a default image if not found
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

