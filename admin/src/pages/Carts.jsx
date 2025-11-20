import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Edit, Plus, Trash2, ShoppingCart } from 'lucide-react';

function Carts() {
  const [carts, setCarts] = useState([]);
  const [viewProduct, setViewProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cartsPerPage = 10;

  useEffect(() => {
    console.log("viewProduct updated:", viewProduct);
  }, [viewProduct]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/`);
      console.log(response.data.orders);
      setCarts(response.data.orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      alert(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredCarts = carts.filter(cart =>
    cart.userId.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCarts = filteredCarts.slice(
    (currentPage - 1) * cartsPerPage,
    currentPage * cartsPerPage
  );

  const totalPages = Math.ceil(filteredCarts.length / cartsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'empty': return 'bg-gray-300 text-gray-700';
      case 'abandoned': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Cart Management</h1>
          <p className="text-gray-500 mt-1">View and manage user shopping carts</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition">
          <Plus className="h-5 w-5" />
          Create Cart
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by user phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCarts.map(cart => (
              <tr key={cart.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cart.userId.phone}</div>
                  {/* <div className="text-xs text-gray-500">ID: {cart.userId}</div> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {cart.products.length} {cart.products.length === 1 ? 'item' : 'items'}
                  </div>
                  {cart.products.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {cart.products.slice(0, 2).map((item, index) => (
                        <div key={index}>
                          <span>SKU: {item.productId.sku}</span> - <span>Quantity: {item.quantity}</span>
                        </div>
                      ))}

                      {cart.products.length > 2 && ` +${cart.products.length - 2} more`}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(cart.status)}`}>
                    {cart.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium" onClick={() => setViewProduct(cart)}>
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {/* <button className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 transition text-sm font-medium">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition" aria-label="Delete cart">
                      <Trash2 className="w-5 h-5" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedCarts.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12" />
            <p className="text-lg font-semibold">
              {searchTerm ? 'No carts match your search.' : 'No user carts available.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <div>
            Showing {(currentPage - 1) * cartsPerPage + 1} to{' '}
            {Math.min(currentPage * cartsPerPage, filteredCarts.length)} of {filteredCarts.length} carts
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carts;