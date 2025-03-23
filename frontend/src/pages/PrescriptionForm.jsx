
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';


const PrescriptionForm = () => {
    const { doctorId, patientId, consultationId } = useParams();
    const [careInstructions, setCareInstructions] = useState('');
    const [medicines, setMedicines] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!careInstructions) {
            alert('Please provide care instructions.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response =await axios.post(`${backendUrl}/api/prescriptions`, {
                doctorId,
                patientId,
                consultationId,
                careInstructions,
                medicines
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(consultationId)
            alert('Prescription submitted successfully!');
        } catch (error) {
            console.error('Error submitting prescription:', error);
            alert('Error submitting prescription. Please try again.');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${backendUrl}/api/prescriptions/edit/${consultationId}`, {
                careInstructions,
                medicines
            }, {
                headers: { Authorization: `Bearer ${token}` } 
            });
    
            alert('Prescription edited successfully!');

        } catch (error) {
            console.error('Error editing prescription:', error);
            alert('Error editing prescription. Please try again.');
        }
    };

    const handleResend = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.post(`${backendUrl}/api/prescriptions/send/${consultationId}`, {
                email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            alert('Prescription resent successfully!');
        } catch (error) {
            console.error('Error resending prescription:', error);
            alert('Error resending prescription. Please try again.');
        }
    };

    const handleBack = () => {
        navigate(-1);
    }
    

    return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-4 border border-blue-400 rounded-xl">
                        <label className="block mb-2 font-bold text-blue-700">Care to be taken</label>
                        <textarea
                            value={careInstructions}
                            onChange={(e) => setCareInstructions(e.target.value)}
                            className="w-full border border-blue-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>

                    <div className="p-4 border border-blue-400 rounded-xl">
                        <label className="block mb-2 font-bold text-blue-700">Medicine</label>
                        <textarea
                            value={medicines}
                            onChange={(e) => setMedicines(e.target.value)}
                            className="w-full border border-blue-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div className="p-4 border border-blue-400 rounded-xl">
                        <label className="block mb-2 font-bold text-blue-700">Patient Email (for resend)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-blue-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full hover:bg-blue-700"
                    >
                        Submit Prescription
                    </button>

                    <button
                        onClick={handleEdit}
                        className="bg-yellow-500 text-black px-4 py-2 rounded-xl w-full hover:bg-yellow-600"
                    >
                        Edit Prescription
                    </button>

                    <button
                        onClick={handleResend}
                        className="bg-green-500 text-black px-4 py-2 rounded-xl w-full hover:bg-green-600"
                    >
                        Send Prescription
                    </button>
                </form>
                <div className='text-center mt-4 text-red-700'>
                    <button onClick={handleBack} className="underline">Go back</button>
                </div>
            </div>
        </div>
    );
};


export default PrescriptionForm;
