import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    productID: {
        type: String,
        required: true
    },
    beads: {
        type: String,
        required: true
    },
    netWeight: {
        type: Number,
        required: true
    },
    grossWeight: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }]
}, { timestamps: true });

export const Product = new mongoose.model("Product", productSchema);