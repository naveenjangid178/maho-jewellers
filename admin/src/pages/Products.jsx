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

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      <ProductDetails
        products={products}
        loading={loading}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      />
    </div>
  );
}

export default Products;
