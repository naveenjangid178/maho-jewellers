import React, { useEffect, useState } from 'react'
import ShoppingCard from './ShoppingCard'
import { getFeaturedProduct } from '../utils/featured'
import { useNavigate } from 'react-router-dom'

const Featured = () => {
    const navigate = useNavigate()
    const [topProduct, setTopProduct] = useState([])

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getFeaturedProduct();
                setTopProduct(response);
            } catch (error) {
                console.error('Error fetching top product:', error);
            }
        }
        fetchCatalogues();
    }, []);

    return (
        <section className='bg-[#F6F3EE] md:px-12 px-4 py-8 flex flex-col gap-8'>
            <h3 className='text-[#9C1137] text-3xl font-[Platypi] py-4'>Featured Products</h3>
            <div className='flex overflow-x-auto md:overflow-visible gap-2 md:gap-12 md:justify-between justify-items-center'>
                <div className="md:min-w-65 min-w-full max-w-72 min-h-100 py-10 bg-[#f3ecde] rounded p-4 flex flex-col justify-between">
                    <span className='flex flex-col gap-1'>
                        <p className='font-thin text-sm text-gray-700'>The Hot Pics</p>
                        <h3 className='text-3xl'>Featured Products</h3>
                    </span>
                    <span className='flex flex-col gap-4'>
                        <p>
                            A curated selection of our most distinguished designs. Handcrafted with timeless artistry, each piece reflects the essence of Jaipur’s royal heritage.
                        </p>
                        <button
                            className='text-white bg-[#262626] text-center hover:font-medium py-3 px-8 font-normal max-w-36 rounded cursor-pointer transform duration-100 ease-in-out'
                            onClick={() => navigate("/featured-products")}
                        >Shop Now</button>
                    </span>
                </div>
                {topProduct.slice(0, 3).map((items, i) => <ShoppingCard name={items.name} sku={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
            </div>
            {/* <span className='py-1 border border-[#9C1137] w-fit m-auto mt-8'>
                <button
                    className='text-[#9C1137] text-center hover:font-medium  px-8 font-normal cursor-pointer hover:scale-110 transform duration-100 ease-in-out'
                    onClick={() => navigate("/featured-products")}
                >View All</button>
            </span> */}
        </section>
    )
}

export default Featured