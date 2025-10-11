// src/components/TestimonialAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: '', quote: '', rating: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/testimonial/`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/testimonial/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/testimonial/`, form);
      }
      setForm({ name: '', quote: '', rating: '' });
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit a testimonial
  const handleEdit = (testimonial) => {
    setForm({
      name: testimonial.name,
      quote: testimonial.quote,
      rating: testimonial.rating,
    });
    setEditingId(testimonial._id);
  };

  // Delete a testimonial
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/testimonial/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <textarea
          name="quote"
          placeholder="Quote"
          value={form.quote}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        ></textarea>
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={form.rating}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', quote: '', rating: '' });
              setEditingId(null);
            }}
            className="ml-4 text-sm text-gray-600 underline"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">All Testimonials</h2>

      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <p>No testimonials found.</p>
        ) : (
          testimonials.map((t) => (
            <div
              key={t._id}
              className="border rounded p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="italic text-gray-600">"{t.quote}"</p>
                <p className="text-yellow-500">Rating: {t.rating}/5</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Testimonial;
