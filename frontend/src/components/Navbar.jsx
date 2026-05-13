import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const token = sessionStorage.getItem('token');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 py-4 px-6 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500">GDF</Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/freebies" className="hover:text-blue-400 transition-colors">Freebies</Link>
          {token ? (
            <>
              <Link to="/profile" className="hover:text-blue-400 transition-colors">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition-colors">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
