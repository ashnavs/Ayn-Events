import { height } from '@fortawesome/free-brands-svg-icons/fa42Group';
import React from 'react';
import { FiStar } from 'react-icons/fi';

const VendorLogo = () => {
  return (
    
    <div className="bg-[#ffffff]  p-4 flex flex-col items-center" style={{ height: '464px' }}>
      <div className=" w-full max-w-6xl rounded-lg  mt-8">
        <div className="relative h-72 rounded-t-lg overflow-hidden"> {/* Increased height for better layout */}
          <img
            src="https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg" // Replace with the actual image URL
            alt="Vendor"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
            <span className="text-red-500 text-2xl font-bold">Logo</span>
          </div> */}
        </div>

        <div className="relative p-5 bg-[#F0ECE3] transform translate-y-[-50%] mx-4 rounded-lg shadow-md"> {/* Adjusted the overlay container and moved it lower */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Vendor Name</h2>
              <p>123 Main Street</p>
              <p>Anytown, ND 12345</p>
              <p>+91 987 65 43210</p>
            </div>
            <div className="flex items-center">
              <FiStar className="text-yellow-500" />
              <span className="ml-1 text-xl font-semibold">4.7</span>
              <span className="ml-2 text-gray-600">25 Reviews</span>
            </div>
          </div>
          <div className="mt-4 flex justify-around">
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Booking Details</button>
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Create Post</button>
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogo;
