import React from 'react';
import Sidebar from '../../components/Sidebar';
const vendors = Array(6).fill({
    id: 1,
    name: 'Vendor 1',
    img: 'https://wallpapercrafter.com/sizes/2048x1152/14052-hands-wedding-love-groom-bride-4k.jpg',
  });

const VendorList = () => {
    return (
        <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-10">
        <div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search users"
              className="border rounded p-2 w-full max-w-xs"
            />
            <button className="ml-4 border rounded p-2 bg-gray-200">
              View vendor types
            </button>
          </div>
          <div className="text-lg font-bold mb-4">Vendors list</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
            {vendors.map((vendor, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-md">
                <img src={vendor.img} alt={vendor.name} className="w-full" />
                <div className="bg-gray-300 p-2 text-center">{vendor.name}</div>
              </div>
            ))}
          </div>
          {/* <div className="flex justify-center">
            <button className="px-4 py-2 border rounded-l bg-gray-200">{"<"}</button>
            {[...Array(10).keys()].map((page) => (
              <button key={page} className="px-4 py-2 border bg-gray-200">
                {page + 1}
              </button>
            ))}
            <button className="px-4 py-2 border rounded-r bg-gray-200">{">"}</button>
          </div> */}
        </div>
        </div>
      </div>
        
      );
};

export default VendorList;
