import { useEffect, useState } from "react";
import { getUserCart, addItemToCart, updateCartItemQuantity } from "../utils/cart";
import { usePopup } from "../context/PopupContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const { setIsPopupVisible } = usePopup();
    const navigate = useNavigate();
    const user = localStorage.getItem("user");

    useEffect(() => {
        if (user) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        const data = await getUserCart(user);
        if (!data.error) {
            setCart(data.cart);
        }
    };

    const handleIncrease = async (productId, currentQty) => {
        if (currentQty >= 5) return;
        await updateCartItemQuantity(user, productId, currentQty + 1);
        fetchCart();
    };

    const handleDecrease = async (productId, currentQty) => {
        if (currentQty <= 1) return;
        await updateCartItemQuantity(user, productId, currentQty - 1); // Or use update endpoint
        fetchCart();
    };

    const handleRemove = async (productId) => {
        await fetch(`${import.meta.env.VITE_API_URL}/cart/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user, productId })
        });
        fetchCart();
    };

    if (!cart || cart.products.length === 0) {
        return <p className="text-center mt-10">Your cart is empty.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl mb-4">Your Cart</h2>
            <div className="flex flex-col gap-4">
                {cart.products.map((item) => (
                    <div
                        key={item.productId._id}
                        className="flex items-center justify-between p-4 bg-white shadow rounded"
                    >
                        <div
                            className="flex items-center gap-4 cursor-pointer"
                            onClick={() =>
                                navigate(`/product/${item.productId._id}`)
                            }
                        >
                            <img
                                src={item.productId.images[0]}
                                alt={item.productId.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div>
                                <p>{item.productId.name}</p>
                                <p className="text-sm text-gray-500">
                                    SKU: {item.productId.sku}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Net: {item.productId.netWeight}, Gross:{" "}
                                    {item.productId.grossWeight}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <span className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handleDecrease(
                                            item.productId._id,
                                            item.quantity
                                        )
                                    }
                                    className="bg-gray-300 px-2 rounded"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        handleIncrease(
                                            item.productId._id,
                                            item.quantity
                                        )
                                    }
                                    className="bg-[#9C1137] text-white px-2 rounded"
                                    disabled={item.quantity >= 5}
                                >
                                    +
                                </button>
                            </span>
                            <button
                                onClick={() =>
                                    handleRemove(item.productId._id)
                                }
                                className="bg-red-500 text-white px-2 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cart;
