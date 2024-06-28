// src/HeroBanner.js
import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: `url('https://nypost.com/wp-content/uploads/sites/2/2023/05/shutterstock_372069916.jpg')` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="bg-white bg-opacity-75 rounded-lg p-4 flex flex-col md:flex-row items-center">
          <div className="flex items-center mb-4 md:mb-0 md:mr-4">
            <select className="form-select block w-full mt-1 rounded-md shadow-sm">
              <option>Select vendor Category</option>
              {/* Add your vendor categories here */}
            </select>
          </div>
          <div className="flex items-center mb-4 md:mb-0 md:mr-4">
            <select className="form-select block w-full mt-1 rounded-md shadow-sm">
              <option>Select city</option>
              {/* Add your cities here */}
            </select>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm">
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
