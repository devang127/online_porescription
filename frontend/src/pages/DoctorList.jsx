// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DoctorCard from '../components/DoctorCard';
// import { backendUrl } from '../config';

// const DoctorList = () => {
//   const [doctors, setDoctors] = useState([]);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/api/doctors`);
//         setDoctors(response.data);
//       } catch (error) {
//         console.error('Error fetching doctors:', error);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8 text-center">Available Doctors</h1>
//       {doctors.length === 0 ? (
//         <p className="text-center">No doctors available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {doctors.map((doctor) => (
//             <DoctorCard key={doctor._id} doctor={doctor}/>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../config';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Redirecting to login.');
          return;
        }

        const response = await axios.get(`${backendUrl}/api/doctors/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error.response?.data?.message || error.message);
      }
    };

    fetchDoctors();
  }, []);


  return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">Available Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-blue-50 shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300">
              <img
                src={doctor.profilePic || '/assets/images/placeholder.png'}
                alt={doctor.name}
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-400"
              />
              <h2 className="text-xl font-semibold text-center mt-3 text-blue-600">{doctor.name}</h2>
              <p className="text-gray-700 text-center">Specialty: {doctor.specialty}</p>
              <p className="text-gray-600 text-center">{doctor.experience} years experience</p>
              <button
                onClick={() => navigate(`/consultation/${doctor._id}`)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition duration-300"
              >
                Consult
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;




