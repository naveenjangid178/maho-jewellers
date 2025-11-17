import { Cart } from "../models/cart.model.js";  // Adjust path as needed
import { Product } from "../models/product.model.js";  // Adjust path as needed

// Controller to add items to the user's cart
const addItemToCart = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body; // Get user ID, product ID, and quantity from request body

        // Validate input
        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required." });
        }

        // Find the product to ensure it exists in the Product collection
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists, create a new cart
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
            await cart.save();
            return res.status(201).json({ message: "Item added to cart", cart });
        }

        // Check if the product already exists in the user's cart
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex > -1) {
            // If the product exists, update the quantity
            cart.products[productIndex].quantity += quantity;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.products.push({ productId, quantity });
        }

        // Save the updated cart
        const updatedCart = await cart.save();
        return res.status(200).json({ message: "Item added/updated in cart", cart: updatedCart });

    } catch (error) {
        console.error("Error adding item to cart:", error);
        return res.status(500).json({
            message: "An error occurred while adding the item to the cart.",
            error: error.message,
        });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body; // Get user ID, product ID, and quantity from request body

        // Validate input
        if (!userId || !productId || quantity === undefined || quantity < 1) {
            return res.status(400).json({ message: "User ID, Product ID, and a valid quantity are required." });
        }

        // Find the product to ensure it exists in the Product collection
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        // Update the quantity of the product in the cart
        cart.products[productIndex].quantity = quantity;

        // Save the updated cart
        const updatedCart = await cart.save();
        return res.status(200).json({ message: "Cart item updated", cart: updatedCart });

    } catch (error) {
        console.error("Error updating cart item:", error);
        return res.status(500).json({
            message: "An error occurred while updating the cart item.",
            error: error.message,
        });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body; // Get user ID and product ID from the request body

        // Validate input
        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required." });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        const updatedCart = await cart.save();
        return res.status(200).json({ message: "Item removed from cart", cart: updatedCart });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(500).json({
            message: "An error occurred while removing the item from the cart.",
            error: error.message,
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;  // Get userId from the request body

        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        // If cart not found, return a message
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this user." });
        }

        // Clear the products array
        cart.products = [];

        // Save the updated cart
        await cart.save();

        // Return the updated cart (now empty)
        return res.status(200).json({
            message: "Cart cleared successfully.",
            cart
        });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({
            message: "An error occurred while clearing the cart.",
            error: error.message,
        });
    }
};

const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params; // getting userId from URL params

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const cart = await Cart.findOne({ userId }).populate("products.productId");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this user." });
        }

        return res.status(200).json({
            message: "User cart fetched successfully",
            cart,
        });

    } catch (error) {
        console.error("Error fetching user cart:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the user's cart.",
            error: error.message,
        });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate("products.productId");

        return res.status(200).json({
            message: "All carts fetched successfully",
            carts,
        });

    } catch (error) {
        console.error("Error fetching all carts:", error);
        return res.status(500).json({
            message: "An error occurred while fetching all carts.",
            error: error.message,
        });
    }
};

export {
    addItemToCart,
    clearCart,
    updateCartItemQuantity,
    removeItemFromCart,
    getUserCart
};