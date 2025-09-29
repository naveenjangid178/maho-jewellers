import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let imageUrl = '';

    if (req.file && req.file.buffer) {
      imageUrl = await uploadOnCloudinary(req.file.buffer);
    }

    // Create and save blog post
    const newBlog = new Blog({
      title,
      content,
      image: imageUrl,
    });

    const savedBlog = await newBlog.save();

    return res.status(201).json({
      message: 'Blog post created successfully',
      blog: savedBlog,
    });

  } catch (err) {
    console.error('Error creating blog post:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate inputs
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update the blog
    blog.title = title;
    blog.content = content;

    const updatedBlog = await blog.save();

    return res.status(200).json({
      message: 'Blog post updated successfully',
      blog: updatedBlog,
    });

  } catch (err) {
    console.error('Error updating blog post:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Newest first

    return res.status(200).json({
      message: 'All blog posts fetched successfully',
      blogs,
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format (optional but recommended)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
    createBlogPost,
    deleteBlogPost,
    updateBlogPost,
    getAllBlogs,
    getBlogById
}
