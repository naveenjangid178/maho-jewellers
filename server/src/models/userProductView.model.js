import mongoose from "mongoose";

const userProductViewSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    catalogue: {
        type: String,
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