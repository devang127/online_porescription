Online Prescription Platform

This platform allows doctors to manage patient consultations and prescriptions efficiently. It includes sign-up/sign-in functionality for both doctors and patients, a multi-step consultation form, and PDF generation for prescriptions.

Features

Doctor Sign-up/Sign-in Form

Profile Picture

Name

Specialty

Email (unique)

Phone Number (unique)

Years of Experience (can be written in decimals, e.g., 1.5)

Patient Sign-up/Sign-in Form

Profile Picture

Name

Age

Email (unique)

Phone Number (unique)

History of Surgery

History of Illness (displayed in a panel, separated by commas)

Doctor List Page

Grid of cards displaying:

Doctor's Profile Image

Doctor's Name

Specialty

"Consult" Button (redirects to Doctor's Consultation Form)

Doctor's Consultation Form (Multi-Step Form)

Step 1:

Current Illness History

Recent Surgery (with time span)

Step 2:

Diabetes Status (Radio Button: Diabetic/Non-Diabetic)

Any Allergies (Text Field)

Other Conditions (Text Field)

Step 3:

QR Code for Payment

Transaction ID Field

Doctor's Profile Page

Displays doctor information

"View Prescriptions" Button to access the prescription management page

Prescription Page

Lists patient consultations with options to:

View Prescription

Write a New Prescription

Edit and Resend Prescriptions

Prescription Form

Care to be Taken (Mandatory Field)

Medicines (Optional Field)

PDF Generation

Upon submitting a prescription:

A PDF is generated with the doctor's details at the top, prescription details in the middle, and the doctor's name at the bottom.

The PDF is saved for the doctor and can be sent to the patient through the same panel.

Project Structure

Frontend Components

DoctorCard.jsx

FormInput.jsx

MultiStepForm.jsx

Navbar.jsx

QRCode.jsx

Frontend Pages

ConsultationForm.jsx

DoctorList.jsx

DoctorProfile.jsx

DoctorSignin.jsx

DoctorSignup.jsx

PatientSignin.jsx

PatientSignup.jsx

PrescriptionForm.jsx

PrescriptionPage.jsx

Backend Structure

consultationModel.js

doctorModel.js

patientModel.js

prescriptionModel.js

Routes

consultationRoutes.js

doctorRoutes.js

patientRoutes.js

prescriptionRoutes.js

Installation and Setup

Clone the repository:

Install dependencies:

Start the development server:

Routes List

Doctor Routes

/doctor/signup - Doctor Sign-up

/doctor/signin - Doctor Sign-in

/doctor/profile/:doctorId - Doctor Profile Page

/doctor/prescriptions/:doctorId - Prescription Management Page

Patient Routes

/patient/signup - Patient Sign-up

/patient/signin - Patient Sign-in

/patient/consult/:doctorId - Patient Consultation Form

Prescription Routes

/prescription/new - Create New Prescription

/prescription/edit/:prescriptionId - Edit Prescription

/prescription/pdf/:prescriptionId - Generate and View Prescription PDF

Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to improve the platform.