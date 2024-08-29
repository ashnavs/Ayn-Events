import React, { useState, useEffect } from 'react';
import { clearUser, checkAuth, selectUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { BsChatDotsFill } from 'react-icons/bs'

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    if (user) {
      setShowWelcomeMessage(true);
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleAuth = () => {
    dispatch(checkAuth())
  }

  return (
    <header className="sticky top-0 bg-[#c7c3a2] p-4 flex justify-between items-center z-50">
      <div className="flex items-center space-x-2">
        <Link to="/home" className="flex items-center space-x-3">
          <span className="text-white text-4xl font-light">AYN EVENTS</span>
        </Link>
      </div>
      <div className="flex-grow text-center">
        {showWelcomeMessage && user && (
          <span className="text-white text-lg">Hi, Welcome {user.name}</span>
        )}
      </div>
      <nav className="flex space-x-8 text-sm">
        <Link to="/home" className="text-white hover:underline">Home</Link>
        <Link to="/vendors" className="text-white hover:underline">Vendors</Link>
        <div className="relative group">
          <Link to="/profile">
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <FaUser size={18} onClick={handleAuth} />
            </button>
          </Link>
          {user && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {user.name}
            </div>
          )}
        </div>
        <Link to='/chat'>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
            <BsChatDotsFill size={19}/>
          </button>
        </Link>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          <FiLogOut size={18} onClick={handleLogout} />
        </button>
      </nav>
    </header>
  );
};

export default Header;
