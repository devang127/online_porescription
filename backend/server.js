import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/prescriptions', (req, res, next) => {
    console.log('Prescription route hit!');
    next();
  }, prescriptionRoutes);

app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);

app.use('/prescriptions', express.static(path.join(__dirname, 'prescriptions')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
