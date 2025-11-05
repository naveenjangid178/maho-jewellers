import { Product } from "../models/product.model.js";  // Import Product model
import { Catalogue } from "../models/catalogue.model.js";  // Import Catalogue model
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import * as xlsx from "xlsx";
import ExcelJS from "exceljs"
import { Featured } from "../models/featured.model.js";
import mongoose from "mongoose";
import { TopProduct } from "../models/topProduct.model.js";
import { NewProduct } from "../models/newProduct.model.js";

const addProductsToCatalogue = async (req, res) => {
    try {
        const { catalogueId, productIds } = req.body;

        // Ensure the catalogueId and productIds are provided
        if (!catalogueId || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "Catalogue ID and an array of product IDs are required." });
        }

        // Validate the product IDs (optionally you can ensure the products exist)
        const products = await Product.find({ '_id': { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "One or more products not found." });
        }

        // Find the catalogue by ID
        const catalogue = await Catalogue.findById(catalogueId);
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        // Add the new products to the catalogue (this can be done using $addToSet to prevent duplicates)
        catalogue.products = [...new Set([...catalogue.products, ...productIds])]; // Prevent duplicates

        // Save the updated catalogue
        await catalogue.save();

        return res.status(200).json({
            message: "Products added to catalogue successfully.",
            catalogue: catalogue
        });
    } catch (error) {
        console.error("Error adding products to catalogue:", error);
        return res.status(500).json({
            message: "An error occurred while adding products to the catalogue.",
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from URL params

        // Validate that the ID is provided
        if (!id) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        // Find the product by its ID
        const product = await Product.findById(id);

        // If product not found, return an error
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Return the product details
        return res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the product.",
            error: error.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            message: "Products fetched successfully",
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            message: "An error occurred while fetching products.",
            error: error.message,
        });
    }
};

// Controller to create a product and add it to an existing catalogue
const createProductAndAddToCatalogue = async (req, res) => {
    try {
        // Extract product details and catalogueId from the request body
        const { catalogueId, name, price, weight, karat } = req.body;
        const images = req.file

        // Validate incoming data (basic validation)
        if (!catalogueId || !name || !price || !weight || !images || images.length === 0) {
            return res.status(400).json({ message: "All product details and catalogueId are required." });
        }

        const imageUrl = await uploadOnCloudinary(images.buffer)

        // 1. Create the new product
        const newProduct = new Product({
            name,
            price,
            weight,
            karat,
            images: [imageUrl]
        });

        // Save the new product to the database
        const savedProduct = await newProduct.save();

        // 2. Find the catalogue by its ID
        const catalogue = await Catalogue.findById(catalogueId);
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        // 3. Add the newly created product's ObjectId to the catalogue's products array
        catalogue.products.push(savedProduct._id);

        // Save the updated catalogue
        await catalogue.save();

        // Return a success response
        return res.status(201).json({
            message: "Product created and added to catalogue successfully.",
            product: savedProduct,
            catalogue: catalogue
        });
    } catch (error) {
        console.error("Error creating product and adding to catalogue:", error);
        return res.status(500).json({
            message: "An error occurred while creating the product and adding it to the catalogue.",
            error: error.message
        });
    }
};

// Controller to process Excel file, create products, and add them to catalogue
const createProductsFromExcelWithoutImage = async (req, res) => {
    try {
        const { catalogueId } = req.body;
        // const file = req.file; // Assuming file is uploaded via a form using multer (or another method)

        if (!catalogueId) {
            return res.status(400).json({ message: "Catalogue ID is required." });
        }

        // Read the Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Assuming the first sheet has the data
        const sheet = workbook.Sheets[sheetName];
        const productsData = xlsx.utils.sheet_to_json(sheet);

        if (productsData.length === 0) {
            return res.status(400).json({ message: "No product data found in the Excel file." });
        }

        // Find the catalogue by ID
        const catalogue = await Catalogue.findById(catalogueId);
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        const createdProducts = [];
        console.log(productsData)
        for (const productData of productsData) {
            // Extract product fields from the Excel row
            const { name, price, weight, images } = productData;

            if (!name || !price || !weight || !images) {
                continue; // Skip if any required field is missing in the Excel row
            }

            // Upload the image to Cloudinary
            const imageUrl = await uploadOnCloudinary(images.buffer);

            // Create a new product object
            const newProduct = new Product({
                name,
                price,
                weight,
                karat: "24K",
                images: [imageUrl]
            });

            // Save the product to the database
            const savedProduct = await newProduct.save();

            // Add the product to the catalogue's product array
            catalogue.products.push(savedProduct._id);

            createdProducts.push(savedProduct);
        }

        // Save the updated catalogue
        await catalogue.save();

        // Return the response with created products
        return res.status(201).json({
            message: `${createdProducts.length} products created and added to the catalogue successfully.`,
            products: createdProducts,
            catalogue: catalogue
        });
    } catch (error) {
        console.error("Error creating products from Excel:", error);
        return res.status(500).json({
            message: "An error occurred while processing the Excel file.",
            error: error.message
        });
    }
};

