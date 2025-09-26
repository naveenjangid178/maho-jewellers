import React from 'react';
import { Users, Package, ShoppingBag } from 'lucide-react';

const stats = [
  {
    name: 'Total Users',
    value: '2,847',
    icon: Users,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Active Catalogues',
    value: '24',
    icon: Package,
    change: '+3%',
    changeType: 'positive',
  },
  {
    name: 'Total Products',
    value: '1,293',
    icon: ShoppingBag,
    change: '+18%',
    changeType: 'positive',
  },
];

function Dashboard() {
  return (
    <div className="space-y-8 p-6 bg-white max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin panel. Here's an overview of your application.</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ name, value, icon: Icon, change, changeType }) => (
          <div
            key={name}
            className="flex items-center p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Icon className="w-6 h-6" />
            </div>

            <div>
              <p className="text-gray-500 font-medium">{name}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Activity</h2>
        <p className="text-gray-600 mb-6">Latest actions performed in the system</p>

        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold text-gray-900">New user registered</p>
              <p className="text-sm text-gray-600">john.doe@example.com</p>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">2 minutes ago</span>
          </div>

          <div className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold text-gray-900">Product added to catalogue</p>
              <p className="text-sm text-gray-600">Gold Ring - Premium Collection</p>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">15 minutes ago</span>
          </div>

          <div className="flex justify-between items-center p-4 rounded-b-lg">
            <div>
              <p className="font-semibold text-gray-900">Catalogue access granted</p>
              <p className="text-sm text-gray-600">User: jane.smith@example.com</p>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">1 hour ago</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
