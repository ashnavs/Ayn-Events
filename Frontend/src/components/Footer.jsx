// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#C09783] text-black py-4 p-8 h-2/3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          COPYRIGHT © 2023 AYN EVENTS
        </div>
        <div className="text-lg font-serif">
          <span className="px-4 py-2 border rounded-full">
            {/* Replace with actual logo */}
            <span className="text-2xl">Fx</span>
          </span>
        </div>
        <div className="text-sm">
          MADE BY ASHNA
        </div>
      </div>
    </footer>
  );
};

export default Footer;
