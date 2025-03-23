

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

