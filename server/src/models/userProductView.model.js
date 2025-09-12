import mongoose from "mongoose";

const userProductViewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    viewStart: {
        type: Date,
        required: true
    },
    viewEnd: {
        type: Date,
        required: true
    },
    timeSpent: {
        type: Number,
        required: true
    } // seconds
}, { timestamps: true });

export const UserProductView = new mongoose.model("UserProductView", userProductViewSchema);