import React, { useEffect, useState } from 'react'
import ShoppingCard from '../components/ShoppingCard'
import { getFeaturedProduct } from '../utils/featured'
import { useNavigate } from 'react-router-dom'
import { useProductList } from '../context/ProductListContext'

const Featured = () => {
    const navigate = useNavigate()
    const [topProduct, setTopProduct] = useState([])
    const { setProductsForDetail } = useProductList();

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getFeaturedProduct();
                setTopProduct(response);
                setProductsForDetail(response);
            } catch (error) {
                console.error('Error fetching top product:', error);
            }
        }
        fetchCatalogues();
    }, []);

    return (
        <>
        <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
            <div className='flex flex-wrap gap-2 md:justify-between justify-items-center'>
                {topProduct.map((items, i) => <ShoppingCard id={items._id} name={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
            </div>
        </section>
        </>
    )
}

export default Featured