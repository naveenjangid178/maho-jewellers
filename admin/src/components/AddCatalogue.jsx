import React, { useState } from 'react';
import axios from 'axios';
import { CloudUpload, X, XCircle } from 'lucide-react';

function AddCatalogue({ setCreateCatalogue, createCatalogue }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, image: file }));
            setMessage({ type: '', text: '' });
        }
    };

    const handleBrowse = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, image: file }));
            setMessage({ type: '', text: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.image) {
            setMessage({ type: 'error', text: 'Title and image are required.' });
            return;
        }

        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('image', formData.image);

        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/catalouge/create`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage({ type: 'success', text: response.data.message });
            setFormData({ title: '', description: '', image: null });
            setCreateCatalogue(!createCatalogue)
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create catalogue.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='absolute top-0 left-0 flex items-center justify-center min-h-screen w-full'>
            <div className="max-w-xl bg-transparent backdrop-blur-2xl rounded-lg shadow-lg p-6 space-y-6 w-full mx-4 max-h-full">
                <span className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold text-gray-800">Create Catalogue</h2>
                    <XCircle className='hover:text-red-600 cursor-pointer' onClick={() => setCreateCatalogue(!createCatalogue)} />
                </span>
                {message.text && (
                    <div
                        className={`p-3 rounded text-sm ${message.type === 'error'
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-green-100 text-green-700 border border-green-300'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Uploader */}
                    <div>
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition"
                        >
                            <CloudUpload className="w-10 h-10 mx-auto text-blue-500 mb-2" />
                            <p className="text-gray-700 font-medium">
                                Drag & drop files or{' '}
                                <label htmlFor="browse" className="text-blue-600 underline cursor-pointer">Browse</label>
                            </p>
                            <input
                                id="browse"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleBrowse}
                                hidden
                                disabled={loading}
                            />
                        </div>

                        {/* Show selected file */}
                        {formData.image && (
                            <div className="mt-2 text-sm flex items-center justify-between bg-gray-100 p-2 px-3 rounded">
                                <span className="truncate">{formData.image.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter catalogue title"
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full border outline-none border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional description"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Catalogue'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddCatalogue;