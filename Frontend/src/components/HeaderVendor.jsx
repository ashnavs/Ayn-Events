// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#C3C0A6] text-white py-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl font-serif">
          {/* Replace with actual logo */}
          <span className="px-4">Ayn Events</span>
        </div>
        <div className="flex space-x-4 text-sm">
          <span>SIGN IN</span>
          <span>0</span>
          <span className="relative">
            <span className="absolute right-0 top-0 h-2 w-2 bg-red-500 rounded-full"></span>
            <span className="text-2xl">♥</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
