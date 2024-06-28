import React from 'react';
import { clearUser,checkAuth } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaUser } from 'react-icons/fa';
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleAuth = () => {
    dispatch(checkAuth())
  }

  return (
    <header className="bg-[#c7c3a2] p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <a href="/home" className="flex items-center space-x-3">
          <span className="text-white text-4xl font-light">AYN EVENTS</span>
        </a>
      </div>
      <nav className="flex space-x-8 text-sm">
        <a href="#" className="text-white hover:underline">Home</a>
        <a href="#" className="text-white hover:underline">Vendors</a>
        <a onClick={handleLogout} className="text-white hover:underline cursor-pointer">Logout</a>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color:'white' }}>
      <FaUser size={18} />
    </button>
      </nav>
    </header>
  );
};

export default Header;
