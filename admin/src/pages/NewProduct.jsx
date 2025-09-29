import React, { useEffect, useState } from 'react'
import ProductDetails from "../components/ProductDetails"
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import AddNewProduct from '../components/AddNewProduct';

const NewProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [editProduct, setEditProduct] = useState(null);
    const [addProductToCatalogue, setAddProductToCatalogue] = useState(false)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/new-product/`);
                console.log(response)
                // setTitle(response.data.featured.title)
                setProducts(response.data.products);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [addProductToCatalogue]);

    const removeFromFeatured = async (productId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/new-product/${productId}`);
            alert('Product removed successfully!');
            // Directly update product list in state
            setProducts(prev => prev.filter(product => product._id !== productId));
            return response.data;
        } catch (error) {
            console.error("Failed to remove product from featured:", error);
            throw error;
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setAddProductToCatalogue(!addProductToCatalogue)}
                >
                    <Plus className="h-4 w-4" /> Create
                </button>
            </div>
            <ProductDetails
                products={products}
                loading={loading}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                handleDelete={removeFromFeatured}
            />

            {addProductToCatalogue && <AddNewProduct addProductToCatalogue={addProductToCatalogue} setAddProductToCatalogue={setAddProductToCatalogue} />}
        </div>
    )
}

export default NewProduct