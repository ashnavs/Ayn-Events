// import React, { useEffect, useState } from 'react';
// import axiosInstanceUser from '../services/axiosInstanceUser';

// const VendorsFound = () => {
//   const [vendors, setVendors] = useState([]);
//   const [licenseData, setLicenseData] = useState({});
//   const [status, setStatus] = useState('idle');
//   const [error, setError] = useState(null);

//   const fetchVerifiedVendors = async () => {
//     setStatus('loading');
//     try {
//       const response = await axiosInstanceUser.get('/verifyvendor');
//       setVendors(response.data.response || []);
//       setStatus('succeeded');
//     } catch (err) {
//       console.error('Failed to fetch vendors:', err);
//       setError(err.message);
//       setStatus('failed');
//     }
//   };

//   const fetchLicenseData = async (email) => {
//     try {
//       const response = await axiosInstanceUser.get(`/license/${email}`);
//       setLicenseData((prevData) => ({
//         ...prevData,
//         [email]: response.data,
//       }));
//     } catch (err) {
//       console.error('Failed to fetch license:', err);
//     }
//   };

//   useEffect(() => {
//     fetchVerifiedVendors();
//   }, []);

//   useEffect(() => {
//     if (vendors.length > 0) {
//       vendors.forEach((vendor) => {
//         fetchLicenseData(vendor.email);
//       });
//     }
//   }, [vendors]);
  

//   const handleVendorClick = (email) => {
//     history.push(`/vendor/${email}`);
//   };

  
//   return (
//     <div className="container mx-auto p-12">
//       {status === 'loading' ? (
//         <p className="text-center">Loading...</p>
//       ) : status === 'failed' ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <>
//           <h2 className="text-lg font-semibold mb-4">Found {vendors.length} results...</h2>
//           <div className="grid grid-cols-4 gap-7">
//             {vendors.map((vendor, index) => (
//               <div key={index} className="bg-white shadow rounded overflow-hidden curser-pointer">
//                 <img
//                   src={licenseData[vendor.email]?.logoUrl}
//                   alt={vendor.name}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="p-2 bg-gray-200 text-center">
//                   {vendor.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VendorsFound;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstanceUser from '../services/axiosInstanceUser';

// const VendorsFound = () => {
//   const [vendors, setVendors] = useState([]);
//   const [licenseLogos, setLicenseLogos] = useState({});
//   const [status, setStatus] = useState('idle');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch verified vendors
//   const fetchVerifiedVendors = async () => {
//     setStatus('loading');
//     try {
//       const response = await axiosInstanceUser.get('/verifyvendor');
//       console.log(response);
//       setVendors(response.data.response || []);
//       setStatus('succeeded');
//     } catch (err) {
//       console.error('Failed to fetch vendors:', err);
//       setError(err.message);
//       setStatus('failed');
//     }
//   };

//   // Fetch license data (logo URLs) based on vendor email
//   const fetchLicenseLogos = async (email) => {
//     try {
//       const response = await axiosInstanceUser.get(`/license/${email}`);
//       setLicenseLogos((prevData) => ({
//         ...prevData,
//         [email]: response.data.logoUrl,
//       }));
//     } catch (err) {
//       console.error('Failed to fetch license logo:', err);
//     }
//   };

//   // Fetch vendors on component mount
//   useEffect(() => {
//     fetchVerifiedVendors();
//   }, []);

//   // Fetch license logos when vendors change
//   useEffect(() => {
//     if (vendors.length > 0) {
//       vendors.forEach((vendor) => {
//         fetchLicenseLogos(vendor.email);
//       });
//     }
//   }, [vendors]);

//   // Handle vendor click to navigate to vendor detail page
//   const handleVendorClick = async(id) => {
//     try {
//       console.log(id);
//       const response = await axiosInstanceUser.get(`/vendor/${id}`);
//       navigate(`/vendor/${id}`)
//       return response.data
      
//     } catch (error) {
//       console.error('Failed to fetch vendors:', error);
//     }
//   }

//   return (
//     <div className="container mx-auto p-12">
//       {status === 'loading' ? (
//         <p className="text-center">Loading...</p>
//       ) : status === 'failed' ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <>
//           <h2 className="text-lg font-semibold mb-4">Found {vendors.length} results...</h2>
//           <div className="grid grid-cols-4 gap-7">
//             {vendors.map((vendor, index) => (
//               <div
//                 onClick={() => handleVendorClick(vendor._id)}
//                 key={index}
//                 className="bg-white shadow rounded overflow-hidden cursor-pointer"
//                 >
//                 <img
//                   src={licenseLogos[vendor.email]}
//                   alt={vendor.name}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="p-2 bg-gray-200 text-center">
//                   {vendor.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VendorsFound;











// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstanceUser from '../services/axiosInstanceUser';

// const VendorsFound = () => {
//   const [vendors, setVendors] = useState([]);
//   const [licenseLogos, setLicenseLogos] = useState({});
//   const [status, setStatus] = useState('idle');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch verified vendors
//   const fetchVerifiedVendors = async () => {
//     setStatus('loading');
//     try {
//       const response = await axiosInstanceUser.get('/verifyvendor');
//       console.log(response);
//       setVendors(response.data.response || []);
//       setStatus('succeeded');
//     } catch (err) {
//       console.error('Failed to fetch vendors:', err);
//       setError(err.message);
//       setStatus('failed');
//     }
//   };

//   // Fetch license data (logo URLs) based on vendor email
//   const fetchLicenseLogos = async (email) => {
//     try {
//       const response = await axiosInstanceUser.get(`/license/${email}`);
//       setLicenseLogos((prevData) => ({
//         ...prevData,
//         [email]: response.data.logoUrl,
//       }));
//     } catch (err) {
//       console.error('Failed to fetch license logo:', err);
//     }
//   };

//   // Fetch vendors on component mount
//   useEffect(() => {
//     fetchVerifiedVendors();
//   }, []);

//   // Fetch license logos when vendors change
//   useEffect(() => {
//     if (vendors.length > 0) {
//       vendors.forEach((vendor) => {
//         fetchLicenseLogos(vendor.email);
//       });
//     }
//   }, [vendors]);

//   // Handle vendor click to navigate to vendor detail page
//   const handleVendorClick = (id) => {
//     navigate(`/vendor/${id}`);
//   };

//   return (
//     <div className="container mx-auto p-12">
//       {status === 'loading' ? (
//         <p className="text-center">Loading...</p>
//       ) : status === 'failed' ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <>
//           <h2 className="text-lg font-semibold mb-4">Found {vendors.length} results...</h2>
//           <div className="grid grid-cols-4 gap-7">
//             {vendors.map((vendor, index) => (
//               <div
//                 onClick={() => handleVendorClick(vendor._id)}
//                 key={index}
//                 className="bg-white shadow rounded overflow-hidden cursor-pointer"
//               >
//                 <img
//                   src={licenseLogos[vendor.email]}
//                   alt={vendor.name}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="p-2 bg-gray-200 text-center">
//                   {vendor.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VendorsFound;












import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstanceUser from '../services/axiosInstanceUser';

const VendorsFound = () => {
  const [vendors, setVendors] = useState([]);
  const [licenseLogos, setLicenseLogos] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVerifiedVendors = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstanceUser.get('/verifyvendor');
      console.log(response);
      setVendors(response.data.response || []);
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setError(err.message);
      setStatus('failed');
    }
  };

  const fetchLicenseLogos = async (email) => {
    try {
      const response = await axiosInstanceUser.get(`/license/${email}`);
      setLicenseLogos((prevData) => ({
        ...prevData,
        [email]: response.data.logoUrl,
      }));
    } catch (err) {
      console.error('Failed to fetch license logo:', err);
    }
  };

  useEffect(() => {
    fetchVerifiedVendors();
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      vendors.forEach((vendor) => {
        fetchLicenseLogos(vendor.email);
      });
    }
  }, [vendors]);

  const handleVendorClick = (id) => {
    navigate(`/vendorDetails/${id}`);
  };

  return (
    <div className="container mx-auto p-12">
      {status === 'loading' ? (
        <p className="text-center">Loading...</p>
      ) : status === 'failed' ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">Found {vendors.length} results...</h2>
          <div className="grid grid-cols-4 gap-7">
            {vendors.map((vendor, index) => (
              <div
                onClick={() => handleVendorClick(vendor._id)}
                key={index}
                className="bg-white shadow rounded overflow-hidden cursor-pointer"
              >
                <img
                  src={licenseLogos[vendor.email]}
                  alt={vendor.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 bg-gray-200 text-center">
                  {vendor.name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorsFound;

