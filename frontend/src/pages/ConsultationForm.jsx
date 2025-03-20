
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';  
import QRCode from '../components/QRCode';
import { backendUrl } from '../config';

const ConsultationForm = () => {
    const { doctorId } = useParams();  
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const initialFormData = JSON.parse(localStorage.getItem('consultationFormData')) || {
        illnessHistory: '',
        recentSurgery: '',
        diabetics: '',
        allergies: '',
        others: '',
        transactionId: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [consentGiven, setConsentGiven] = useState(false);  

    const handleChange = (e) => {
        const updatedData = { ...formData, [e.target.name]: e.target.value };
        setFormData(updatedData);
        localStorage.setItem('consultationFormData', JSON.stringify(updatedData)); 
    };

    const handleNext = () => {
        if (
            (step === 1 && (!formData.illnessHistory.trim() || !formData.recentSurgery.trim())) ||
            (step === 2 && (!formData.diabetics || !formData.allergies.trim()))
        ) {
            alert('Please fill in all required fields before proceeding.');
            return;
        }
        setStep(step + 1);
    };

    const handlePrevious = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.transactionId.trim()) {
            alert('Transaction ID is required.');
            return;
        }

        if (!consentGiven) {
            alert('You must accept the consent before submitting.');
            return;
        }

        const token = localStorage.getItem('token');  
        const patientId = localStorage.getItem('patientId');  

        if (!token) {
            alert('Unauthorized access. Please log in again.');
            return;
        }

        if (!doctorId || !patientId) {
            alert('Doctor ID and Patient ID are required.');
            return;
        }

        const consultationData = {
            ...formData,
            doctor: doctorId,
            patient: patientId
        };

        const response = await fetch(`${backendUrl}/api/consultations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(consultationData)
        });

        if (response.ok) {
            alert('Consultation submitted successfully!');
            localStorage.removeItem('consultationFormData');
            navigate('/patient/doctorslist');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    };

    const handleBack = () => {
        navigate(-1);
    }

    return (
<div className="min-h-screen pt-16 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
        <div className="max-w-lg mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-blue-400">
            <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((stepNum) => (
                    <div
                        key={stepNum}
                        className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${step === stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                    >
                        {stepNum}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <>
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Step 1: Medical History</h2>
                    <div className="space-y-4">
                        <input
                            name="illnessHistory"
                            placeholder="Illness History"
                            value={formData.illnessHistory}
                            onChange={handleChange}
                            className="w-full p-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                            name="recentSurgery"
                            placeholder="Recent Surgery Details"
                            value={formData.recentSurgery}
                            onChange={handleChange}
                            className="w-full p-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="flex justify-between items-center">
                            <button onClick={handleBack} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                                Go Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                                >
                                Next
                            </button>
                        </div>
                        
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Step 2: Family Medical History</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="diabetics"
                                    value="Yes"
                                    checked={formData.diabetics === "Yes"}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span>Diabetic</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="diabetics"
                                    value="No"
                                    checked={formData.diabetics === "No"}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span>Non-Diabetic</span>
                            </label>
                        </div>

                        <input
                            name="allergies"
                            placeholder="Allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            className="w-full p-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                            name="others"
                            placeholder="Other Details"
                            value={formData.others}
                            onChange={handleChange}
                            className="w-full p-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={handlePrevious}
                                className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Step 3: Payment Details</h2>
                    <div className="border border-blue-400 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Scan and Pay using UPI App</h3>
                        <QRCode/>
                        <p className="text-center text-gray-700">or</p>
                        <p className="text-center font-bold text-red-500">UPI ID: doctor1@hdpc</p>
                        <input
                            name="transactionId"
                            placeholder="Transaction ID"
                            value={formData.transactionId}
                            onChange={handleChange}
                            className="w-full p-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <div className="border border-blue-400 p-4 rounded-lg mt-4">
                        <h3 className="font-bold">CONSENT FOR ONLINE CONSULTATION</h3>
                        <p className="text-xs text-gray-600 mt-2">
                            I HAVE UNDERSTOOD THAT THIS IS AN ONLINE CONSULTATION WITHOUT A PHYSICAL CHECKUP OF MY SYMPTOMS.
                            THE DOCTOR HENCE RELIES ON MY DESCRIPTION OF THE PROBLEM OR SCANNED REPORTS PROVIDED BY ME.
                            WITH THIS UNDERSTANDING, I HEREBY GIVE MY CONSENT FOR ONLINE CONSULTATION.
                        </p>
                        <div className="flex items-center mt-3">
                            <input
                                type="checkbox"
                                id="consent"
                                checked={consentGiven}
                                onChange={() => setConsentGiven(!consentGiven)}
                                className="mr-2"
                            />
                            <label htmlFor="consent">YES, I ACCEPT</label>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button onClick={handlePrevious} className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500">Back</button>
                        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600">Submit Appointment</button>
                    </div>
                </>
            )}
        </div>
    </div>
);};

export default ConsultationForm;