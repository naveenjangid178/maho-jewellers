import mongoose from "mongoose";
import { Catalogue } from "../models/catalogue.model.js"; // Adjust import path as needed
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

// Controller to create a new catalogue
const createCatalogue = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file

        // Validate incoming data (this is a basic check, adjust as necessary)
        if (!title) {
            return res.status(400).json({ message: "Title and createdBy are required" });
        }
        const imageUrl = await uploadOnCloudinary(image.buffer);

        // Create the catalogue with an empty products array
        const newCatalogue = new Catalogue({
            title,
            description,
            image: imageUrl,
            products: [], // Ensure products array is empty
        });

        // Save the catalogue to the database
        const savedCatalogue = await newCatalogue.save();

        return res.status(201).json({
            message: "Catalogue created successfully",
            catalogue: savedCatalogue
        });
    } catch (error) {
        console.error("Error creating catalogue:", error);
        return res.status(500).json({
            message: "An error occurred while creating the catalogue",
            error: error.message
        });
    }
};

const updateCatalogue = async (req, res) => {
    try {
        const { id } = req.params; // Get catalogue ID from URL params
        const { title, description, image } = req.body; // Fields to update

        // Find the catalogue by ID
        const catalogue = await Catalogue.findById(id);

        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found" });
        }

        // Update fields if they are provided
        if (title !== undefined) catalogue.title = title;
        if (description !== undefined) catalogue.description = description;
        if (image !== undefined) {
            const imageUrl = await uploadOnCloudinary(image.buffer)
            catalogue.image = imageUrl;
        }

        // Save the updated catalogue
        const updatedCatalogue = await catalogue.save();

        return res.status(200).json({
            message: "Catalogue updated successfully",
            catalogue: updatedCatalogue
        });
    } catch (error) {
        console.error("Error updating catalogue:", error);
        return res.status(500).json({
            message: "An error occurred while updating the catalogue",
            error: error.message
        });
    }
};

const getCatalogueDetails = async (req, res) => {
    try {
        const { id } = req.params; // Get the catalogue ID from URL params

        // Validate that the ID is provided
        if (!id) {
            return res.status(400).json({ message: "Catalogue ID is required." });
        }

        // Find the catalogue by its ID and populate the products
        const catalogue = await Catalogue.findById(id).populate("products");

        // If catalogue not found, return an error
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        // Return the catalogue details with populated products
        return res.status(200).json({
            catalogue
        });
    } catch (error) {
        console.error("Error fetching catalogue:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the catalogue.",
            error: error.message,
        });
    }
};

const getAllCatalogues = async (req, res) => {
    try {
        const catalogues = await Catalogue.find();

        const formattedCatalogues = catalogues.map((catalogue) => ({
            _id: catalogue._id,
            title: catalogue.title,
            description: catalogue.description,
            image: catalogue.image,
            productCount: catalogue.products.length,
        }));

        return res.status(200).json({ catalogues: formattedCatalogues });
    } catch (error) {
        console.error("Error fetching catalogues:", error);
        return res.status(500).json({
            message: "An error occurred while fetching catalogues.",
            error: error.message,
        });
    }
};

const removeProductFromCatalogue = async (req, res) => {
    try {
        const { catalogueId, productId } = req.params;

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(catalogueId) ||
            !mongoose.Types.ObjectId.isValid(productId)
        ) {
            return res.status(400).json({ message: "Invalid catalogueId or productId." });
        }

        // Find the catalogue
        const catalogue = await Catalogue.findById(catalogueId);
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        // Remove product from the catalogue's products array
        const initialLength = catalogue.products.length;
        catalogue.products = catalogue.products.filter(
            (id) => id.toString() !== productId
        );

        if (catalogue.products.length === initialLength) {
            return res.status(404).json({ message: "Product not found in this catalogue." });
        }

        // Save updated catalogue
        await catalogue.save();

        return res.status(200).json({
            message: "Product removed from catalogue successfully.",
            updatedCatalogue: catalogue,
        });
    } catch (error) {
        console.error("Error removing product from catalogue:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
};

const deleteCatalogue = async (req, res) => {
    try {
        const { catalogueId } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(catalogueId)) {
            return res.status(400).json({ message: "Invalid catalogue ID." });
        }

        // Find the catalogue
        const catalogue = await Catalogue.findById(catalogueId);
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        // OPTIONAL: Delete all associated products (be careful!)
        // await Product.deleteMany({ _id: { $in: catalogue.products } });

        // Delete the catalogue itself
        await Catalogue.findByIdAndDelete(catalogueId);

        // Remove access to this catalogue from all users
        await User.updateMany(
            {},
            {
                $pull: {
                    allowedCatalogues: { catalogue: catalogueId }
                }
            }
        );

        return res.status(200).json({
            message: "Catalogue deleted successfully.",
            deletedCatalogueId: catalogueId,
        });
    } catch (error) {
        console.error("Error deleting catalogue:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the catalogue.",
            error: error.message,
        });
    }
};


export {
    createCatalogue,
    getCatalogueDetails,
    updateCatalogue,
    getAllCatalogues,
    removeProductFromCatalogue,
    deleteCatalogue
};
