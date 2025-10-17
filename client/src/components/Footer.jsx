import { Facebook, Instagram } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { getAllCatalogues } from '../utils/catalogue'

const Footer = () => {
    const [catalogues, setCatalogues] = useState([])

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getAllCatalogues();
                setCatalogues(response);
            } catch (error) {
                console.error('Error fetching catalogues:', error);
            }
        }
        fetchCatalogues();
    }, []);

    return (
        <footer>
            <div className='bg-[#F6F3EE] py-2 md:px-12 px-4'>
                <div className='flex md:flex-row flex-col md:gap-20 gap-4 py-4 md:py-12'>
                    <Logo width={75} />
                    <div className='flex md:flex-row flex-col gap-4 justify-between w-full'>
                        <div className='flex flex-col gap-3 text-[#383434]'>
                            <h3 className='font-semibold'>Link</h3>
                            <Link>Our Story</Link>
                            <Link>Careers</Link>
                            <Link to={"/blog"}>Blog</Link>
                            <Link to={"privacy-policy"}>Privacy-Policy</Link>
                        </div>
                        <div className='text-[#383434] flex flex-col gap-4'>
                            <h3 className='font-semibold'>Shop</h3>
                            <div className='grid md:grid-cols-2 gap-4 grid-cols-1'>
                                {catalogues.map((c) => (
                                    <Link key={c._id} to={`/catalogue/${c._id}`}>{c.title}</Link>
                                ))}
                            </div>
                        </div>
                        <div className='flex flex-col gap-3 text-[#383434]'>
                            <h3 className='font-semibold'>Contact Us</h3>
                            <Link>Phone: 8824891530</Link>
                            <Link>Email: jssjewelers@gmail.com</Link>
                        </div>
                        <div className='flex flex-col gap-3 text-[#383434] max-w-full md:max-w-72'>
                            <h3 className='font-semibold'>Address</h3>
                            <Link>1st Floor, Narayan Plaza Pandit Shivdin Ji Ka Rasta, Kishanpole Bazar Rd, Jaipur, Rajasthan 302003</Link>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 relative py-2 justify-end'>
                    <span className='absolute w-full top-0 bg-black h-[1px] opacity-40'></span>
                    <a href='https://www.instagram.com/jssjewellers/' target='_blank'>
                        <Instagram className='text-white bg-[#9C1137] rounded-full p-1 cursor-pointer' />
                    </a>
                    <a href='https://www.facebook.com/jssjewellers' target='_blank'> </a>
                    <Facebook className='text-white bg-[#9C1137] rounded-full p-1 cursor-pointer' />
                </div>
            </div>
        </footer>
    )
}

export default Footer