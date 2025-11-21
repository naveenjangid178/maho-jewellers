import { NewProduct } from "../models/newProduct.model.js";
import { Product } from "../models/product.model.js";
import ExcelJS from "exceljs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// const createNewProductsFromExcel = async (req, res) => {
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
//                 name: name ?? '',
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
//         let newProduct = await NewProduct.findOne();
//         if (!newProduct) {
//             newProduct = new NewProduct({ products: savedProducts.map(product => product._id) });
//         } else {
//             newProduct.products.push(...savedProducts.map(product => product._id));
//         }

//         await newProduct.save();

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

const createNewProductsFromExcel = async (req, res) => {
    try {
        const file = req.file;

        if (!file || !file.buffer) {
            return res.status(400).json({ message: "Excel file is required." });
        }

        // Load workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Image mapping
        const imageMap = {};
        worksheet.getImages().forEach(({ range, imageId }) => {
            const image = workbook.getImage(imageId);
            if (image && image.buffer) {
                const row = range.tl.nativeRow + 1;
                imageMap[row] = image.buffer;
            }
        });

        const newProductsToInsert = [];
        const updatedProductsToLink = [];

        // Loop rows
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
                console.log(`Skipping row ${rowNumber}: Missing fields or image.`);
                continue;
            }

            // Upload image
            let imageUrl;
            try {
                imageUrl = await uploadOnCloudinary(imageBuffer);
            } catch (err) {
                console.error(`Row ${rowNumber} image upload failed:`, err.message);
                continue;
            }

            // ⭐ Check if product already exists
            const existingProduct = await Product.findOne({
                sku,
                netWeight,
                grossWeight
            });

            if (existingProduct) {
                console.log(`Existing product found: updating SKU ${sku}`);

                // Update fields
                if (name) existingProduct.name = name;
                if (description) existingProduct.description = description;

                existingProduct.productCount =
                    (existingProduct.productCount || 0) + productCount;

                await existingProduct.save();
                updatedProductsToLink.push(existingProduct._id);
                continue;
            }

            // ⭐ Create new product
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

        // Create/update NewProduct collection
        let newProductDoc = await NewProduct.findOne();
        if (!newProductDoc) {
            newProductDoc = new NewProduct({ products: [] });
        }

        // Combine new & updated
        const allProductIds = [
            ...savedNewProducts.map(p => p._id),
            ...updatedProductsToLink,
        ];

        // Avoid duplicates
        const existingSet = new Set(newProductDoc.products.map(id => id.toString()));
        allProductIds.forEach(id => {
            if (!existingSet.has(id.toString())) {
                newProductDoc.products.push(id);
            }
        });

        await newProductDoc.save();

        return res.status(201).json({
            message: `${savedNewProducts.length} new products created, ${updatedProductsToLink.length} updated.`,
            newProducts: savedNewProducts,
            updatedProducts: updatedProductsToLink,
        });
    } catch (error) {
        console.error("Error creating new products:", error);
        return res.status(500).json({
            message: "An error occurred.",
            error: error.message,
        });
    }
};


// const createNewProductsFromExcel = async (req, res) => {
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
//                 console.log(`SKU "${sku}" already exists. Linking to NewProduct and skipping creation.`);
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

//         // Find or create NewProduct document
//         let newProduct = await NewProduct.findOne();
//         if (!newProduct) {
//             newProduct = new NewProduct({ products: [] });
//         }

//         // Add both new and existing product IDs (avoid duplicates)
//         const allProductIds = [
//             ...savedProducts.map(p => p._id),
//             ...existingProductsToLink,
//         ];

//         // Avoid duplicates in the NewProduct list
//         const existingSet = new Set(NewProduct.products.map(id => id.toString()));
//         allProductIds.forEach(id => {
//             if (!existingSet.has(id.toString())) {
//                 NewProduct.products.push(id);
//             }
//         });

//         await NewProduct.save();

//         return res.status(201).json({
//             message: `${savedProducts.length} new products created. ${existingProductsToLink.length} existing products linked.`,
//             newProducts: savedProducts,
//             existingProducts: existingProductsToLink,
//         });

//     } catch (error) {
//         console.error("Error creating New products from Excel:", error);
//         return res.status(500).json({
//             message: "An error occurred while processing the Excel file.",
//             error: error.message,
//         });
//     }
// };

const getNewProducts = async (req, res) => {
    try {
        // Find the top product catalog
        const newProduct = await NewProduct.findOne().populate({
            path: "products", // Populate the 'products' field with the Product details
            select: "sku productID beads netWeight grossWeight karat images name description", // Choose the fields to return for each product
        });

        if (!newProduct || newProduct.products.length === 0) {
            return res.status(404).json({ message: "No top product products found." });
        }

        // Return the list of top products
        return res.status(200).json({
            message: "top product products retrieved successfully.",
            products: newProduct.products,
        });
    } catch (error) {
        console.error("Error fetching top product products:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving the top product products.",
            error: error.message,
        });
    }
};

const removeProductFromNewProduct = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid or missing product ID." });
        }

        const newProduct = await NewProduct.findOne();
        if (!newProduct) {
            return res.status(404).json({ message: "top product products list not found." });
        }

        const initialCount = newProduct.products.length;

        // Remove productId from the array
        newProduct.products = newProduct.products.filter(
            (id) => id.toString() !== productId
        );

        if (newProduct.products.length === initialCount) {
            return res.status(404).json({ message: "Product not found in top product list." });
        }

        await newProduct.save();

        return res.status(200).json({
            message: "Product removed from top product successfully.",
            newProducts: newProduct.products,
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
    createNewProductsFromExcel,
    getNewProducts,
    removeProductFromNewProduct
};