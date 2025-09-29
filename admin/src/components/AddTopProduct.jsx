import React, { useState } from 'react';
import axios from 'axios';
import { CloudUpload, X, XCircle } from 'lucide-react';

function AddTopProduct({ setAddProductToCatalogue, addProductToCatalogue }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
            setFile(droppedFile);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Only Excel files (.xlsx) are supported.' });
        }
    };

    const handleBrowse = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Only Excel files (.xlsx) are supported.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage({ type: 'error', text: 'Excel file and catalogue ID are required.' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/top-product/create`, // <-- update endpoint as needed
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            setMessage({ type: 'success', text: response.data.message });
            setFile(null);
            setAddProductToCatalogue(!addProductToCatalogue); // trigger parent re-render
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to upload products.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='absolute top-0 left-0 flex items-center justify-center min-h-screen w-full z-50'>
            <div className="max-w-xl bg-white backdrop-blur-2xl rounded-lg shadow-lg p-6 space-y-6 w-full mx-4 max-h-full">
                <span className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold text-gray-800">Upload Products from Excel</h2>
                    <XCircle className='hover:text-red-600 cursor-pointer' onClick={() => setAddProductToCatalogue(!addProductToCatalogue)} />
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
                    {/* Excel File Uploader */}
                    <div>
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition"
                        >
                            <CloudUpload className="w-10 h-10 mx-auto text-blue-500 mb-2" />
                            <p className="text-gray-700 font-medium">
                                Drag & drop Excel file or{' '}
                                <label htmlFor="browse" className="text-blue-600 underline cursor-pointer">Browse</label>
                            </p>
                            <input
                                id="browse"
                                name="file"
                                type="file"
                                accept=".xlsx"
                                onChange={handleBrowse}
                                hidden
                                disabled={loading}
                            />
                        </div>

                        {/* Show selected file */}
                        {file && (
                            <div className="mt-2 text-sm flex items-center justify-between bg-gray-100 p-2 px-3 rounded">
                                <span className="truncate">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Upload Products'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddTopProduct;