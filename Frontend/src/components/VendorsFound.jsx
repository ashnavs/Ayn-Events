import React, { useEffect, useState } from 'react';
import axiosInstanceUser from '../services/axiosInstanceUser';
import axiosInstance from '../services/axiosInstance'; // Make sure you have this import

const VendorsFound = () => {
  const [vendors, setVendors] = useState([]);
  const [licenseData, setLicenseData] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const fetchVerifiedVendors = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstanceUser.get('/verifyvendor');
      console.log(response,"😜");
      setVendors(response.data.response || []);
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setError(err.message);
      setStatus('failed');
    }
  };

  const fetchLicenseData = async (email) => {
    try {
      const response = await axiosInstance.get(`/license/${email}`);
      setLicenseData((prevData) => ({
        ...prevData,
        [email]: response.data,
      }));
    } catch (err) {
      console.error('Failed to fetch license:', err);
    }
  };

  useEffect(() => {
    fetchVerifiedVendors();
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      vendors.forEach((vendor) => {
        fetchLicenseData(vendor.email);
      });
    }
  }, [vendors]);

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
              <div key={index} className="bg-white shadow rounded overflow-hidden">
                <img
                  src={licenseData[vendor.email]?.logoUrl || 'https://via.placeholder.com/150'}
                  alt={vendor.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 bg-gray-200 text-center">
                  {vendor.name}
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex justify-center mt-4">
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
          </div> */}
        </>
      )}
    </div>
  );
};

export default VendorsFound;
