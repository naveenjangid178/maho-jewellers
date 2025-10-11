import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,    
    required: true, 
  }
}, {
  timestamps: true,  
});

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);