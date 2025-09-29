import mongoose from "mongoose";

const topProductSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: []
    }]
}, { timestamps: true });

export const TopProduct = new mongoose.model("TopProduct", topProductSchema);