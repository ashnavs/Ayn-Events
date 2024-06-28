// src/components/VendorList.js
import React from 'react';

const vendors = Array(8).fill({
  name: 'Vendor 1',
  image: 'https://wallpapercrafter.com/sizes/2048x1152/14052-hands-wedding-love-groom-bride-4k.jpg', // Replace with actual image URL
});

const VendorsFound = () => {
  return (
    <div className="container mx-auto p-12">
      <h2 className="text-lg font-semibold mb-4">Found 29 results...</h2>
      <div className="grid grid-cols-4 gap-7">
        {vendors.map((vendor, index) => (
          <div key={index} className="bg-white shadow rounded overflow-hidden">
            <img src={vendor.image} alt={vendor.name} className="w-full h-40 object-cover" />
            <div className="p-2 bg-gray-200 text-center">
              {vendor.name}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex list-none">
            <li className="mx-1">
              <button className="px-3 py-1 bg-gray-300 rounded">1</button>
            </li>
            <li className="mx-1">
              <button className="px-3 py-1 bg-gray-300 rounded">2</button>
            </li>
            <li className="mx-1">
              <button className="px-3 py-1 bg-gray-300 rounded">3</button>
            </li>
            <li className="mx-1">
              <button className="px-3 py-1 bg-gray-300 rounded">...</button>
            </li>
            <li className="mx-1">
              <button className="px-3 py-1 bg-gray-300 rounded">9</button>
            </li>
            <li className="mx-1">
              <button className="px-3 py-1 bg-gray-300 rounded">10</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default VendorsFound;
