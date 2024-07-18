import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaStore, FaUsers, FaChartBar, FaAdjust, FaServicestack } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import Cookies from 'js-cookie';
import { clearAdmin } from '../features/admin/adminslice';

function Sidebar() {
  const [vendorMenuOpen, setVendorMenuOpen] = useState(false);

  const toggleVendorMenu = () => {
    setVendorMenuOpen(!vendorMenuOpen);
  };

  const adminLogout = () => {
    clearAdmin()
    Cookies.remove('admintoken');
    navigate('/admin/login')
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg h-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">Admin</h1>
      </div>
      <nav className="mt-6">
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          to="/admin/dashboard"
        >
          <FaChartBar className="w-5 h-5" />
          <span className="mx-4 font-medium">Dashboard</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          to="/admin/userlist"
        >
          <FaUsers className="w-5 h-5" />
          <span className="mx-4 font-medium">All Users</span>
        </Link>
        <div className="mt-2">
          <div
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            onClick={toggleVendorMenu}
          >
            <FaStore className="w-5 h-5" />
            <span className="mx-4 font-medium">Vendors</span>
            {vendorMenuOpen ? <MdKeyboardArrowUp className="w-5 h-5 ml-auto" /> : <MdKeyboardArrowDown className="w-5 h-5 ml-auto" />}
          </div>
          {vendorMenuOpen && (
            <div className="ml-8">
              <Link
                className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                to="/admin/vendorlist"
              >
                <FaAdjust className="w-5 h-5" />
                <span className="mx-4 font-medium">All Vendor</span>
              </Link>
              <Link
                className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                to="/admin/vendorverify"
              >
                <FaAdjust className="w-5 h-5" />
                <span className="mx-4 font-medium">Verification  Request</span>
              </Link>
            </div>
          )}
        </div>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          to="/admin/report"
        >
          <FaUser className="w-5 h-5" />
          <span className="mx-4 font-medium">Report Management</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          to="/admin/addservice"
        >
          <FaServicestack className="w-5 h-5" />
          <span className="mx-4 font-medium">Services</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          to="#" onClick={adminLogout}
        >
          <BiLogOut className="w-5 h-5" />
          <span className="mx-4 font-medium">Logout</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
