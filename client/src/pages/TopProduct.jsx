import React, { useEffect, useState } from 'react'
import ShoppingCard from '../components/ShoppingCard'
import { useNavigate } from 'react-router-dom'
import { getTopProduct } from '../utils/topProduct'
import Navbar from '../components/Navbar'

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
        <>
        <Navbar />
        <section className='md:px-12 px-4 py-8 flex text-center flex-col'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-12 md:justify-between justify-items-center'>
                {topProduct.map((items, i) => <ShoppingCard name={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
            </div>
        </section>
        </>
    )
}

export default TopProduct