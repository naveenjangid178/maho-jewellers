import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useProductList } from '../context/ProductListContext';
import ShoppingCard from '../components/ShoppingCard';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { products } = useProductList();
    

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-600 text-lg">
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
                Product not found.
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="md:px-24 px-4 py-8">
                <div className='flex md:flex-row flex-col md:gap-24 gap-4 border-b pb-4'>
                    <img
                        src={product.images?.[0] || "/no-image.png"}
                        alt={product.sku}
                        className="w-full md:w-1/2 max-h-[400px] object-cover rounded-xl shadow-md"
                    />
                    <div className='flex flex-col gap-4 justify-center w-full md:w-1/2'>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            {product.sku}
                        </h1>
                        <span className='flex flex-col md:flex-row md:gap-12'>
                            <p>
                                <span className="font-semibold">Net Weight: </span>
                                {product.netWeight} g
                            </p>

                            <p>
                                <span className="font-semibold">Gross Weight: </span>
                                {product.grossWeight} g
                            </p>
                        </span>
                    </div>
                </div>

                {products && <div className='pt-4 flex flex-wrap gap-2 md:justify-between justify-items-center'>
                    {products.map((items, i) => <ShoppingCard id={items._id} name={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
                </div>}
            </div>
        </>
    );
};

export default ProductDetail;
