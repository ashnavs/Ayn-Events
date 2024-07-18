import React from 'react';
import { FaStore, FaUsers } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';


const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
        <Sidebar/>
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6">
            <div className="flex items-center">
              <FaUsers className="w-10 h-10 text-gray-600 dark:text-gray-300" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Users</h2>
                <p className="text-gray-600 dark:text-gray-300">Total Users: 340</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6">
            <div className="flex items-center">
              <FaStore className="w-10 h-10 text-gray-600 dark:text-gray-300" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Vendors</h2>
                <p className="text-gray-600 dark:text-gray-300">Total Vendors: 112</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;