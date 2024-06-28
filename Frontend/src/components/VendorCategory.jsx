import React, { useRef } from 'react';

const VendorCategory = () => {
  const categories = [
    { name: 'Wedding', imageUrl: 'https://www.powerplayent.com/wp-content/uploads/2016/04/wedding-lighting.jpg', count: 12301 },
    { name: 'Birthday', imageUrl: 'https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg', count: 59400 },
    { name: 'Wedding', imageUrl: 'https://www.powerplayent.com/wp-content/uploads/2016/04/wedding-lighting.jpg', count: 12301 },
    { name: 'Birthday', imageUrl: 'https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg', count: 59400 },
    { name: 'Wedding', imageUrl: 'https://www.powerplayent.com/wp-content/uploads/2016/04/wedding-lighting.jpg', count: 12301 },
    { name: 'Birthday', imageUrl: 'https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg', count: 59400 },
    { name: 'Wedding', imageUrl: 'https://www.powerplayent.com/wp-content/uploads/2016/04/wedding-lighting.jpg', count: 12301 },
    { name: 'Birthday', imageUrl: 'https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg', count: 59400 },
    { name: 'Wedding', imageUrl: 'https://www.powerplayent.com/wp-content/uploads/2016/04/wedding-lighting.jpg', count: 12301 },
    { name: 'Birthday', imageUrl: 'https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg', count: 59400 },
    { name: 'Wedding', imageUrl: 'https://www.powerplayent.com/wp-content/uploads/2016/04/wedding-lighting.jpg', count: 12301 },
    { name: 'Birthday', imageUrl: 'https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg', count: 59400 },
    // Add more categories as needed
  ];
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    scrollContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="relative py-8 px-4 border-b-4 border-[#c7c3a2] bg-[#F2EDEA]">
      <h2 className="text-2xl font-semibold mb-4">Vendor categories</h2>
      <div className="flex items-center relative">
        <button onClick={scrollLeft} className="absolute left-0 ml-2 p-2 bg-gray-200 rounded-full z-10">
          &lt;
        </button>
        <div ref={scrollContainer} className="flex overflow-x-auto space-x-4 scrollbar-hide">
          {categories.map((category, index) => (
            <div key={index} className="text-center inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-medium">{category.name}</h3>
              <p className="text-sm text-gray-500">({category.count.toLocaleString()})</p>
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="absolute right-0 mr-2 p-2 bg-gray-200 rounded-full z-10">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default VendorCategory;
