import mongoose from "mongoose";

const featuredSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: []
    }]
}, { timestamps: true });

export const Featured = new mongoose.model("Featured", featuredSchema);