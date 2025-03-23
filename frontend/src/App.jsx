import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorSignup from './pages/DoctorSignup.jsx';
import DoctorSignin from './pages/DoctorSignin.jsx';
import PatientSignup from './pages/PatientSignup.jsx';
import PatientSignin from './pages/PatientSignin.jsx';
import DoctorList from './pages/DoctorList.jsx';
import ConsultationForm from './pages/ConsultationForm.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import PrescriptionPage from './pages/PrescriptionPage.jsx';
import Navbar from './components/Navbar.jsx';
import PrescriptionForm from './pages/PrescriptionForm';
const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">

      <Navbar/>
      <Routes>
        {/* Doctor Routes */}


        <Route path="/prescription-form/:doctorId/:patientId/:consultationId" element={<PrescriptionForm />} />
        <Route path="/prescriptions/:doctorId" element={<PrescriptionPage />} />
        <Route path="/doctor/prescribe/:consultationId" element={<PrescriptionForm />} />
        <Route path="/" element={<DoctorSignup />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/doctor/signin" element={<DoctorSignin />} />
        <Route path="/doctor/profile/:id" element={<DoctorProfile />} />
        <Route path="/prescriptions" element={<PrescriptionPage />} />



        {/* Patient Routes */}
        <Route path="/patient/signup" element={<PatientSignup />} />
        <Route path="/patient/signin" element={<PatientSignin />} />
        <Route path="/patient/doctorslist" element={<DoctorList />} />
        <Route path="/consultation/:doctorId" element={<ConsultationForm />} />

      </Routes>
      </div>
    </Router>
  );
};

export default App;
