import React from 'react';
import { clearUser,checkAuth, selectUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector (selectUser)
  console.log(user,"❌");

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
        <a href="/vendors" className="text-white hover:underline">Vendors</a>
        {/* <h2>{user.name}</h2> */}
      
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color:'white' }}>
      <FaUser size={18} onClick={handleAuth} />
    </button>

    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color:'white' }}>
      <FiLogOut size={18}  onClick={handleLogout}/>
    </button>
      </nav>
    </header>
  );
};

export default Header;
