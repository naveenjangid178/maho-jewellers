import { UserProductView } from "../models/userProductView.model.js";

// Controller to create a user product view
const createUserProductView = async (req, res) => {
  try {
    const { phone, catalogue, viewStart, viewEnd } = req.body;

    // Validate input
    if (!phone || !catalogue || !viewStart || !viewEnd) {
      return res.status(400).json({ message: "Phone, catalogue, viewStart, and viewEnd are required." });
    }

    // Calculate the time spent (in seconds)
    const start = new Date(viewStart);
    const end = new Date(viewEnd);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format for viewStart or viewEnd." });
    }

    const timeSpent = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (timeSpent < 0) {
      return res.status(400).json({ message: "viewEnd must be after viewStart." });
    }

    // Create the UserProductView entry
    const userProductView = new UserProductView({
      phone,
      catalogue,
      viewStart: start,
      viewEnd: end,
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

const getAllUserProductViews = async (req, res) => {
  try {
    // Fetch all records from the UserProductView collection
    const userProductViews = await UserProductView.find();

    if (!userProductViews || userProductViews.length === 0) {
      return res.status(404).json({ message: "No user product views found." });
    }

    return res.status(200).json({
      message: "User product views retrieved successfully.",
      userProductViews,
    });
  } catch (error) {
    console.error("Error retrieving user product views:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving user product views.",
      error: error.message,
    });
  }
};


export {
  createUserProductView,
  getAllUserProductViews
};