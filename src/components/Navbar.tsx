import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, Wand2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <RouterLink to="/" className="flex items-center">
              <span className="text-xl font-bold text-[#3B82F6]">Megarray</span>
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navigation.map((item) => (
              <RouterLink
                key={item.name}
                to={item.href}
                className={`nav-link ${
                  location.pathname === item.href
                    ? 'text-[#3B82F6]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.name}
              </RouterLink>
            ))}
            <RouterLink
              to="/login"
              className="nav-link text-gray-500 hover:text-gray-900"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              className="nav-link px-4 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors duration-200 flex items-center"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Get Started
            </RouterLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <RouterLink
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium ${
                  location.pathname === item.href
                    ? 'text-[#3B82F6] bg-gray-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </RouterLink>
            ))}
            <RouterLink
              to="/login"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              className="block px-3 py-2 text-base font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] flex items-center justify-center"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Get Started
            </RouterLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;