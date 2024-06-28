// src/components/Header.jsx
import React from 'react';
import { FiBell, FiMessageSquare } from 'react-icons/fi';

const VendorHeader = () => {
  return (
    <header className="bg-[#CBC8AF] h-16 flex justify-between items-center px-4">
      <div className="flex items-center">
        <span className="text-white font-serif text-4xl font-thin">
          AYN <span className="font-sans text-xs">EVENTS</span>
        </span>
      </div>
      <nav className="flex items-center">
        <a href="/" className="text-white mr-4 hover:text-gray-200 flex items-center">
          <span className="ml-2">Home</span>
        </a>
        <div className="relative mr-4">
          <button className="focus:outline-none">
            <FiBell className="h-6 w-6 text-white" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>
        </div>
        <button className="focus:outline-none">
          <FiMessageSquare className="h-6 w-6 text-white" />
        </button>
      </nav>
    </header>
  );
};

export default VendorHeader;
