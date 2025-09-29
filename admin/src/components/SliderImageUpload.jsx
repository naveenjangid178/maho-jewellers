import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const SliderImageUpload = ({ createSliderImage, setCreateSliderImage }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setSuccess('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file); // <-- IMPORTANT: field name = 'image'

        try {
            setUploading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/slider/create`, // ✅ correct URL
                formData
            );
            setSuccess('Image uploaded!');
            setCreateSliderImage(!createSliderImage)
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className='absolute top-0 left-0 flex items-center justify-center min-h-screen w-full backdrop-blur'>
            <div className="max-w-md relative mx-auto mt-10 bg-transparent shadow-xs shadow-black rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Sidebar Image</h2>
                <X className='text-red-500 hover:text-red-500 absolute right-2 top-2' onClick={() => setCreateSliderImage(!createSliderImage)} />
                {success && <div className="text-green-600 mb-2">{success}</div>}
                {error && <div className="text-red-600 mb-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SliderImageUpload;
