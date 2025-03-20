import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../config';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found. User may not be logged in.");
          return;
        }
    
        const response = await axios.get(`${backendUrl}/api/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctor();
  }, [id]);

  if (!doctor) {
    return <p>Youre not a Doctor</p>;
  }



  return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-blue-400">
        <img
          src={doctor.profilePic ? doctor.profilePic : '/assets/images/placeholder.png'}
          alt="Doctor Profile"
          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-400"
        />
        <h1 className="text-3xl font-bold text-center text-blue-700 mt-4">Dr. {doctor.name}</h1>
        <p className="text-gray-700 text-center">Specialty: {doctor.specialty}</p>
        <p className="text-gray-700 text-center">Experience: {doctor.experience} years</p>
        <p className="text-gray-700 text-center">Contact: {doctor.email}, +91-{doctor.phone}</p>

        <button
          onClick={() => {
            navigate(`/prescriptions/${doctor._id}`)}}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-xl w-full hover:bg-blue-700"
        >
          View Prescriptions
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
