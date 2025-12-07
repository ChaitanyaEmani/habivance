import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import notificationSound from '../../utils/notificationSound';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const previousCount = useRef(0);
  const navigate = useNavigate();
  
  const isAuthenticated = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'User';

  // Fetch unread notification count
  useEffect(() => {
    let isMounted = true;

    const fetchUnreadCount = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}api/notifications/unread-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (isMounted && response.data.success) {
          const newCount = response.data.data.count;
          
          // Play sound only if count increased (new notification arrived)
          if (newCount > previousCount.current && previousCount.current !== 0) {
            notificationSound.play();
            console.log('🔔 New notification detected! Playing sound...');
          }
          
          previousCount.current = newCount;
          setUnreadCount(newCount);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch notification count:', error);
        }
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Poll for new notifications every 5 seconds
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUnreadCount(0);
    toast.success("User logged out successfully");
    navigate('/login');
  };

  // Active link styling for desktop
  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold px-3 py-2 rounded-md transition-colors"
      : "text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors";

  // Active link styling for mobile
  const mobileLinkClasses = ({ isActive }) =>
    isActive
      ? "bg-blue-50 text-blue-600 font-semibold block px-4 py-3 rounded-lg transition-colors"
      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-4 py-3 rounded-lg transition-colors";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-gray-900 text-xl sm:text-2xl font-bold">Habivance</span>
            </Link>
          </div>

          {/* Desktop Menu - Hidden on tablet and mobile */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <NavLink to="/" className={linkClasses}>Home</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/routine" className={linkClasses}>My Routine</NavLink>
                <NavLink to="/recommendations" className={linkClasses}>Recommendations</NavLink>
                <NavLink to="/analytics" className={linkClasses}>Analytics</NavLink>
                
                {/* Notification Bell Icon */}
                <NavLink to='/notifications' className="relative text-gray-700 hover:text-blue-600 transition p-2">
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>

                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <NavLink to="/profile" className={linkClasses}>
                    <div className="flex items-center space-x-1">
                      <User size={18} /> <span>{userName}</span>
                    </div>
                  </NavLink>

                  <button 
                    onClick={handleLogout}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClasses}>Login</NavLink>

                <NavLink 
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-4 pb-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">

            <NavLink 
              to="/" 
              className={mobileLinkClasses} 
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/routine" 
                  className={mobileLinkClasses} 
                  onClick={() => setIsOpen(false)}
                >
                  My Routine
                </NavLink>

                <NavLink 
                  to="/recommendations" 
                  className={mobileLinkClasses} 
                  onClick={() => setIsOpen(false)}
                >
                  Recommendations
                </NavLink>

                <NavLink 
                  to="/analytics" 
                  className={mobileLinkClasses} 
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </NavLink>

                {/* Mobile Notifications Link */}
                <NavLink
                  to="/notifications"
                  className={mobileLinkClasses}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Bell size={20} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </NavLink>

                <NavLink 
                  to="/profile" 
                  className={mobileLinkClasses} 
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User size={20} /> 
                    <span>Profile ({userName})</span>
                  </div>
                </NavLink>

                <div className="pt-2 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-3 rounded-lg text-base font-medium flex items-center justify-center space-x-2"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={mobileLinkClasses} 
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>

                <NavLink 
                  to="/register" 
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-3 rounded-lg text-base font-medium text-center">
                    Get Started
                  </div>
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;