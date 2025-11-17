import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addItemToCart, getUserCart, updateCartItemQuantity } from '../utils/cart';
import { usePopup } from '../context/PopupContext';
import { useEffect, useState } from 'react';

const ShoppingCard = ({ id, name, index, image, grossWeight, netWeight, sku }) => {
    const navigate = useNavigate();
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

    return (
        <div
            key={index}
            className="text-center flex flex-col gap-2 md:min-w-60 min-w-full max-w-72 shadow-xs shadow-gray-500 bg-transparent backdrop-blur-2xl rounded"
        >
            <span
                className='overflow-hidden max-h-62 cursor-pointer'
                onClick={() => navigate(`/product/${id}`)}
            >
                <img src={image} alt={name} className="w-full hover:scale-105 transition duration-300 h-62 object-center mb-2" />
            </span>

            <span className='pt-2 px-3'>
                <p className='text-start pt-2'>{name}</p>
                <p className='text-start pt-2'>Net Weight: {netWeight}</p>
                <p className='text-start pt-2'>Gross Weight: {grossWeight}</p>
            </span>

            <span className='flex justify-between items-center px-3 pb-4'>
                <p className='text-[#383434]'>{sku}</p>

                {/* Quantity Controls */}
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
    );
};

export default ShoppingCard;
