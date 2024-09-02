import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstanceUser from '../services/axiosInstanceUser';

const VendorsFound = ({ vendors }) => {
  console.log(vendors)
  const [licenseLogos, setLicenseLogos] = useState({});
  const navigate = useNavigate();

  const fetchLicenseLogos = async (email) => {
    try {
      const response = await axiosInstanceUser.get(`/license/${email}`);
      console.log(response)
      setLicenseLogos((prevData) => ({
        ...prevData,
        [email]: response.data.logoUrl,
      }));
    } catch (err) {
      console.error('Failed to fetch license logo:', err);
    }
  };

  useEffect(() => {
    if (vendors.length > 0) {
      vendors.forEach((vendor) => {
        fetchLicenseLogos(vendor.email);
      });
    }
  }, [vendors]);

  const handleVendorClick = (id) => {
    navigate(`/vendorDetails/${id}`);
  };

  return (
    <div className="container mx-auto p-12">
      <h2 className="text-lg font-semibold mb-4">Found {vendors.length} results...</h2>
      <div className="grid grid-cols-4 gap-7">
        {vendors.map((vendor, index) => (
          <div
            onClick={() => handleVendorClick(vendor._id)}
            key={index}
            className="bg-white shadow rounded overflow-hidden cursor-pointer"
          >
            <img
              src={licenseLogos[vendor.email] || 'default-image-url'} 
              alt={vendor.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2 bg-gray-200 text-center">
              {vendor.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorsFound;


