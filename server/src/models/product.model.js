import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: String,
        unit: { type: String, enum: ['g', 'kg', 'oz', 'lb'] }
    },
    karat: {
        type: String,
        enum: ['14K', '18K', '22K', '24K']
    },
    images: [{
        type: String
    }]
}, { timestamps: true });

export const Product = new mongoose.model("Product", productSchema);