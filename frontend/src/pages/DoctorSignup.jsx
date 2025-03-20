import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../config';

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    profilePic: '',
    name: '',
    specialty: '',
    email: '',
    phone: '',
    experience: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      for (const key in formData) {
        formDataObj.append(key, formData[key]);
      }
      await axios.post(`${backendUrl}/api/doctors/signup`, formDataObj);
      navigate('/doctor/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign-up failed');
    }
  };

  return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white p-10 shadow-2xl rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Doctor Sign Up</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Profile Picture</label>
            <input type="file" name="profilePic" onChange={handleFileChange} className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {['Name', 'Specialty', 'Email', 'Phone', 'Experience', 'Password'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium">{field}</label>
              <input
                type={field === 'Password' ? 'password' : field === 'Experience' ? 'number' : 'text'}
                name={field.toLowerCase()}
                value={formData[field.toLowerCase()]}
                onChange={handleChange}
                className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center">Already have an account? <Link to="/doctor/signin" className="text-blue-500 hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

export default DoctorSignup;
