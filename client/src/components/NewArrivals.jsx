import React, { useEffect, useState } from 'react'
import ShoppingCard from './ShoppingCard'
import { useNavigate } from 'react-router-dom'
import { getnewArrival } from '../utils/newArrivals'

const NewArrivals = () => {
    const navigate = useNavigate()
    const [topProduct, setTopProduct] = useState([])

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getnewArrival();
                setTopProduct(response);
            } catch (error) {
                console.error('Error fetching top product:', error);
            }
        }
        fetchCatalogues();
    }, []);

    return (
        <section className='bg-[#F6F3EE] md:px-12 px-4 py-8 flex flex-col gap-8'>
            <h3 className='text-[#9C1137] text-3xl font-[Platypi] py-4'>New Arrivals</h3>
            <div className='flex overflow-x-auto md:overflow-visible gap-2 md:gap-12 md:justify-between justify-items-center'>
                <div className="md:min-w-65 min-w-full max-w-72 min-h-100 py-10 bg-[#f3ecde] rounded p-4 flex flex-col justify-between">
                    <span className='flex flex-col gap-1'>
                        <p className='font-thin text-sm text-gray-700'>The Hot Pics</p>
                        <h3 className='text-3xl'>Best Sellers</h3>
                    </span>
                    <span className='flex flex-col gap-4'>
                        <p>Get charmed by JSS bestseller - Earcuffs, Ear crawlers, and Hair jewellery, where timeless elegance meets expert craftsmanship.</p>
                        <button
                            className='text-white bg-[#262626] text-center hover:font-medium py-3 px-8 font-normal max-w-36 rounded cursor-pointer transform duration-100 ease-in-out'
                            onClick={() => navigate("/new-products")}
                        >Shop Now</button>
                    </span>
                </div>
                {topProduct.slice(0, 3).map((items, i) => <ShoppingCard name={items.name} sku={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
            </div>
        </section>
    )
}

export default NewArrivals