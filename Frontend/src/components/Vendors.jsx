import React from 'react'

const vendors = [
    { id: 1, name: 'Venue A', reviews: '4.5', image: '/path/to/image1.jpg' },
    { id: 2, name: 'Vendor B', reviews: '4.7', image: '/path/to/image2.jpg' },
    { id: 3, name: 'Vendor C', reviews: '4.8', image: '/path/to/image3.jpg' },
  ];

function Vendors() {
    return (
        <section className="py-12 bg-[#c6c2b9] text-center">
          <h2 className="text-3xl font-bold text-center mb-8">TOP RATED VENDORS</h2>
          <div className="flex space-x-4 justify-center">
            {vendors.map(vendor => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <img src={vendor.image} alt={vendor.name} className="rounded-lg mb-4" />
                <h3 className="text-xl font-semibold">{vendor.name}</h3>
                <p className="text-gray-500">Reviews: {vendor.reviews}</p>
              </div>
            ))}
          </div>
        </section>
      );
}

export default Vendors
