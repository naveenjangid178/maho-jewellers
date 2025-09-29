import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { generateOTP, sendSMS, sendOTP } from "../utils/otpService.js"
import mongoose from "mongoose"

const loginUser = asyncHandler(async (req, res) => {
    const { phone } = req.body

    if (!phone) {
        throw new apiError(400, "Phone number is required");
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ phone })

    if (user) {
        user.otp = otp
        user.otpExpires = otpExpires
        await user.save()
    } else {
        user = await User.create({
            phone,
            otp,
            otpExpires
        })
    }

    await sendOTP(phone, otp)

    const createdUser = await User.findById(user._id).select(
        "-otp -otpExpires"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "✅ User registered Successfully")
    )
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .populate('allowedCatalogues.catalogue', 'title')
        .select("-otp -otpExpires");

    if (!users || users.length === 0) {
        throw new apiError(404, "No users found");
    }

    const now = new Date();

    // Filter out expired catalogues while preserving populated fields
    const filteredUsers = users.map(user => {
        const filteredCatalogues = user.allowedCatalogues.filter(ac =>
            !ac.expiresAt || new Date(ac.expiresAt) > now
        );

        return {
            _id: user._id,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            allowedCatalogues: filteredCatalogues,
        };
    });

    return res.status(200).json(
        new apiResponse(200, filteredUsers, "✅ Users fetched successfully")
    );
});

const updateUserCatalogues = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { allowedCatalogues } = req.body;

    if (!Array.isArray(allowedCatalogues)) {
        throw new apiError(400, 'allowedCatalogues must be an array');
    }

    // Validate each item
    allowedCatalogues.forEach(item => {
        if (!item.catalogue || !mongoose.Types.ObjectId.isValid(item.catalogue)) {
            throw new apiError(400, 'Each allowedCatalogue must have a valid "catalogue" ObjectId');
        }

        // expiresAt can be null (lifetime) or a valid date
        if (item.expiresAt !== null && isNaN(Date.parse(item.expiresAt))) {
            throw new apiError(400, 'Each allowedCatalogue must have a valid "expiresAt" date or null for lifetime');
        }
    });


    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, 'User not found');
    }

    // Update allowedCatalogues with new structure
    user.allowedCatalogues = allowedCatalogues.map((item) => ({
        catalogue: item.catalogue,
        expiresAt: new Date(item.expiresAt),
    }));

    await user.save();

    return res.status(200).json(
        new apiResponse(200, user, '✅ User catalogues updated successfully')
    );
});


export {
    loginUser,
    getAllUsers,
    updateUserCatalogues
}