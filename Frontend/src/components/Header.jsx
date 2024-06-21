import React from 'react';
import { clearUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Header() {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogout =()=>{
        dispatch(clearUser())
        navigate('/login')
    }
    return (
        <div>
             <nav className="bg-[#a7a379ab] dark:bg-gray-700">
            <div className="max-w-screen-xl px-4 py-3 mx-auto flex justify-between items-center">
                {/* Logo on the left */}
                <div className="flex items-center">
                    <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                        
                        {/* <img src="/src/assets/logo_white1.png" className="h-12 " alt="Your Logo" /> */}
                        <span className="self-center text-4xl whitespace-nowrap dark:text-white font-light text-[#FFFF] max-w-full inline-block">AYN EVENTS</span>
                    </a>
                </div>

                {/* Menu items on the right */}
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm" id='nav'>
                        <li>
                            <a href="#" className="text-[#FFFF] dark:text-white hover:underline" aria-current="page">HOME</a>
                        </li>
                        <li>
                            <a href="#" className="text-[#FFFF] dark:text-white hover:underline">VENDORS</a>
                        </li>
                        <li>
                            <a onClick={handleLogout} className="text-[#FFFF] dark:text-white hover:underline">LOGOUT</a>
                          

                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
        </div>
    );
}

export default Header;
