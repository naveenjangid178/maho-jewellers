import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { Button } from '@/components/ui/button';

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-admin-border px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-hover"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Right side */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-admin-text-secondary" />
              <span className="text-sm font-medium text-admin-text-primary">
                {user?.username || 'Admin'}
              </span>
            </div>
            
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-admin-text-secondary hover:text-admin-text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;