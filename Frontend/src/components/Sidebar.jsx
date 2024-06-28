import React from 'react'
import { FaUser, FaStore, FaUsers, FaChartBar } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

function Sidebar() {
    return (
        <div className="w-64 bg-white dark:bg-gray-900 shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">Admin</h1>
          </div>
          <nav className="mt-6">
            <a className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" href="/admin/dashboard">
              <FaChartBar className="w-5 h-5" />
              <span className="mx-4 font-medium">Dashboard</span>
            </a>
            <a className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" href="/admin/userlist">
              <FaUsers className="w-5 h-5" />
              <span className="mx-4 font-medium">All Users</span>
            </a>
            <a className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" href="/admin/vendorlist">
              <FaStore className="w-5 h-5" />
              <span className="mx-4 font-medium">Vendors</span>
            </a>
            <a className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" href="#">
              <FaUser className="w-5 h-5" />
              <span className="mx-4 font-medium">Report Management</span>
            </a>
            <a className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" href="#">
              <BiLogOut className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </a>
          </nav>
        </div>
      );
}

export default Sidebar