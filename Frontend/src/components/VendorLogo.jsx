import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { FiStar } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectVendor } from '../features/vendor/vendorSlice';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import CreatePostModal from './CreatePostModal';

const VendorLogo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const vendor = useSelector(selectVendor)

  const fetchVendor = async () => {
    setStatus('loading');
    try {
      const vendorResponse = await axiosInstanceVendor.get(`/${vendorId}`);
      console.log(vendorResponse.data); 
      setVendor(vendorResponse.data);
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch vendor:', err);
      setError(err.message);
      setStatus('failed');
    }
  };


  return (
    <div className="bg-[#ffffff] p-4 flex flex-col items-center" style={{ height: '464px' }}>
      <div className="w-full max-w-6xl rounded-lg mt-8">
        <div className="relative h-72 rounded-t-lg overflow-hidden">
          <img
            src="https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg" 
            alt="Vendor"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative p-5 bg-[#F0ECE3] transform translate-y-[-50%] mx-4 rounded-lg shadow-md">
          {vendor ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{vendor.vendor.name}</h2>
                  <p>{vendor.vendor.email}</p>
                  <p>{vendor.vendor.city  }</p>
                </div>
                <div className="flex items-center">
                  <FiStar className="text-yellow-500" />
                  <span className="ml-1 text-xl font-semibold">{vendor.rating || 25}</span>
                  <span className="ml-2 text-gray-600">{vendor.reviews} Reviews</span>
                </div>
              </div>
              <div className="mt-4 flex justify-around">
                <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Booking Details</button>
                <button
                  className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Post
                </button>
                <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Edit Profile</button>
              </div>
            </>
          ) : (
            <p>Loading vendor details...</p>
          )}
        </div>
      </div>
      <CreatePostModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default VendorLogo;
