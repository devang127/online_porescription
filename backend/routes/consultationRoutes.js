import express from 'express';
import Consultation from '../models/consultationModel.js';
import Doctor from '../models/doctorModel.js';
import Patient from '../models/patientModel.js';
import { authenticateUser, authorizeDoctor, authorizePatient } from '../middleware/middleware.js';
const router = express.Router();


router.post('/', async (req, res) => {
  const { doctor, patient, illnessHistory, recentSurgery, diabetics, allergies, others, transactionId } = req.body;

  if (!doctor || !patient) {
    return res.status(400).json({ message: 'Doctor ID and Patient ID are required' });
  }

  try {
    const newConsultation = new Consultation({
      doctor,
      patient,
      illnessHistory,
      recentSurgery,
      diabetics,
      allergies,
      others,
      transactionId
    });

    await newConsultation.save();
    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating consultation', error });
  }
});





router.get('/doctor/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId.trim();  // 🔥 Fix for unwanted spaces/newlines

  try {
    const consultations = await Consultation.find({ doctor: doctorId });

    if (!consultations || consultations.length === 0) {
      return res.status(404).json({ message: 'No consultations found.' });
    }

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});





router.get('/patient/:patientId', authenticateUser, authorizePatient, async (req, res) => {
  try {
    const { patientId } = req.params;
    const consultations = await Consultation.find({ patient: patientId }).populate('doctor');
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/request', authenticateUser, async (req, res) => {
  try {
    const { doctorId, symptoms, message } = req.body;
    const patientId = req.user.id;

    const newConsultation = new Consultation({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      message,
      status: 'Pending',
    });

    await newConsultation.save();
    res.status(201).json({ message: 'Consultation request sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/consultations', async (req, res) => {
  const { doctorId } = req.query;

  if (!doctorId) {
    return res.status(400).json({ message: 'Doctor ID is required.' });
  }

  try {
    const consultations = await Consultation.find({ doctor: doctorId });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations.' });
  }
});

router.get('/consultations/:doctorId', authorizeDoctor, async (req, res) => {
  const { doctorId } = req.params;

  try {
      const consultations = await Consultation.find({ doctor: doctorId })
          .populate({
              path: 'patient',
              select: 'name age'
          })
          .select('doctor patient illnessHistory recentSurgery diabetics allergies others');

      if (!consultations.length) {
          return res.status(404).json({ message: "No consultations found." });
      }

      res.status(200).json(consultations);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});




router.get('/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
      const consultations = await Consultation.find({ doctor: doctorId })
          .populate('patient') // <-- Add this line to populate patient details
          .exec();

      if (!consultations) {
          return res.status(404).json({ message: 'No consultations found.' });
      }

      res.status(200).json(consultations);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching consultations.', error });
  }
});




export default router;
