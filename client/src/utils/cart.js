import axios from "axios";

const addItemToCart = async (userId, productId, quantity = 1) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/cart/`,
            {
                userId,
                productId,
                quantity
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error adding item to cart:", error);

        // Return error message from server if available
        if (error.response && error.response.data) {
            return { error: error.response.data.message };
        }

        return { error: "Failed to add item to cart" };
    }
};

const getUserCart = async (userId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/cart/${userId}`
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return { error: "Failed to load cart" };
    }
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/cart/update-quantity`, {
            userId,
            productId,
            quantity
        });

        return response.data;

    } catch (error) {
        console.error("Error updating cart item:", error);

        if (error.response && error.response.data) {
            return { error: error.response.data.message };
        }

        return { error: "Failed to update cart item" };
    }
};


export {
    addItemToCart,
    getUserCart,
    updateCartItemQuantity
}