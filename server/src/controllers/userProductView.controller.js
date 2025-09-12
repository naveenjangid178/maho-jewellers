import { UserProductView } from "../models/userProductView.model.js";  // Adjust import path as needed
import { Product } from "../models/product.model.js";  // Adjust import path as needed
import { User } from "../models/user.model.js";  // Adjust import path as needed

// Controller to create a user product view
const createUserProductView = async (req, res) => {
  try {
    const { userId, productId, viewStart, viewEnd } = req.body;

    // Validate input
    if (!userId || !productId || !viewStart || !viewEnd) {
      return res.status(400).json({ message: "UserId, productId, viewStart, and viewEnd are required." });
    }

    // Ensure that the user and product exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Calculate the time spent (in seconds)
    const timeSpent = Math.floor((new Date(viewEnd).getTime() - new Date(viewStart).getTime()) / 1000);

    // Create the UserProductView entry
    const userProductView = new UserProductView({
      userId,
      productId,
      viewStart: new Date(viewStart),
      viewEnd: new Date(viewEnd),
      timeSpent
    });

    // Save the record to the database
    await userProductView.save();

    return res.status(201).json({
      message: "User product view created successfully.",
      userProductView
    });

  } catch (error) {
    console.error("Error creating user product view:", error);
    return res.status(500).json({
      message: "An error occurred while creating the user product view.",
      error: error.message
    });
  }
};

export { createUserProductView };
