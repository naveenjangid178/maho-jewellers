import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';  // Import Link and useLocation
import { Heart, Menu, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const location = useLocation();  // Get the current location (path)

    const menuItems = [
        { name: "New In", link: "/new-products" },
        { name: "Collections", link: "/catalogue" },
        { name: "Blog", link: "/blog" },
        // { name: "Shop", link: "/cart" },
    ];

    const handleClick = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    // Function to check if the link is active
    const isActive = (link) => location.pathname === link;

    return (
        <nav className='md:px-24 bg-[#F6F3EE] px-4'>
            <div className='flex items-center gap-2 justify-between'>
                <Logo width={50} />
                <div className='md:flex hidden gap-8 justify-center p-2 opacity-60'>
                    {menuItems.map((menu) => (
                        <Link 
                            to={menu.link} 
                            key={menu.name} 
                            className={`font-[Platypi] font-semibold hover:text-black text-[1.1rem] ${
                                isActive(menu.link) ? 'text-black font-bold' : 'text-gray-800'
                            }`}
                        >
                            {String(menu.name).toUpperCase()}
                        </Link>
                    ))}
                </div>

                <div className='flex gap-4 items-center'>
                    <span className="relative cursor-pointer">
                        {/* <p className="absolute top-[-6px] right-[-7px] bg-[#9C1137] rounded-full h-4 w-4 flex items-center justify-center text-white text-xs">
                            4
                        </p> */}
                        <ShoppingBag height={21} />
                    </span>

                    {isMenuVisible ? <X className='md:hidden' onClick={handleClick} /> : <Menu className='md:hidden' onClick={handleClick} />}
                </div>
            </div>

            {isMenuVisible && (
                <div
                    className={`flex flex-col bg-transparent gap-8 justify-center p-2 opacity-0 transform transition-transform duration-700 ease-out ${
                        isMenuVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
                >
                    {menuItems.map((menu) => (
                        <Link
                            to={menu.link}
                            className={`${
                                isActive(menu.link) ? 'text-black font-bold' : 'text-gray-600'
                            }`}
                            key={menu.name}
                        >
                            {String(menu.name).toUpperCase()}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
