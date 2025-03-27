import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // In production, this would come from your auth context/state
  const isAuthenticated = false;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#00E5BE]">
              Megarray
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link to="/features" className="text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                Pricing
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]"
                    >
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#00E5BE] text-white px-4 py-2 rounded-lg hover:bg-[#00D1AD] transition-colors duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
              
              <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-300">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/features" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
              Features
            </Link>
            <Link to="/pricing" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
              Pricing
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                  Dashboard
                </Link>
                <Link to="/settings" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#00E5BE]">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;