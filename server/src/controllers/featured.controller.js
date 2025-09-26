import { Featured } from "../models/featured.model.js";
import { Product } from "../models/product.model.js";
import ExcelJS from "exceljs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createFeaturedProductsFromExcel = async (req, res) => {
    try {
        const file = req.file;

        if (!file || !file.buffer) {
            return res.status(400).json({ message: "Excel file is required." });
        }

        // Load workbook from buffer
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Map row numbers to image buffers
        const imageMap = {};
        worksheet.getImages().forEach(({ range, imageId }) => {
            const image = workbook.getImage(imageId);
            if (image && image.buffer) {
                const row = range.tl.nativeRow + 1;
                imageMap[row] = image.buffer;
            }
        });

        const createdProducts = [];

        // Loop through rows (starting from row 2 assuming row 1 is the header)
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            const sku = row.getCell(1).value;
            const productID = row.getCell(2).value;
            const netWeight = row.getCell(4).value;
            const grossWeight = row.getCell(5).value;
            const bead = row.getCell(6).value;
            const imageBuffer = imageMap[rowNumber];

            if (!sku || !productID || !imageBuffer || !Buffer.isBuffer(imageBuffer)) {
                console.log(`Skipping row ${rowNumber}: Missing required fields or image.`);
                continue;
            }

            // Upload image to Cloudinary
            let imageUrl;
            try {
                imageUrl = await uploadOnCloudinary(imageBuffer);
            } catch (err) {
                console.error(`Row ${rowNumber} image upload failed:`, err.message);
                continue;
            }

            // Create product and push the product instance to createdProducts
            const newProduct = new Product({
                sku: sku ?? "Unnamed Product",
                productID: productID,
                beads: bead,
                netWeight: netWeight ?? 0,
                grossWeight: grossWeight ?? 0,
                karat: "24K", // Default value, you can modify as needed
                images: [imageUrl], // If you need to handle multiple images, modify as required
            });

            createdProducts.push(newProduct); // Push the instance into the array
        }

        // Insert products in batch into the database
        const savedProducts = await Product.insertMany(createdProducts);

        // Check if Featured already exists
        let featured = await Featured.findOne();
        if (!featured) {
            featured = new Featured({ products: savedProducts.map(product => product._id) });
        } else {
            featured.products.push(...savedProducts.map(product => product._id));
        }

        await featured.save();

        return res.status(201).json({
            message: `${savedProducts.length} products created successfully.`,
            products: savedProducts,
        });
    } catch (error) {
        console.error("Error creating products from Excel:", error);
        return res.status(500).json({
            message: "An error occurred while processing the Excel file.",
            error: error.message,
        });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        // Find the featured catalog
        const featured = await Featured.findOne().populate({
            path: "products", // Populate the 'products' field with the Product details
            select: "sku productID beads netWeight grossWeight karat images", // Choose the fields to return for each product
        });

        if (!featured || featured.products.length === 0) {
            return res.status(404).json({ message: "No featured products found." });
        }

        // Return the list of featured products
        return res.status(200).json({
            message: "Featured products retrieved successfully.",
            products: featured.products,
        });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving the featured products.",
            error: error.message,
        });
    }
};

const removeProductFromFeatured = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid or missing product ID." });
        }

        const featured = await Featured.findOne();
        if (!featured) {
            return res.status(404).json({ message: "Featured products list not found." });
        }

        const initialCount = featured.products.length;

        // Remove productId from the array
        featured.products = featured.products.filter(
            (id) => id.toString() !== productId
        );

        if (featured.products.length === initialCount) {
            return res.status(404).json({ message: "Product not found in featured list." });
        }

        await featured.save();

        return res.status(200).json({
            message: "Product removed from featured successfully.",
            featuredProducts: featured.products,
        });
    } catch (error) {
        console.error("Error removing product from featured:", error);
        return res.status(500).json({
            message: "An error occurred while removing the product.",
            error: error.message,
        });
    }
};

export {
    createFeaturedProductsFromExcel,
    getFeaturedProducts,
    removeProductFromFeatured
};