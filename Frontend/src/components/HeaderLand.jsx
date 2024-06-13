import React from 'react';

function HeaderLand() {
    return (
        <div>
            {/* <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <a href="https://flowbite.com" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <a href="tel:5541251234" className="text-sm text-gray-500 dark:text-white hover:underline">(555) 412-1234</a>
                        <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">Login</a>
                    </div>
                </div>
            </nav> */}
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
                            <a href="/login" className="text-[#FFFF] dark:text-white hover:underline">LOGIN/</a>
                            <a href="/signup" className="text-[#FFFF] dark:text-white hover:underline">SIGNUP</a>

                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
        </div>
    );
}

export default HeaderLand;
