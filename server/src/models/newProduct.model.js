import mongoose from "mongoose";

const newProductSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: []
    }]
}, { timestamps: true });

export const NewProduct = new mongoose.model("NewProduct", newProductSchema);