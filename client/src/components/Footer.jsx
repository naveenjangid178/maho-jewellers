import { Facebook, Instagram, Twitter } from 'lucide-react'
import React from 'react'
import { footer } from '../details'
import Logo from './Logo'

const Footer = () => {
    return (
        <footer>
            <div className='flex flex-col gap-8 items-center text-center py-8'>
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[#383434] font-medium'>NEWESLETTER SIGN UP</h3>
                    <p className='text-[#383434] text-sm'>Sign up for new arrivals, offers, and more!</p>
                </div>
                <span className='border'>
                    <input type='text' className='outline-none p-2 px-6 text-[#958F86] w-72' placeholder='Enter Your Email' />
                    <button className='bg-[#9C1137] p-2 px-5 text-white cursor-pointer'>Submit</button>
                </span>
            </div>
            <div className='bg-[#F6F3EE] py-2 md:px-12 px-4'>
                <div className='grid md:grid-cols-7 grid-cols-1 gap-4 py-4 md:py-12'>
                    <Logo width={75} />
                    {Object.entries(footer).map(([section, links]) => (
                        <div key={section} className='flex flex-col gap-3 text-[#383434]'>
                            <h3 className='font-medium'>{section}</h3>
                            <ul className='flex flex-col gap-3'>
                                {links.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.link}>{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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