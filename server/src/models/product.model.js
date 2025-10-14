import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    productCount: {
        type: Number,
        required: true,
        default: 0
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