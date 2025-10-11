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
        <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-12 justify-between'>
                {topProduct.map((items, i) => <ShoppingCard name={items.sku} image={items.images[0]} index={i} price={items.netWeight} />)}
            </div>
        </section>
        </>
    )
}

export default TopProduct