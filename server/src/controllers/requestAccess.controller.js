import { RequestAccess } from "../models/requestAccess.model.js";

const createRequestAccess = async (req, res) => {
    try {
        const { title, catalogueId, userId, phone } = req.body;

        if (!title || !catalogueId) {
            return res.status(400).json({ message: "Title and Catalogue ID are required." });
        }

        const newRequest = new RequestAccess({
            title,
            catalogueId,
            userId,
            phone,
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: "Access request created successfully.",
            data: savedRequest,
        });
    } catch (error) {
        console.error("Error creating request access:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getAllRequestAccesses = async (req, res) => {
    try {
        const requests = await RequestAccess.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: "Fetched all access requests.",
            data: requests,
        });
    } catch (error) {
        console.error("Error fetching request accesses:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


export {
    createRequestAccess,
    getAllRequestAccesses
}