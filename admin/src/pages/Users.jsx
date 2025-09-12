import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Edit,
} from 'lucide-react';
import EditUserCatalogues from '../components/EditUserCatalogues';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState(false)
  const [userId, setUserId] = useState(null)
  const [currentUserCatalogues, setCurrentUserCatalogues] = useState([]);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/`);
        console.log(data.data)
        setUsers(data.data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [editUser]);

  const filteredUsers = users.filter((user) => {
    const joined = new Date(user.joinedAt);
    const matchesPhone = user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      (!startDate || joined >= new Date(startDate)) &&
      (!endDate || joined <= new Date(endDate));
    return matchesPhone && matchesDate;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="md:p-4 p-2 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Users Management</h1>
        <p className="text-gray-600">Manage user access and permissions</p>
      </div>

      {/* Search & Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by phone number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex md:gap-2 gap-1 w-fit">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md md:px-3 px-1 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md md:px-3 px-1 py-2"
          />
        </div>
      </div>

      {/* Table */}
      <div>
        <span className="text-lg font-medium text-gray-800">
          Users ({filteredUsers.length})
        </span>
        <div className="bg-white mt-2 shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Allowed Catalogues</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{user.phone}</div>
                    <div className="text-xs text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.allowedCatalogues?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.allowedCatalogues.map(({ _id, catalogue, expiresAt }) => (
                          <span key={_id} className="text-xs px-2 py-1 bg-gray-200 rounded flex flex-col">
                            <span>{catalogue.title}</span>
                            <span className="text-[10px] text-gray-500">
                              Expires: {new Date(expiresAt).toLocaleString()}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No access</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline flex items-center gap-1">
                      <Edit className="h-4 w-4 cursor-pointer" onClick={() => {
                        setEditUser(!editUser)
                        setUserId(user._id)
                        setCurrentUserCatalogues(user.allowedCatalogues);
                      }} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * usersPerPage + 1}–
              {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:underline'
                  }`}
              >
                Previous
              </button>
              <span className="text-sm">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:underline'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {editUser && <EditUserCatalogues
        userId={userId}
        currentCatalogues={currentUserCatalogues}
        onClose={() => {
          setUserId(null)
          setEditUser(!editUser)
        }}
        onSuccess={() => {
          setUserId(null)
          setEditUser(!editUser)
        }}
      />}
    </div>
  );
}

export default Users;
