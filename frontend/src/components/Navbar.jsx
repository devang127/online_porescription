import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/patient/signin'); 
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

  return (
<nav className="h-16 w-full fixed top-0 left-0 bg-gradient-to-r from-blue-500 to-blue-800 text-white p-4 shadow-md z-50">

      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">
          Online Prescription Platform
        </h1>
        <div className="flex space-x-6 items-center">
          {!isLoggedIn && (
            <>
              <Link to="/doctor/signin" className="hover:text-blue-300 font-medium">Doctor Profile</Link>
              <Link to="/patient/signin" className="hover:text-blue-300 font-medium">Patient Profile</Link>
            </>
          )}

          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
