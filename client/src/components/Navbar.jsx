import React, { useState } from 'react'
import SearchInput from './SearchInput'
import { Heart, Menu, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const menuItems = [
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
        {
            name: "blog",
            link: "/blog"
        },
    ]

    const handleClick = () => {
        setIsMenuVisible(!isMenuVisible)
    }

    return (
        <nav className='md:px-12 px-4 md:pt-4 pt-2'>
            <div className='flex items-center gap-2 justify-between'>
                <Logo width={75} />
                <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div className='flex gap-4 items-center'>
                    <span className="relative cursor-pointer">
                        <p className="absolute top-0 right-[-7px] bg-[#9C1137] rounded-full h-4 w-4 flex items-center justify-center text-white text-xs">
                            4
                        </p>
                        <Heart height={34} />
                    </span>

                    <span className="relative cursor-pointer">
                        <p className="absolute top-[-6px] right-[-7px] bg-[#9C1137] rounded-full h-4 w-4 flex items-center justify-center text-white text-xs">
                            4
                        </p>
                        <ShoppingBag height={21} />
                    </span>

                    {isMenuVisible ? <X className='md:hidden' onClick={handleClick} /> : <Menu className='md:hidden' onClick={handleClick} />}
                </div>
            </div>
            <div className='md:flex hidden gap-8 justify-center p-2 opacity-60'>
                {menuItems.map((menu) => (
                    <a href={menu.link}>{String(menu.name).toUpperCase()}</a>
                ))}
            </div>

            {
                isMenuVisible && <div
                    className={`flex flex-col bg-transparent gap-8 justify-center p-2 opacity-0 transform transition-transform duration-700 ease-out ${isMenuVisible
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                        }`}
                >
                    {menuItems.map((menu) => (
                        <a href={menu.link}>{String(menu.name).toUpperCase()}</a>
                    ))}
                </div>
            }
        </nav>
    )
}

export default Navbar