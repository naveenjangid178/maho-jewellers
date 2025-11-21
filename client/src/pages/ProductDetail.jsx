import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useProductList } from '../context/ProductListContext';
import ShoppingCard from '../components/ShoppingCard';
import { addItemToCart, getUserCart, updateCartItemQuantity } from '../utils/cart';
import { ShoppingCart } from 'lucide-react';
import { usePopup } from '../context/PopupContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { products } = useProductList();
    const { setIsPopupVisible } = usePopup();
    const user = localStorage.getItem('user');

    const [cart, setCart] = useState(null); // store user's cart
    const [quantity, setQuantity] = useState(0); // quantity of this item

    // Load user cart on mount
    useEffect(() => {
        if (user) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        const data = await getUserCart(user);
        if (!data.error && data.cart) {
            setCart(data.cart);

            // Check if this product is already in cart
            const item = data.cart.products.find(p => p.productId._id === id);
            setQuantity(item ? item.quantity : 0);
        }
    };

    const handleAdd = async () => {
        if (!user) {
            setIsPopupVisible(true);
            return;
        }

        if (quantity >= 5) return; // Max quantity = 5

        const data = await addItemToCart(user, id, 1);

        if (data.error) {
            alert(data.error);
        } else {
            setQuantity(prev => Math.min(prev + 1, 5)); // update quantity locally
            fetchCart(); // refresh cart
        }
    };

    const handleIncrease = async () => {
        if (quantity >= 5) return;
        await updateCartItemQuantity(user, id, quantity + 1);
        fetchCart();
    };

    const handleDecrease = async () => {
        if (quantity <= 1) return;

        // Reduce quantity by 1
        const data = await updateCartItemQuantity(user, id, quantity - 1); // backend should handle negative quantity properly

        if (!data.error) {
            setQuantity(prev => prev - 1);
            fetchCart();
        }
    };

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
                        <span>
                            {quantity > 0 ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDecrease}
                                        className="bg-gray-300 px-2 rounded"
                                    >-</button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={handleIncrease}
                                        className="bg-[#9C1137] text-white px-2 rounded"
                                        disabled={quantity >= 5}
                                    >+</button>
                                </div>
                            ) : (
                                <ShoppingCart
                                    onClick={handleAdd}
                                    className='bg-[#9C1137] text-white rounded-full p-1 cursor-pointer'
                                />
                            )}
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
