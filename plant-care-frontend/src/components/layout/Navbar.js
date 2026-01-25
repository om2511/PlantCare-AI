import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <span className="text-2xl font-bold text-primary">Plant Care AI</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium">
              My Plants
            </Link>
            <Link to="/add-plant" className="text-gray-700 hover:text-primary font-medium">
              Add Plant
            </Link>
            <Link to="/suggestions" className="text-gray-700 hover:text-primary font-medium">
              AI Suggestions
            </Link>
            <Link to="/disease-detection" className="text-gray-700 hover:text-primary font-medium">
              Disease Detection
            </Link>
            
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.location?.city || 'No location'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;