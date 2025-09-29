import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import AddCatalogue from '../components/AddCatalogue';
import { useNavigate } from 'react-router-dom';
import AddBlog from '../components/AddBlog';

function Blog() {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [createCatalogue, setCreateCatalogue] = useState(false)
  const navigate = useNavigate();

  const handleClick = (c) => {
    navigate(`/blog/${c}`);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function fetchBlogs() {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/`, {
          cancelToken: source.token,
        });
        console.log(response.data)
        setCatalogues(response.data.blogs);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Fetch cancelled');
        } else if (err.response) {
          setError(`Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('Network error: No response from server');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();

    return () => source.cancel('Component unmounted.');
  }, [createCatalogue]);

  const deleteBlog = async (catalogueId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/blog/${catalogueId}`);
      alert('Catalogue deleted successfully!');
      // Directly update product list in state
      setCatalogues(prev => prev.filter(catalogue => catalogue._id !== catalogueId));
      return response.data;
    } catch (error) {
      console.error("Failed to delete catalogue:", error);
      throw error;
    }
  };

  const filtered = catalogues.filter((c) =>
    c.title.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Blogs</h1>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setCreateCatalogue(!createCatalogue)}
        >
          <Plus className="h-4 w-4" /> Create
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search catalogues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-300">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-gray-400">—</div>
          <h3 className="text-lg font-medium text-gray-800">No Blog found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'Get started by creating your first catalogue.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="border rounded-lg relative shadow hover:shadow-lg transition p-2 flex gap-4 font-medium">
              <img src={c.image} className='h-20 w-22 object-fill object-center rounded' />
              <div className="space-y-1">
                <h2 className="font-semibold text-gray-800 text-[1.15rem]">{c.title}</h2>
                <div className="text-sm text-gray-700">
                  {c.content.slice(1, 15)} Products
                </div>
              </div>
              <div className='absolute bottom-2 right-2'>
                <div className='flex items-center text-center gap-2'>
                  <button className="text-green-500 hover:text-green-700 cursor-pointer" onClick={() => handleClick(c._id)}><Eye className="h-5 w-5" /></button>
                  <button className="text-red-500 hover:text-red-700 cursor-pointer"><Trash2 className="h-5 w-5" onClick={() => deleteBlog(c._id)} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {createCatalogue && <AddBlog setCreateCatalogue={setCreateCatalogue} createCatalogue={createCatalogue} />}
    </div>
  );
}

export default Blog;