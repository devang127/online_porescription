import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';

const PatientSignin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
        alert("Email and password are required.");
        return;
    }

    try {
        const response = await axios.post(`${backendUrl}/api/patients/signin`, {
            email: formData.email,
            password: formData.password,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('patientId', response.data.patientId); 
        alert('Login successful');
        navigate('/patient/doctorslist');
    } catch (error) {
        console.error('Error during sign-in:', error.response?.data?.message || error.message);
    }
};


return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
    <div className="bg-white p-10 shadow-2xl rounded-2xl w-full max-w-md">
      <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Patient Sign In</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg transition duration-300"
        >
          Sign In
        </button>
      </form>
      <p className="mt-6 text-center">Don't have an account? <Link to="/patient/signup" className="text-blue-500 hover:underline">Sign Up</Link></p>
    </div>
  </div>
);
};


export default PatientSignin;