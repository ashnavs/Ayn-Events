// src/components/Header.jsx
import React from 'react';
import { FiBell, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { clearVendor ,checkAuth} from '../features/vendor/vendorSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';



const VendorHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAuth = () => {
    console.log('call1');
    dispatch(checkAuth())
  }

  const logOut = () => {
    clearVendor()
    Cookies.remove('tokenvendor');
    navigate('/vendor/login')
  }
  return (
    <header className="bg-[#CBC8AF] h-16 flex justify-between items-center px-4">
      <div className="flex items-center">
        <span className="text-white font-serif text-4xl font-thin">
          AYN EVENTS<span className="font-sans text-xs"></span>
        </span>
      </div>
      <nav className="flex items-center">
      <Link to="/vendor/profile" className="text-white mr-4 hover:text-gray-200 flex items-center">
          <span className="ml-2">Home</span>
        </Link>
        <div className="relative mr-4">
          <button className="focus:outline-none">
            <FiBell className="h-6 w-6 text-white" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>
        </div>
        <button onClick={handleAuth} className="focus:outline-none">
          <FiMessageSquare className="h-6 w-6 text-white" />
        </button>
      
        <button onClick={logOut} className="focus:outline-none px-2">
          <FiLogOut className="h-6 w-6 text-white" />
        </button>
      </nav>
    </header>
  );
};

export default VendorHeader;
