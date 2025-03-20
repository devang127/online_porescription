import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';
import { authenticateUser, authorizeDoctor } from '../middleware/middleware.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();
const router = express.Router();

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
      { folder: 'doctor_profiles' },
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
    const { name, specialty, email, phone, password, experience } = req.body;
    let profilePicUrl = '';

    if (req.file) {
      try {
        profilePicUrl = await uploadToCloudinary(req.file.buffer);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      specialty,
      email,
      phone,
      password: hashedPassword,
      experience,
      profilePic: profilePicUrl,
      isDoctor: true
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: doctor._id, isDoctor: doctor.isDoctor },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/list', authenticateUser, async (req, res) => {
  try {
    const doctors = await Doctor.find().select('name specialty profilePic experience');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/test-doctor', async (req, res) => {
  try {
    const doctors = await Doctor.find({}); // ✅ Correct for listing doctors
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctors.' });
  }
});


export default router;
