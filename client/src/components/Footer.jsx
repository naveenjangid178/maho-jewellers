import { Facebook, Instagram, Twitter } from 'lucide-react'
import React from 'react'
import { footer } from '../details'
import Logo from './Logo'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <div className='bg-[#F6F3EE] py-2 md:px-12 px-4'>
                <div className='flex md:flex-row flex-col md:gap-20 gap-4 py-4 md:py-12'>
                    <Logo width={75} />
                    <div className='flex md:flex-row flex-col gap-4 justify-between w-full'>
                        <div className='flex flex-col gap-3 text-[#383434]'>
                            <h3 className='font-medium'>Link</h3>
                            <Link>Our Story</Link>
                            <Link>Careers</Link>
                            <Link>Blog</Link>
                        </div>
                        <div className='text-[#383434] flex flex-col gap-4'>
                            <h3 className='font-medium'>Shop</h3>
                            <div className='grid md:grid-cols-2 gap-4 grid-cols-1'>
                                <Link>Phone: 8079088775</Link>
                                <Link>Phone: 8079088775</Link>
                                <Link>Phone: 8079088775</Link>
                                <Link>Phone: 8079088775</Link>
                                <Link>Phone: 8079088775</Link>
                                <Link>Phone: 8079088775</Link>
                            </div>
                        </div>
                        <div className='flex flex-col gap-3 text-[#383434]'>
                            <h3 className='font-medium'>Contact Us</h3>
                            <Link>Phone: 8079088775</Link>
                            <Link>Email: example@domain.com</Link>
                        </div>
                        <div className='flex flex-col gap-3 text-[#383434]'>
                            <h3 className='font-medium'>Address</h3>
                            <Link>685 Market Street San Francisco, CA 94105, US</Link>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 relative py-2 justify-end'>
                    <span className='absolute w-full top-0 bg-black h-[1px] opacity-40'></span>
                    <Instagram className='text-white bg-[#9C1137] rounded-full p-1 cursor-pointer' />
                    <Facebook className='text-white bg-[#9C1137] rounded-full p-1 cursor-pointer' />
                    <Twitter className='text-white bg-[#9C1137] rounded-full p-1 cursor-pointer' />
                </div>
            </div>
        </footer>
    )
}

export default Footer