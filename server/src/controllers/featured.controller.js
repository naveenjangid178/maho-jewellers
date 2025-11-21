import { Featured } from "../models/featured.model.js";
import { Product } from "../models/product.model.js";
import ExcelJS from "exceljs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// const createFeaturedProductsFromExcel = async (req, res) => {
//     try {
//         const file = req.file;

//         if (!file || !file.buffer) {
//             return res.status(400).json({ message: "Excel file is required." });
//         }

//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.load(file.buffer);
//         const worksheet = workbook.worksheets[0];

//         // Map row numbers to image buffers
//         const imageMap = {};
//         worksheet.getImages().forEach(({ range, imageId }) => {
//             const image = workbook.getImage(imageId);
//             if (image && image.buffer) {
//                 const row = range.tl.nativeRow + 1;
//                 imageMap[row] = image.buffer;
//             }
//         });

//         const newProductsToCreate = [];
//         const existingProductsToLink = [];

//         for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
//             const row = worksheet.getRow(rowNumber);

//             const sku = row.getCell(1).value;
//             const productCount = row.getCell(2).value;
//             const netWeight = row.getCell(4).value;
//             const grossWeight = row.getCell(5).value;
//             const bead = row.getCell(6).value;
//             const name = row.getCell(7).value;
//             const description = row.getCell(8).value;
//             const imageBuffer = imageMap[rowNumber];

//             if (!sku || !productCount || !imageBuffer || !Buffer.isBuffer(imageBuffer)) {
//                 console.log(`Skipping row ${rowNumber}: Missing required fields or image.`);
//                 continue;
//             }

//             // ✅ Check for existing product by SKU
//             const existingProduct = await Product.findOne({ 
//                 sku: sku,
//                 netWeight: netWeight,
//                 grossWeight: grossWeight
//              });
//             if (existingProduct) {
//                 existingProduct.name = name;
//                 existingProduct.description = description;
//                 existingProduct.productCount = productCount;

//                 await existingProduct.save();

//                 console.log(`SKU "${sku}" already exists. Linking to featured and skipping creation.`);
//                 existingProductsToLink.push(existingProduct._id);
//                 continue;
//             }

//             // Upload image to Cloudinary
//             let imageUrl;
//             try {
//                 imageUrl = await uploadOnCloudinary(imageBuffer);
//             } catch (err) {
//                 console.error(`Row ${rowNumber} image upload failed:`, err.message);
//                 continue;
//             }

//             // Prepare product for batch insert
//             const newProduct = new Product({
//                 sku,
//                 productCount,
//                 beads: bead,
//                 name : name ?? '',
//                 description: description ?? '',
//                 netWeight: netWeight ?? 0,
//                 grossWeight: grossWeight ?? 0,
//                 karat: "24K",
//                 images: [imageUrl],
//             });

//             newProductsToCreate.push(newProduct);
//         }

//         // Batch insert new products
//         const savedProducts = await Product.insertMany(newProductsToCreate);

//         // Find or create Featured document
//         let featured = await Featured.findOne();
//         if (!featured) {
//             featured = new Featured({ products: [] });
//         }

//         // Add both new and existing product IDs (avoid duplicates)
//         const allProductIds = [
//             ...savedProducts.map(p => p._id),
//             ...existingProductsToLink,
//         ];

//         // Avoid duplicates in the featured list
//         const existingSet = new Set(featured.products.map(id => id.toString()));
//         allProductIds.forEach(id => {
//             if (!existingSet.has(id.toString())) {
//                 featured.products.push(id);
//             }
//         });

//         await featured.save();

//         return res.status(201).json({
//             message: `${savedProducts.length} new products created. ${existingProductsToLink.length} existing products linked.`,
//             newProducts: savedProducts,
//             existingProducts: existingProductsToLink,
//         });

//     } catch (error) {
//         console.error("Error creating featured products from Excel:", error);
//         return res.status(500).json({
//             message: "An error occurred while processing the Excel file.",
//             error: error.message,
//         });
//     }
// };

const createFeaturedProductsFromExcel = async (req, res) => {
    try {
        const file = req.file;

        if (!file || !file.buffer) {
            return res.status(400).json({ message: "Excel file is required." });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Map row numbers => image buffers
        const imageMap = {};
        worksheet.getImages().forEach(({ range, imageId }) => {
            const image = workbook.getImage(imageId);
            if (image && image.buffer) {
                const row = range.tl.nativeRow + 1;
                imageMap[row] = image.buffer;
            }
        });

        const newProductsToCreate = [];
        const updatedExistingProducts = []; // store updated products to link

        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            const sku = row.getCell(1).value;
            const productCount = Number(row.getCell(2).value) || 0;
            const netWeight = Number(row.getCell(4).value) || 0;
            const grossWeight = Number(row.getCell(5).value) || 0;
            const bead = row.getCell(6).value;
            const name = row.getCell(7).value;
            const description = row.getCell(8).value;

            const imageBuffer = imageMap[rowNumber];

            if (!sku || !productCount || !imageBuffer || !Buffer.isBuffer(imageBuffer)) {
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

            // ⭐ Check if product already exists (sku + weights)
            const existingProduct = await Product.findOne({
                sku,
                netWeight,
                grossWeight
            });

            if (existingProduct) {
                console.log(`Updating existing product with SKU ${sku}`);

                // Update basic fields
                if (name) existingProduct.name = name;
                if (description) existingProduct.description = description;
                existingProduct.productCount = (existingProduct.productCount || 0) + productCount;

                await existingProduct.save();

                updatedExistingProducts.push(existingProduct._id);
                continue; // Continue to next row
            }

            // ⭐ Create new product when not existing
            const newProduct = new Product({
                sku,
                productCount,
                beads: bead,
                name: name ?? "",
                description: description ?? "",
                netWeight,
                grossWeight,
                karat: "24K",
                images: [imageUrl],
            });

            newProductsToCreate.push(newProduct);
        }

        // Insert NEW products into DB
        const savedNewProducts = await Product.insertMany(newProductsToCreate);

        // Find or create featured collection
        let featured = await Featured.findOne();
        if (!featured) {
            featured = new Featured({ products: [] });
        }

        // Combine product IDs (new + updated)
        const allProductIds = [
            ...savedNewProducts.map(p => p._id),
            ...updatedExistingProducts,
        ];

        // Avoid duplicates
        const existing = new Set(featured.products.map(id => id.toString()));
        allProductIds.forEach(id => {
            if (!existing.has(id.toString())) {
                featured.products.push(id);
            }
        });

        await featured.save();

        return res.status(201).json({
            message: `${savedNewProducts.length} new products created. ${updatedExistingProducts.length} existing products updated & linked.`,
            newProducts: savedNewProducts,
            updatedProducts: updatedExistingProducts,
        });

    } catch (error) {
        console.error("Error creating featured products from Excel:", error);
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
            select: "sku productID beads netWeight grossWeight karat images name description", // Choose the fields to return for each product
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