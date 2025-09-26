import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus, Search, Edit, Trash2, Image as ImageIcon, X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Pagination({ totalItems, itemsPerPage, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Optional: Limit how many page buttons are shown at once
  // Example: Show max 5 page buttons, centered around currentPage
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const visiblePages = pages.slice(startPage - 1, endPage);

  return (
    <div className="flex flex-wrap justify-center items-center space-x-1 mt-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 min-w-[40px]"
      >
        <ChevronLeft />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 min-w-[30px]`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-1">...</span>}
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-2 sm:px-3 py-1 rounded min-w-[30px] ${page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-1">...</span>}
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 min-w-[30px]"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 min-w-[40px]"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

// ---------------------------
// ✅ Edit Modal Component
// ---------------------------
function EditModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    sku: product.sku || '',
    productID: product.productID || '',
    beads: product.beads || '',
    netWeight: product.netWeight || '',
    grossWeight: product.grossWeight || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Optional: Validate form here
    onSave({ ...product, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <div className="space-y-4">
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="w-full border rounded px-3 py-2"
          />
            <input
              name="productID"
              value={formData.productID}
              onChange={handleChange}
              placeholder="productID"
              className="w-full border rounded px-3 py-2"
            />
          <input
            name="beads"
            value={formData.beads}
            onChange={handleChange}
            placeholder="beads"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="netWeight"
            value={formData.netWeight}
            onChange={handleChange}
            placeholder="netWeight"
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="grossWeight"
            value={formData.grossWeight}
            onChange={handleChange}
            placeholder="grossWeight"
            type="number"
            className="w-full border rounded px-3 py-2"
          />

          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// ✅ ProductDetails Component
// ---------------------------
function ProductDetails({ products, loading, editProduct, setEditProduct, handleDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const filtered = products.filter(p =>
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.catalogue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSaveEdit = async (updatedProduct) => {
    try {
      // Optional: Send update request to backend
      await axios.put(`${import.meta.env.VITE_API_URL}/product/${updatedProduct._id}`, updatedProduct);

      // Update local state
      const updatedList = products.map(p =>
        p._id === updatedProduct._id ? updatedProduct : p
      );

      setEditProduct(null);
      alert('Product updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating product.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Search Bar */}
      <div className="relative flex-1 mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 pr-4 py-2 w-full border outline-none border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginated.map(product => (
          <div key={product._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.sku}
                  className="object-fill object-center w-full h-full"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.productID}</h2>
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.sku}</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Net Weight <span className='font-bold'>{product.netWeight}</span></span>
                <span className="text-sm text-gray-500">Gross Weight <span className='font-bold'>{product.grossWeight}</span></span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>{product.beads}</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button onClick={() => setEditProduct(product)} className="text-blue-500 hover:text-blue-700">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-5 w-5" onClick={() => {
                    handleDelete(product._id)
                    }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <ImageIcon className="h-12 w-12 mx-auto" />
          <h3 className="text-lg font-medium mt-2">No products found</h3>
          <p className="mt-1">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
          </p>
          {/* {!searchTerm && (
            <button className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
              <Plus className="h-5 w-5" /> Add Product
            </button>
          )} */}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > productsPerPage && (
        <Pagination
          totalItems={filtered.length}
          itemsPerPage={productsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default ProductDetails;
