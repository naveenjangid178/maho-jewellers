import React, { useEffect, useState } from 'react'
import { newArrivals } from '../details'
import ShoppingCard from './ShoppingCard'
import { useNavigate } from 'react-router-dom'
import { getTopProduct } from '../utils/topProduct'

const TopProduct = () => {
    const navigate = useNavigate()
    const [topProduct, setTopProduct] = useState([])

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getTopProduct();
                setTopProduct(response);
            } catch (error) {
                console.error('Error fetching top product:', error);
            }
        }
        fetchCatalogues();
    }, []);
    
    return (
        <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
            <h3 className='text-[#9C1137] text-3xl py-4 font-[Playfair-Display] font-semibold'>Top Product</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-12 md:justify-between justify-items-center'>
                {topProduct.slice(0, 5).map((items, i) => <ShoppingCard name={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
            </div>
            <span className='py-1 border border-[#9C1137] w-fit m-auto mt-8'>
                <button
                    className='text-[#9C1137] text-center hover:font-medium  px-8 font-normal cursor-pointer hover:scale-110 transform duration-100 ease-in-out'
                    onClick={() => navigate("/top-products")}
                >View All</button>
            </span>
        </section>
    )
}

export default TopProduct