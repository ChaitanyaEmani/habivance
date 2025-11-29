import React, { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  const publicLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' }
  ];

  const privateLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Habits', href: '/habits' }
  ];

  const navLinks = token ? privateLinks : publicLinks;

  const handleScrollOrNavigate = (href) => {
    if (!token && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Habivance
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScrollOrNavigate(link.href)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}

            {!token && (
              <Link to="/auth">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition duration-200">
                  Get Started
                </button>
              </Link>
            )}

            {token && (
              <button
                onClick={handleLogout}
                className="px-5 py-1 text-md bg-red-100 text-red-800 rounded-lg hover:bg-red-200 hover:shadow-lg transition duration-200"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-50 border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleScrollOrNavigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-blue-600 py-2 text-left"
              >
                {link.label}
              </button>
            ))}

            {!token && (
              <Link to="/auth" onClick={()=>setMobileMenuOpen(false)}>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                  Get Started
                </button>
              </Link>
            )}

            {token && (
              <button
                onClick={handleLogout}
                className="px-5 py-1 text-md bg-red-100 text-red-800 rounded-lg hover:bg-red-200 hover:shadow-lg transition duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
