import express from 'express'
import multer from 'multer';
import { createBlogPost, deleteBlogPost, getAllBlogs, getBlogById, updateBlogPost } from '../controllers/blog.controller.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create', upload.single('image'), createBlogPost);
router.delete('/:id', deleteBlogPost);
router.put('/:id', updateBlogPost);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

export default router