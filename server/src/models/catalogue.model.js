import mongoose from "mongoose";

const catalogueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: []
    }]
}, { timestamps: true });

export const Catalogue = new mongoose.model("Catalogue", catalogueSchema);