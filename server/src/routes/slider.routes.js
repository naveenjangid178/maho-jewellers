import express from 'express'
import multer from 'multer';
import { createSliderImage, deleteSliderImage, getAllSliderImages } from '../controllers/slider.controller.js';

const storage = multer.memoryStorage(); // We need the file buffer
const upload = multer({ storage });

const router = express.Router();

router.post('/create',upload.single('image'), createSliderImage);
router.get('/', getAllSliderImages);
router.delete('/:id', deleteSliderImage);

export default router;