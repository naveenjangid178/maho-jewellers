import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar } from 'lucide-react';

function Tracking() {
  const [viewData, setViewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const viewsPerPage = 15;

  useEffect(() => {
    const mockViewData = [
      {
        id: 1,
        userName: 'John Doe',
        userPhone: '+1234567890',
        productName: 'Diamond Ring',
        productId: 'prod-001',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        duration: 1800,
        catalogue: 'Premium Collection',
      },
      {
        id: 2,
        userName: 'Jane Smith',
        userPhone: '+1234567891',
        productName: 'Gold Necklace',
        productId: 'prod-002',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        duration: 1200,
        catalogue: 'Gold Items',
      },
      {
        id: 3,
        userName: 'Mike Johnson',
        userPhone: '+1234567892',
        productName: 'Silver Bracelet',
        productId: 'prod-003',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
        duration: 900,
        catalogue: 'Silver Collection',
      },
    ];

    setTimeout(() => {
      setViewData(mockViewData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredViews = viewData.filter(view =>
    view.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    view.userPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    view.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedViews = filteredViews.slice(
    (currentPage - 1) * viewsPerPage,
    currentPage * viewsPerPage
  );

  const totalPages = Math.ceil(filteredViews.length / viewsPerPage);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${remainingSeconds}s`;
  };

  const getDurationColor = (seconds) => {
    if (seconds >= 1800) return 'bg-green-100 text-green-700';
    if (seconds >= 600) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Product View Tracking</h1>
        <p className="text-gray-500">Monitor user product viewing behavior and engagement</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, phone, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100">
            <Calendar className="h-4 w-4" /> Date Range
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredViews.length}</div>
          <div className="text-sm text-gray-500">Total Views</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-gray-800">
            {formatDuration(
              filteredViews.reduce((acc, view) => acc + view.duration, 0) /
              filteredViews.length || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Avg. Duration</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-gray-800">
            {new Set(filteredViews.map((view) => view.userPhone)).size}
          </div>
          <div className="text-sm text-gray-500">Unique Users</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Start</th>
              <th className="text-left px-4 py-3">End</th>
              <th className="text-left px-4 py-3">Duration</th>
              <th className="text-left px-4 py-3">Catalogue</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedViews.map((view) => (
              <tr key={view.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{view.userName}</div>
                  <div className="text-xs text-gray-500">{view.userPhone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{view.productName}</div>
                  <div className="text-xs text-gray-500">ID: {view.productId}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{view.startTime.toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{view.startTime.toLocaleTimeString()}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{view.endTime.toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{view.endTime.toLocaleTimeString()}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${getDurationColor(view.duration)}`}>
                    {formatDuration(view.duration)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    {view.catalogue}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <Eye className="h-4 w-4" /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedViews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Eye className="h-10 w-10 mx-auto mb-3" />
            <p className="text-lg font-medium">No view data found</p>
            <p>{searchTerm ? 'Try adjusting your search.' : 'No product views yet.'}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <div>
            Showing {(currentPage - 1) * viewsPerPage + 1} to{' '}
            {Math.min(currentPage * viewsPerPage, filteredViews.length)} of{' '}
            {filteredViews.length} views
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-800 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracking;