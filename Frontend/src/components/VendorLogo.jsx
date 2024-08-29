// import React, { useState, useEffect } from 'react';
// import { FiStar } from 'react-icons/fi';
// import { useSelector } from 'react-redux';
// import { selectVendor } from '../features/vendor/vendorSlice';
// import axiosInstanceVendor from '../services/axiosInstanceVenndor';
// import CreatePostModal from './CreatePostModal';
// import EditProfileModal from './EditProfileModal';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';


// const VendorLogo = ({ vendorId }) => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [vendor, setVendor] = useState([]);
//   const availableServices = ['Photography', 'Videography', 'Catering', 'Decorations'];

//   useEffect(() => {
//     if (vendorId) {
//       fetchVendor();
//     }
//   }, [vendorId]);

//   const fetchVendor = async () => {
//     try {
//       const response = await axiosInstanceVendor.get(`/${vendorId}`);
//       setVendor(response.data);
//     } catch (error) {
//       console.error('Error fetching vendor data:', error);
//     }
//   };

//   const handlePostCreated = () => {
//     // toast.success('Post created successfully!');
//     fetchVendor(); // Optionally refresh vendor data
//     setIsModalOpen(false);
//   };

//   const bookingDetails = () => {
//     navigate(`/vendor/bookings/${vendorId}`);
//   };


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
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-2xl font-bold">{vendor.name}</h2>
//               <p>{vendor.email}</p>
//               <p>{vendor.city}</p>
//             </div>
//             <div className="flex items-center">
//               <FiStar className="text-yellow-500" />
//               <span className="ml-1 text-xl font-semibold">{vendor.rating || 25}</span>
//               <span className="ml-2 text-gray-600">{vendor.reviews} Reviews</span>
//             </div>
//           </div>
//           <div className="mt-4 flex justify-around">
//             <button onClick={bookingDetails} className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Booking Details</button>
//             <button
//               className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
//               onClick={() => setIsModalOpen(true)}
//             >
//               Create Post
//             </button>
//             <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
//               onClick={() => setIsEditModalOpen(true)}
//             >
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </div>
//       <CreatePostModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onPostCreated={handlePostCreated} />
//       <EditProfileModal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} vendor={vendor} availableServices={availableServices} onVendorUpdated={fetchVendor} />
 
//     </div>
//   );
// };


// export default VendorLogo;


//new
import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import CreatePostModal from './CreatePostModal';
import EditProfileModal from './EditProfileModal';
import { useNavigate } from 'react-router-dom';

const VendorLogo = ({ vendorId, onPostCreated }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [vendor, setVendor] = useState([]);
  const availableServices = ['Photography', 'Videography', 'Catering', 'Decorations'];

  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const response = await axiosInstanceVendor.get(`/${vendorId}`);
      setVendor(response.data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    onPostCreated(newPost);
  };

  const bookingDetails = () => {
    navigate(`/vendor/bookings/${vendorId}`);
  };

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
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        vendor={vendor}
        availableServices={availableServices}
        onVendorUpdated={fetchVendor}
      />
    </div>
  );
};

export default VendorLogo;


