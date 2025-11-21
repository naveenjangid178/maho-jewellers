import { TopProduct } from "../models/topProduct.model.js";
import { Product } from "../models/product.model.js";
import ExcelJS from "exceljs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// const createTopProductsFromExcel = async (req, res) => {
//     try {
//         const file = req.file;

//         if (!file || !file.buffer) {
//             return res.status(400).json({ message: "Excel file is required." });
//         }

//         // Load workbook from buffer
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

//         const createdProducts = [];

//         // Loop through rows (starting from row 2 assuming row 1 is the header)
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

//             // Upload image to Cloudinary
//             let imageUrl;
//             try {
//                 imageUrl = await uploadOnCloudinary(imageBuffer);
//             } catch (err) {
//                 console.error(`Row ${rowNumber} image upload failed:`, err.message);
//                 continue;
//             }

//             // Create product and push the product instance to createdProducts
//             const newProduct = new Product({
//                 sku: sku ?? "Unnamed Product",
//                 productCount: productCount,
//                 beads: bead,
//                 name : name ?? '',
//                 description: description ?? '',
//                 netWeight: netWeight ?? 0,
//                 grossWeight: grossWeight ?? 0,
//                 karat: "24K", // Default value, you can modify as needed
//                 images: [imageUrl], // If you need to handle multiple images, modify as required
//             });

//             createdProducts.push(newProduct); // Push the instance into the array
//         }

//         // Insert products in batch into the database
//         const savedProducts = await Product.insertMany(createdProducts);

//         // Check if top product already exists
//         let topProduct = await TopProduct.findOne();
//         if (!topProduct) {
//             topProduct = new TopProduct({ products: savedProducts.map(product => product._id) });
//         } else {
//             topProduct.products.push(...savedProducts.map(product => product._id));
//         }

//         await topProduct.save();

//         return res.status(201).json({
//             message: `${savedProducts.length} products created successfully.`,
//             products: savedProducts,
//         });
//     } catch (error) {
//         console.error("Error creating products from Excel:", error);
//         return res.status(500).json({
//             message: "An error occurred while processing the Excel file.",
//             error: error.message,
//         });
//     }
// };

const createTopProductsFromExcel = async (req, res) => {
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

        const finalProducts = []; // All products to save or already updated
        const newProductsToInsert = []; // Only NEW ones for insertMany()

        // Loop through rows (starting from row 2 assuming row 1 is header)
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

            // ⭐ NEW LOGIC: Check if a matching product already exists
            const existingProduct = await Product.findOne({
                sku,
                netWeight,
                grossWeight
            });

            if (existingProduct) {
                console.log(`Updating existing product with SKU ${sku}`);

                // ⭐ Update name/title (if provided)
                if (name) existingProduct.name = name;

                // ⭐ Update description (optional)
                if (description) existingProduct.description = description;

                // ⭐ Increase quantity / productCount
                existingProduct.productCount = (existingProduct.productCount || 0) + productCount;

                await existingProduct.save();

                // Add to final list
                finalProducts.push(existingProduct);
                continue;
            }

            // ⭐ If not exists → create new product
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

            newProductsToInsert.push(newProduct);
        }

        // Insert NEW products
        const savedNewProducts = await Product.insertMany(newProductsToInsert);

        // Combine updated + newly created
        const allProcessedProducts = [...finalProducts, ...savedNewProducts];

        // Update or create TopProduct
        let topProduct = await TopProduct.findOne();
        if (!topProduct) {
            topProduct = new TopProduct({
                products: allProcessedProducts.map(p => p._id)
            });
        } else {
            allProcessedProducts.forEach(product => {
                if (!topProduct.products.includes(product._id)) {
                    topProduct.products.push(product._id);
                }
            });
        }

        await topProduct.save();

        return res.status(201).json({
            message: `${allProcessedProducts.length} products processed successfully.`,
            products: allProcessedProducts,
        });

    } catch (error) {
        console.error("Error creating products from Excel:", error);
        return res.status(500).json({
            message: "An error occurred while processing the Excel file.",
            error: error.message,
        });
    }
};


// const createTopProductsFromExcel = async (req, res) => {
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
//             const imageBuffer = imageMap[rowNumber];

//             if (!sku || !productCount || !imageBuffer || !Buffer.isBuffer(imageBuffer)) {
//                 console.log(`Skipping row ${rowNumber}: Missing required fields or image.`);
//                 continue;
//             }

//             // ✅ Check for existing product by SKU
//             const existingProduct = await Product.findOne({ sku });
//             if (existingProduct) {
//                 console.log(`SKU "${sku}" already exists. Linking to TopProduct and skipping creation.`);
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
//                 netWeight: netWeight ?? 0,
//                 grossWeight: grossWeight ?? 0,
//                 karat: "24K",
//                 images: [imageUrl],
//             });

//             newProductsToCreate.push(newProduct);
//         }

//         // Batch insert new products
//         const savedProducts = await Product.insertMany(newProductsToCreate);

//         // Find or create TopProduct document
//         let topProduct = await TopProduct.findOne();
//         if (!topProduct) {
//             topProduct = new TopProduct({ products: [] });
//         }

//         // Add both new and existing product IDs (avoid duplicates)
//         const allProductIds = [
//             ...savedProducts.map(p => p._id),
//             ...existingProductsToLink,
//         ];

//         // Avoid duplicates in the TopProduct list
//         const existingSet = new Set(TopProduct.products.map(id => id.toString()));
//         allProductIds.forEach(id => {
//             if (!existingSet.has(id.toString())) {
//                 TopProduct.products.push(id);
//             }
//         });

//         await TopProduct.save();

//         return res.status(201).json({
//             message: `${savedProducts.length} new products created. ${existingProductsToLink.length} existing products linked.`,
//             newProducts: savedProducts,
//             existingProducts: existingProductsToLink,
//         });

//     } catch (error) {
//         console.error("Error creating Top products from Excel:", error);
//         return res.status(500).json({
//             message: "An error occurred while processing the Excel file.",
//             error: error.message,
//         });
//     }
// };

const getTopProducts = async (req, res) => {
    try {
        // Find the top product catalog
        const topProduct = await TopProduct.findOne().populate({
            path: "products", // Populate the 'products' field with the Product details
            select: "sku productID beads netWeight grossWeight karat images name description", // Choose the fields to return for each product
        });

        if (!topProduct || topProduct.products.length === 0) {
            return res.status(404).json({ message: "No top product products found." });
        }

        // Return the list of top products
        return res.status(200).json({
            message: "top product products retrieved successfully.",
            products: topProduct.products,
        });
    } catch (error) {
        console.error("Error fetching top product products:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving the top product products.",
            error: error.message,
        });
    }
};

const removeProductFromTopProduct = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid or missing product ID." });
        }

        const topProduct = await TopProduct.findOne();
        if (!topProduct) {
            return res.status(404).json({ message: "top product products list not found." });
        }

        const initialCount = topProduct.products.length;

        // Remove productId from the array
        topProduct.products = topProduct.products.filter(
            (id) => id.toString() !== productId
        );

        if (topProduct.products.length === initialCount) {
            return res.status(404).json({ message: "Product not found in top product list." });
        }

        await topProduct.save();

        return res.status(200).json({
            message: "Product removed from top product successfully.",
            topProducts: topProduct.products,
        });
    } catch (error) {
        console.error("Error removing product from top product:", error);
        return res.status(500).json({
            message: "An error occurred while removing the product.",
            error: error.message,
        });
    }
};

export {
    createTopProductsFromExcel,
    getTopProducts,
    removeProductFromTopProduct
};