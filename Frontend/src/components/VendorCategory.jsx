// import React, { useEffect, useState, useRef } from 'react';
// import axiosInstanceUser from '../services/axiosInstanceUser';

// const VendorCategory = ({ categories: propCategories }) => {
//   const [categories, setCategories] = useState(propCategories || []);
//   const scrollContainer = useRef(null);

//   useEffect(() => {
//     if (!propCategories) {
//       const fetchCategories = async () => {
//         try {
//           const response = await axiosInstanceUser.get('/category'); 
//           comsole.log(respoyy)
//           setCategories(response.data.response); 
//         } catch (error) {
//           console.error('Error fetching categories:', error);
//         }
//       };

//       fetchCategories();
//     }
//   }, [propCategories]);

//   const scrollLeft = () => {
//     scrollContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
//   };

//   const scrollRight = () => {
//     scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
//   };

//   return (
//     <div className="relative py-8 px-4 border-b-4 border-[#c7c3a2] bg-[#F2EDEA]">
//       <h2 className="text-2xl font-semibold mb-4">Vendor categories</h2>
//       <div className="flex items-center relative">
//         <button onClick={scrollLeft} className="absolute left-0 ml-2 p-2 bg-gray-200 rounded-full z-10">
//           &lt;
//         </button>
//         <div ref={scrollContainer} className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto scrollbar-hide">
//           {categories.length > 0 ? (
//             categories.map((category, index) => (
//               <div key={index} className="text-center flex flex-col items-center">
//                 <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
//                   <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
//                 </div>
//                 <h3 className="text-lg font-medium">{category.name}</h3>
//                 <p className="text-sm text-gray-500">({category.count?.toLocaleString() || 0})</p> 
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500">No categories available</p>
//           )}
//         </div>
//         <button onClick={scrollRight} className="absolute right-0 mr-2 p-2 bg-gray-200 rounded-full z-10">
//           &gt;
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VendorCategory;

import React, { useEffect, useRef } from 'react';

const VendorCategory = ({ categories }) => {
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    scrollContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    console.log('categories', categories);
  }, [categories]);

  return (
    <div className="relative py-8 px-4 border-b-4 border-[#c7c3a2] bg-[#F2EDEA]">
      <h2 className="text-2xl font-semibold mb-4">Vendor categories</h2>
      <div className="flex items-center relative">
        <button onClick={scrollLeft} className="absolute left-0 ml-2 p-2 bg-gray-200 rounded-full z-10">
          &lt;
        </button>
        <div ref={scrollContainer} className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto scrollbar-hide">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                  {/* Placeholder image for categories */}
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-medium">{category.name}</h3>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No categories available</p>
          )}
        </div>
        <button onClick={scrollRight} className="absolute right-0 mr-2 p-2 bg-gray-200 rounded-full z-10">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default VendorCategory;


