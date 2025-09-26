import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductDetails from "../components/ProductDetails"
import { Plus, Search, Filter, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null); // product to edit

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/`);
        setProducts(response.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [editProduct]);

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/product/${productId}`);
      alert('Product removed successfully!');
      // Directly update product list in state
      setProducts(prev => prev.filter(product => product._id !== productId));
      return response.data;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      <ProductDetails
        products={products}
        loading={loading}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        handleDelete={deleteProduct}
      />
    </div>
  );
}

export default Products;
