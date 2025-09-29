import { Slider } from "../models/slider.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createSliderImage = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        // Upload to Cloudinary using buffer
        const imageUrl = await uploadOnCloudinary(req.file.buffer);

        // Save image URL to MongoDB
        const newImage = new Slider({ imageUrl });
        const savedImage = await newImage.save();

        return res.status(201).json({
            message: 'Sidebar image uploaded and saved successfully.',
            image: savedImage,
        });
    } catch (error) {
        console.error('Error uploading sidebar image:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getAllSliderImages = async (req, res) => {
    try {
        const images = await Slider.find().sort({ createdAt: -1 });

        return res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching sidebar images:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const deleteSliderImage = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedImage = await Slider.findByIdAndDelete(id);

        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        return res.status(200).json({ message: 'Sidebar image deleted successfully.' });
    } catch (error) {
        console.error('Error deleting sidebar image:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export {
    createSliderImage,
    getAllSliderImages,
    deleteSliderImage
}