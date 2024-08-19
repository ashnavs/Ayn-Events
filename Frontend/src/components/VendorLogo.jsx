import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectVendor } from '../features/vendor/vendorSlice';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import CreatePostModal from './CreatePostModal';
import EditProfileModal from './EditProfileModal';
import { useNavigate } from 'react-router-dom';

const VendorLogo = ({ vendorId }) => {
  console.log(vendorId)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [vendor,setVendor] = useState([]);
  const availableServices = ['Photography', 'Videography', 'Catering', 'Decorations'];
  
  console.log(vendor)
  // useEffect(() => {
  //   const fetchVendor = async () => {
  //     try {
  //       const response = await axiosInstanceVendor.get(`/${vendorId}`);
  //       console.log(response.data);
  //       setVendor(response.data); 
  //     } catch (error) {
  //       console.error('Error fetching getposts:', error);
  //     }
  //   };

  //   if (vendorId) {
  //     fetchVendor();
  //   }
  // }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const response = await axiosInstanceVendor.get(`/${vendorId}`);
      setVendor(response.data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  // Fetch vendor data on component mount or when vendorId changes
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const bookingDetails = () => {
    navigate(`/vendor/bookings/${vendorId}`)
  }


  return (
    <div className="bg-[#ffffff] p-4 flex flex-col items-center" style={{ height: '464px' }}>
      <div className="w-full max-w-6xl rounded-lg mt-8">
        <div className="relative h-72 rounded-t-lg overflow-hidden">
          <img
            src="https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg"
            alt="Vendor"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative p-5 bg-[#F0ECE3] transform translate-y-[-50%] mx-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <p>{vendor.email}</p>
              <p>{vendor.city}</p>
              {/* <p>{vendor.services?vendor.services.join(', ') : 'no service'}</p> */}
            </div>
            <div className="flex items-center">
              <FiStar className="text-yellow-500" />
              <span className="ml-1 text-xl font-semibold">{vendor.rating || 25}</span>
              <span className="ml-2 text-gray-600">{vendor.reviews} Reviews</span>
            </div>
          </div>
          <div className="mt-4 flex justify-around">
            <button onClick={bookingDetails} className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Booking Details</button>
            <button
              className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              Create Post
            </button>
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
            onClick={()=>{setIsEditModalOpen(true)}}
            >Edit Profile</button>
          </div>
        </div>
      </div>
      <CreatePostModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
      <EditProfileModal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} vendor={vendor} availableServices={availableServices} onVendorUpdated={fetchVendor} />
    </div>
  );
};

export default VendorLogo;












// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { FiStar } from 'react-icons/fi';
// import { selectVendor } from '../features/vendor/vendorSlice';
// import axiosInstanceVendor from '../services/axiosInstanceVenndor';
// import CreatePostModal from './CreatePostModal';
// import EditProfileModal from './EditProfileModal';

// const VendorLogo = () => {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
//   const vendor = useSelector(selectVendor);
//   const availableServices = ['Photography', 'Videography', 'Catering', 'Decorations']; // Example services

//   return (
//     <div className="bg-[#ffffff] p-4 flex flex-col items-center" style={{ height: '464px' }}>
//       <div className="w-full max-w-6xl rounded-lg mt-8">
//         <div className="relative h-72 rounded-t-lg overflow-hidden">
//           <img
//             src="https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg"
//             alt="Vendor"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="relative p-5 bg-[#F0ECE3] transform translate-y-[-50%] mx-4 rounded-lg shadow-md">
//           {vendor ? (
//             <>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-2xl font-bold">{vendor.vendor.name}</h2>
//                   <p>{vendor.vendor.email}</p>
//                   <p>{vendor.vendor.city}</p>
//                   <p>{vendor.vendor.services ? vendor.vendor.services.join(', ') : 'No services available'}</p>
//                 </div>
//                 <div className="flex items-center">
//                   <FiStar className="text-yellow-500" />
//                   <span className="ml-1 text-xl font-semibold">{vendor.rating || 25}</span>
//                   <span className="ml-2 text-gray-600">{vendor.reviews} Reviews</span>
//                 </div>
//               </div>
//               <div className="mt-4 flex justify-around">
//                 <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Booking Details</button>
//                 <button
//                   className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
//                   onClick={() => setIsCreatePostModalOpen(true)}
//                 >
//                   Create Post
//                 </button>
//                 <button
//                   className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
//                   onClick={() => setIsEditModalOpen(true)}
//                 >
//                   Edit Profile
//                 </button>
//               </div>
//             </>
//           ) : (
//             <p>Loading vendor details...</p>
//           )}
//         </div>
//       </div>
//       <CreatePostModal isOpen={isCreatePostModalOpen} onRequestClose={() => setIsCreatePostModalOpen(false)} />
//       <EditProfileModal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} vendor={vendor} availableServices={availableServices} />
//     </div>
//   );
// };

// export default VendorLogo;