const createProductsFromExcel = async (req, res) => {
    try {
        const { catalogueId } = req.body;
        const file = req.file; // Multer memoryStorage (file.buffer available)

        if (!catalogueId) {
            return res.status(400).json({ message: "Catalogue ID is required." });
        }

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
                const row = range.tl.nativeRow + 1; // adjust for 1-based rows
                imageMap[row] = image.buffer;
            }
        });

        // Check catalogue exists
        const catalogue = await Catalogue.findById(catalogueId);
        if (!catalogue) {
            return res.status(404).json({ message: "Catalogue not found." });
        }

        const createdProducts = [];

        // Loop through rows (assuming row 1 = header)
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            const sku = row.getCell(1).value;
            const productCount = row.getCell(2).value;
            const netWeight = row.getCell(4).value;
            const grossWeight = row.getCell(5).value;
            const bead = row.getCell(6).value;
            const name = row.getCell(7).value;
            const description = row.getCell(8).value;
            const imageBuffer = imageMap[rowNumber];

            const existingProduct = await Product.findOne({ sku });
            if (existingProduct) {
                console.log(`SKU "${sku}" already exists. Linking to catalogue and skipping creation.`);

                // Avoid duplicating in catalogue.products
                if (!catalogue.products.includes(existingProduct._id)) {
                    catalogue.products.push(existingProduct._id);
                }

                createdProducts.push(existingProduct); // Optional: Track as processed
                continue;
            }

            // Skip invalid rows
            //   if (!name || !price || !weight || !imageBuffer || !Buffer.isBuffer(imageBuffer)) {
            //     console.log(`Skipping row ${rowNumber}: Missing required fields or image.`);
            //     continue;
            //   }

            // Upload image to Cloudinary
            let imageUrl;
            try {
                imageUrl = await uploadOnCloudinary(imageBuffer);
            } catch (err) {
                console.error(`Row ${rowNumber} image upload failed:`, err.message);
                continue;
            }

            // Create product
            const newProduct = new Product({
                sku: sku ?? "Unnamed Product",
                productCount: productCount,
                beads: bead,
                name : name ?? '',
                description: description ?? '',
                netWeight: netWeight ?? 0,
                grossWeight: grossWeight ?? 0,
                karat: "24K",
                images: [imageUrl],
            });

            const savedProduct = await newProduct.save();
            catalogue.products.push(savedProduct._id);
            createdProducts.push(savedProduct);
        }

        // Save catalogue with linked products
        await catalogue.save();

        return res.status(201).json({
            message: `${createdProducts.length} products created successfully.`,
            products: createdProducts,
        });
    } catch (error) {
        console.error("Error creating products from Excel:", error);
        return res.status(500).json({
            message: "An error occurred while processing the Excel file.",
            error: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // If you're using file upload (like for images)
        if (req.file) {
            const imageUrl = await uploadOnCloudinary(req.file.buffer);
            updateFields.images = [imageUrl]; // or append to existing array
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: "An error occurred while updating the product.",
            error: error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate the product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        // Remove the product from all catalogues
        await Catalogue.updateMany(
            {},
            {
                $pull: {
                    products: productId,
                },
            }
        );

        // Remove the product from the featured list
        await Featured.updateMany(
            {},
            {
                $pull: {
                    products: productId,
                },
            }
        );

        await TopProduct.updateMany(
            {},
            {
                $pull: {
                    products: productId,
                },
            }
        );

        await NewProduct.updateMany(
            {},
            {
                $pull: {
                    products: productId,
                },
            }
        );

        return res.status(200).json({
            message: "Product deleted successfully from all catalogues and featured list.",
            deletedProductId: productId,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the product.",
            error: error.message,
        });
    }
};

export {
    addProductsToCatalogue,
    getProductById,
    getAllProducts,
    createProductAndAddToCatalogue,
    createProductsFromExcel,
    updateProduct,
    deleteProduct
};
