import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

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

const createOrderByAdmin = async (req, res) => {
    try {
        const { userId, products } = req.body;

        // Validate body
        if (!userId || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "User and products are required." });
        }

        // Validate user
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        // Validate each product
        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.productId}`
                });
            }
        }

        // Generate unique order ID (you can improve this if you want)
        const generatedOrderId = "ORD-" + Date.now();

        // Create order
        const newOrder = new Order({
            userId,
            products,
            orderId: generatedOrderId,
            orderStatus: "pending",
        });

        await newOrder.save();

        return res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
        });

    } catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

export {
    createOrder,
    getAllOrders,
    getUserOrders,
    createOrderByAdmin
}