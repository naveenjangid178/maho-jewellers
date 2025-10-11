import { Testimonial } from '../models/testimonial.model.js';

const createTestimonial = async (req, res) => {
    try {
        const { name, quote, rating } = req.body;

        if (!name || !quote || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const testimonial = new Testimonial({ name, quote, rating });
        await testimonial.save();

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quote, rating } = req.body;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        testimonial.name = name ?? testimonial.name;
        testimonial.quote = quote ?? testimonial.quote;
        testimonial.rating = rating ?? testimonial.rating;

        await testimonial.save();
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export {
    createTestimonial,
    getAllTestimonials,
    updateTestimonial,
    deleteTestimonial
}