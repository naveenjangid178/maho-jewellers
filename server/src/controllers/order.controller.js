import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";

const createOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Create a custom order ID
        const orderId = "ORD-" + Date.now();

        // Create the order
        const newOrder = await Order.create({
            userId,
            products: cart.products,
            orderId,
            orderStatus: "pending"
        });

        // Clear the cart after order creation (optional)
        cart.products = [];
        await cart.save();

        return res.status(201).json({
            message: "Order created successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId").populate("products.productId");

        return res.status(200).json({
            message: "All orders fetched successfully",
            orders
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body; // or req.params.userId if using URL param

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const orders = await Order.find({ userId })
            .populate("products.productId") // populate product details
            .sort({ createdAt: -1 });      // latest orders first

        return res.status(200).json({
            message: "User orders fetched successfully",
            orders
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    createOrder,
    getAllOrders,
    getUserOrders
}