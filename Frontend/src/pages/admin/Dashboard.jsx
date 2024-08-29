
import React, { useEffect, useState } from 'react';
import { FaStore, FaUsers } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import axiosInstanceVendor from '../../services/axiosInstanceVenndor';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userResponse = await axiosInstanceUser.get('/count');
        console.log("userResponse:", userResponse.data); // This should log '6'
        const vendorResponse = await axiosInstanceVendor.get('/count');
        console.log('vendorResponse:',vendorResponse.data)
        
        setUserCount(userResponse.data); // Set the user count directly
        setVendorCount(vendorResponse.data); // Adjust this based on the vendor response structure
  
        console.log('User Count:', userResponse.data); // Logging the correct user count
        console.log('Vendor Count:', vendorResponse.data.count || vendorResponse.data); // Logging the correct vendor count
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
  
    fetchCounts();
  }, []);
  

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6">
            <div className="flex items-center">
              <FaUsers className="w-10 h-10 text-gray-600 dark:text-gray-300" />
              <div className="ml-4">
  <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Users</h2>
  <p className="text-gray-600 dark:text-gray-300">Total Users: {userCount}</p>
</div>

            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6">
            <div className="flex items-center">
              <FaStore className="w-10 h-10 text-gray-600 dark:text-gray-300" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Vendors</h2>
                <p className="text-gray-600 dark:text-gray-300">Total Vendors: {vendorCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
