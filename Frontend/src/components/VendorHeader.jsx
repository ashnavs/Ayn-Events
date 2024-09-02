import React, { useEffect } from 'react';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { clearVendor, checkAuth } from '../features/vendor/vendorSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { updateUnreadCount } from '../features/chat/chatSlice';
import { useSocket } from '../services/socketProvider';
import { BsChatDotsFill } from 'react-icons/bs'

const VendorHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {socket} = useSocket();
  const unreadCount = useSelector((state) => state.chat.unreadCount);



  useEffect(() => {
    if (socket) {
      socket.on('unreadCount', ({ unreadCount, recipient }) => {
        if (recipient === 'Vendor') {
          console.log('Vendor unread count received:', unreadCount);
          dispatch(updateUnreadCount({ unreadCount }));
        }
      });
  
      return () => {
        socket.off('unreadCount');
      };
    }
  }, [socket, dispatch]);
  

  const handleAuth = () => {
    console.log('call1');
    dispatch(checkAuth());
  };

  const logOut = () => {
    dispatch(clearVendor());
    Cookies.remove('tokenvendor');
    navigate('/vendor/login');
  };

  return (
    <header className="bg-[#CBC8AF] h-16 flex justify-between items-center px-4 sticky top-0 z-50">
      <div className="flex items-center">
        <span className="text-white font-serif text-4xl font-thin">
          AYN EVENTS<span className="font-sans text-xs"></span>
        </span>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="/vendor/profile" className="text-white hover:text-gray-200 flex items-center">
          <span className="ml-2">Home</span>
        </Link>
        <Link to='/vendor/chat'>
        <button className="relative">
          <BsChatDotsFill size={19} className='text-white' />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500  text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        </Link>
        <button onClick={logOut} className="focus:outline-none">
          <FiLogOut className="h-6 w-6 text-white" />
        </button>
      </nav>
    </header>
  );
};

export default VendorHeader;