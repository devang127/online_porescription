import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/patientModel.js';
import { authenticateUser, authorizePatient } from '../middleware/middleware.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();
const router = express.Router();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'patient_profiles' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

router.post('/signup', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, age, email, phone, password, historyOfSurgery, historyOfIllness } = req.body;
    let profilePicUrl = '';

    if (req.file) {
      try {
        profilePicUrl = await uploadToCloudinary(req.file.buffer);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      age,
      email,
      phone,
      password: hashedPassword,
      historyOfSurgery,
      historyOfIllness: historyOfIllness.split(','),
      profilePic: profilePicUrl,
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: patient._id, isDoctor: false }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      patientId: patient._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






router.get('/:id', authenticateUser, authorizePatient, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;