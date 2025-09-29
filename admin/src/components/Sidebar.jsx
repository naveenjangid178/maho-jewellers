import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Users, Package, ShoppingCart, ShoppingBag, Activity, LogOut, InspectIcon, PanelTop, ArrowUpSquareIcon, NotebookIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../index.css'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Catalogues', href: '/catalogues', icon: Package },
  { name: 'Products', href: '/products', icon: ShoppingBag },
  { name: 'Carts', href: '/carts', icon: ShoppingCart },
  { name: 'Tracking', href: '/tracking', icon: Activity },
  { name: 'Blog', href: '/blog', icon: NotebookIcon },
  { name: 'Featured', href: '/featured', icon: InspectIcon },
  { name: 'Top Product', href: '/top-product', icon: PanelTop },
  { name: 'New Product', href: '/new-product', icon: ArrowUpSquareIcon },
];

function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-2xl bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-admin-sidebar border-r border-admin-border
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 scroller pb-8 overflow-y-scroll ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-admin-border">
          <h1 className="text-xl font-bold text-admin-text-primary">Admin Panel</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive
                  ? 'bg-admin-active text-admin-primary scale-105'
                  : 'text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-hover'
                }`
              }
              onClick={() => onClose()}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <button className="flex items-center px-8 cursor-pointer text-sm font-medium rounded-lg transition-colors"
          onClick={logout}>
          <LogOut className='mr-3 h-5 w-5' /> Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;