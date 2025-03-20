// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { backendUrl } from '../config';

// const PrescriptionPage = () => {
//   const [consultations, setConsultations] = useState([]); 
//   const doctorId = localStorage.getItem('doctorId')?.trim(); 


//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchConsultations = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const doctorId = localStorage.getItem('doctorId');

//             if (!doctorId) {
//                 console.error('Doctor ID is missing in localStorage');
//                 return;
//             }

//             const response = await axios.get(`${backendUrl}/api/consultations/doctor/${doctorId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data && response.data.length > 0) {
//                 setConsultations(response.data);
//             } else {
//                 console.warn('No consultations found.');
//             }
//         } catch (error) {
//             console.error('Error fetching consultations:', error.message);
//         }
//     };

//     fetchConsultations();
// }, []);



//   const handleWritePrescription = (consultationId) => {
//     navigate(`/doctor/prescribe/${consultationId}`);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8 text-center">Consultations</h1>
//       {consultations.length === 0 ? (
//         <p className="text-center">No consultations available.</p>
//       ) : (
//         <table className="w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr>
//               <th className="border p-2">Patient Name</th>
//               <th className="border p-2">Illness History</th>
//               <th className="border p-2">Recent Surgery</th>
//               <th className="border p-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {consultations.map((consultation) => (
//               <tr key={consultation._id}>
//                 <td className="border p-2">{consultation.patientName}</td>
//                 <td className="border p-2">{consultation.illnessHistory}</td>
//                 <td className="border p-2">{consultation.recentSurgery}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() => handleWritePrescription(consultation._id)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                   >
//                     Write Prescription
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
    
//   );
// };

// export default PrescriptionPage;

// import React, { useEffect, useState } from 'react';
// import { backendUrl } from '../config';

// const PrescriptionPage = () => {
//     const [consultations, setConsultations] = useState([]);

//     useEffect(() => {
//         const fetchConsultations = async () => {
//             const token = localStorage.getItem('token');
//             const doctorId = localStorage.getItem('doctorId');

//             if (!token || !doctorId) {
//                 alert('Unauthorized access. Please log in again.');
//                 return;
//             }

//             try {
//                 const response = await fetch(`${backendUrl}/api/consultations?doctorId=${doctorId}`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     setConsultations(data);
//                 } else {
//                     alert('Failed to fetch consultations.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching consultations:', error);
//                 alert('Error connecting to the server.');
//             }
//         };

//         fetchConsultations();
//     }, []);

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
//             <h1 className="text-2xl font-bold text-center mb-6">Prescription Page</h1>

//             {consultations.length === 0 ? (
//                 <p className="text-center text-gray-500">No consultations available.</p>
//             ) : (
//                 consultations.map((consultation) => (
//                     <div key={consultation._id} className="border border-gray-300 rounded-md p-4 mb-6">
//                         {/* Doctor and Date Section */}
//                         <div className="flex justify-between items-center border-b border-blue-900 pb-2 mb-4">
//                             <div>
//                                 <p className="font-bold">Dr. {consultation.doctorName}</p>
//                                 <p><span className="font-bold">Address:</span> {consultation.doctorAddress}</p>
//                             </div>
//                             <p className="font-bold">Date: {new Date(consultation.date).toLocaleDateString()}</p>
//                         </div>

//                         {/* Care to be Taken */}
//                         <div className="mb-4">
//                             <p className="font-bold">Care to be taken</p>
//                             <textarea
//                                 className="w-full border border-gray-300 rounded-md p-2 mt-1"
//                                 value={consultation.careToBeTaken || ''}
//                                 readOnly
//                             />
//                         </div>

//                         {/* Medicines */}
//                         <div className="mb-4">
//                             <p className="font-bold">Medicine</p>
//                             <textarea
//                                 className="w-full border border-gray-300 rounded-md p-2 mt-1"
//                                 value={consultation.medicines || ''}
//                                 readOnly
//                             />
//                         </div>

//                         {/* Doctor Name Footer */}
//                         <div className="border-t border-blue-900 pt-2 text-right">
//                             <p className="font-bold">Name of doctor</p>
//                         </div>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default PrescriptionPage;

import React, { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';

const PrescriptionPage = () => {
    const { doctorId, patientId } = useParams();
    const [consultations, setConsultations] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
      const fetchConsultations = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
              setError('Unauthorized access. Please log in again.');
              return;
          }
  
          try {
            const response = await fetch(`${backendUrl}/api/consultations/${doctorId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
  
              if (response.status === 401) {
                  setError('Unauthorized access. Please log in again.');
                  return; 
              } 
              console.log(response);
              if (response.ok) {
                  const data = await response.json();
                  setConsultations(data);
              } else {
                  setError('Failed to fetch consultations.');
              }
          } catch (error) {
              setError('An error occurred while fetching consultations.');
          }
      };
  
      fetchConsultations();
  }, [doctorId]);

  const handleBack = () => {
    navigate(-1)
}

return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Prescription Page</h1>
            <div className="text-center mb-4">
                <button onClick={handleBack} className="text-blue-500 underline">Go Back</button>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {consultations.length > 0 ? (
                consultations.map((consult) => (
                    <div
                        key={consult._id}
                        className="border border-blue-400 p-6 mb-4 rounded-2xl shadow-md bg-blue-50"
                    >
                        <h2 className="font-bold text-lg text-blue-700">Patient Name: {consult.patient?.name}</h2>
                        <p><strong>Age:</strong> {consult.patient?.age || 'N/A'}</p>
                        <p><strong>Illness History:</strong> {consult.illnessHistory}</p>
                        <p><strong>Recent Surgery:</strong> {consult.recentSurgery}</p>
                        <p><strong>Diabetics:</strong> {consult.diabetics || 'N/A'}</p>
                        <p><strong>Allergies:</strong> {consult.allergies || 'N/A'}</p>
                        <p><strong>Others:</strong> {consult.others}</p>
                        <Link to={`/prescription-form/${doctorId}/${consult.patient?._id}/${consult._id}`}>
                            <button
                                className="w-full mt-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
                            >
                                Write Prescription
                            </button>
                        </Link>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No consultations found.</p>
            )}
        </div>
    </div>
);
};

export default PrescriptionPage;

