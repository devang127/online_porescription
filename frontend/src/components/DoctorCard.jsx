import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleConsult = () => {
    navigate(`/consult/${doctor._id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 w-80">
      <img 
        src={doctor.profilePic || 'https://via.placeholder.com/150'} 
        alt={doctor.name} 
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-bold text-center mt-4">{doctor.name}</h2>
      <p className="text-gray-600 text-center">Specialty: {doctor.specialty}</p>
      <button 
        onClick={handleConsult}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Consult
      </button>
    </div>
  );
};

export default DoctorCard;