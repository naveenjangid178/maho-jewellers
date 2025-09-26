import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Catalogues from './pages/Catalogues';
import Products from './pages/Products';
import Carts from './pages/Carts';
import Tracking from './pages/Tracking';
import AdminLayout from './components/AdminLayout';
import CatalogueDetails from './pages/CatalogueDetails';
import Featured from './pages/Featured';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/*"
          element={
            // <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/catalogues" element={<Catalogues />} />
                  <Route path="/catalogue/:id" element={<CatalogueDetails />} />
                  <Route path="/featured" element={<Featured />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/carts" element={<Carts />} />
                  <Route path="/tracking" element={<Tracking />} />
                </Routes>
              </AdminLayout>
            // </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;