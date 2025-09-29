import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Slider = mongoose.model('Slider', sliderSchema);