import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
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

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading blog...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <>
    <div className="lg:px-12 px-4 py-8 flex flex-col gap-2">

      {image && (
        <div className="mb-6">
          <img
            src={image}
            alt="Blog"
            className="w-full max-h-96 object-cover rounded-md shadow-sm"
          />
        </div>
      )}
      <h2 className='font-bold text-2xl pb-4'>{blog.title}</h2>
      <p>{blog.content}</p>
    </div>
    </>
  );
};

export default BlogDetail;