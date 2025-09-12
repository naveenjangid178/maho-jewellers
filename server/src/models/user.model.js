import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String
    }, // hashed or temporary
    otpExpires: {
        type: Date
    },
    allowedCatalogues: [{
        catalogue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Catalogue"
        },
        expiresAt: {
            type: Date,
            required: true,
        }
    }]
}, { timestamps: true });

export const User = new mongoose.model("User", userSchema);