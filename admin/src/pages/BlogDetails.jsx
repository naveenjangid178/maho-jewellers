import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blog/${id}`);
        setImage(res.data.image);
        setBlog({ title: res.data.title, content: res.data.content });
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog.');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/blog/${id}`, {
        title: blog.title,
        content: blog.content,
      });

      alert('Blog updated successfully!');
      navigate('/blog');
    } catch (err) {
      setError('Failed to update blog.');
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading blog...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Blog Post</h2>

      {image && (
        <div className="mb-6">
          <img
            src={image}
            alt="Blog"
            className="w-full max-h-96 object-cover rounded-md shadow-sm"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={blog.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogDetails;