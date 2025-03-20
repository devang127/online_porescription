import express from 'express';
import Prescription from '../models/prescriptionModel.js';
import Consultation from '../models/consultationModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateUser, authorizeDoctor } from '../middleware/middleware.js';
const doc = new PDFDocument();
const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));


router.post('/', authenticateUser, authorizeDoctor, async (req, res) => {
  try {
    console.log('POST /api/prescriptions hit!');


      const { doctorId, patientId, careInstructions, medicines, consultationId } = req.body;
      const consultation = await Consultation.findById(consultationId)
          .populate('doctor')
          .populate('patient');
      


      if (!consultation) {
          return res.status(404).json({ message: 'Consultation not found' });
      }

      const pdfPath = path.join(__dirname, '..', 'prescriptions', `prescription-${consultationId}.pdf`);
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(pdfPath);

      doc.pipe(writeStream);

      // Header with Blue Border
      doc.rect(0, 0, 0, 0).fill('#000080');
      doc.fillColor('black').fontSize(14).text(`Dr. ${consultation.doctor.name}`, 20, 10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 450, 10);
      doc.fontSize(12).text(`Address: ${consultation.doctor?.email}`, 20, 25);

      // Blue Line
      doc.rect(0, 50, 612, 4).fill('#000080');

      // Care Instructions
      doc.fontSize(14).text('Care to be taken', 20, 70);
      doc.rect(20, 85, 572, 80).stroke();
      doc.text(careInstructions, 25, 90, { width: 560 });

      // Medicines
      doc.fontSize(14).text('Medicine', 20, 180);
      doc.rect(20, 195, 572, 80).stroke();
      doc.text(medicines || 'None', 25, 200, { width: 560 });

      // Bottom Blue Line
      doc.rect(0, 300, 612, 4).fill('#000080');

      // Doctor's Name in Footer
      doc.fontSize(12).text(`Name of doctor: Dr. ${consultation.doctor.name}`, 350, 320);

      doc.end();

      writeStream.on('finish', async () => {
          const prescription = new Prescription({
              consultation: consultationId,
              careInstructions,
              medicines,
              prescriptionPDF: pdfPath,
          });

          await prescription.save();
          console.log('Prescription saved:', prescription);
          res.status(201).json({
            message: 'Prescription created successfully',
            pdfPath: `/prescriptions/prescription-${consultationId}.pdf`,  
        });
      });

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



router.put('/edit/:consultationId', authenticateUser, authorizeDoctor, async (req, res) => {
  try {
      const { consultationId } = req.params;
      const { careInstructions, medicines } = req.body;

      const prescription = await Prescription.findOne({ consultation: consultationId });
      if (!prescription) {
          return res.status(404).json({ message: 'Prescription not found' });
      }

      prescription.careInstructions = careInstructions;
      prescription.medicines = medicines;

      // PDF Regeneration Logic
      const pdfPath = path.join(__dirname, '..', 'prescriptions', `prescription-${consultationId}.pdf`);
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(pdfPath);

      doc.pipe(writeStream);

      // Header
      doc.rect(0, 0, 0, 0).fill('#000080');
      doc.fillColor('black').fontSize(14).text(`Dr. Lorem Ipsum`, 20, 10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 450, 10);
      doc.fontSize(12).text(`Address: Doctor's Address Here`, 20, 25);

      // Blue Line
      doc.rect(0, 50, 612, 4).fill('#000080');

      // Care Instructions
      doc.fontSize(14).text('Care to be taken', 20, 70);
      doc.rect(20, 85, 572, 80).stroke();
      doc.text(careInstructions, 25, 90, { width: 560 });

      // Medicines
      doc.fontSize(14).text('Medicine', 20, 180);
      doc.rect(20, 195, 572, 80).stroke();
      doc.text(medicines || 'None', 25, 200, { width: 560 });

      // Footer
      doc.rect(0, 300, 612, 4).fill('#000080');
      doc.fontSize(12).text(`Name of doctor: Dr. Lorem Ipsum`, 350, 320);

      doc.end();

      writeStream.on('finish', async () => {
        prescription.prescriptionPDF = pdfPath;
        await prescription.save();

        res.json({ message: 'Prescription updated successfully', pdfPath });
    });

} catch (error) {
    res.status(500).json({ message: error.message });
}
});

router.post('/send/:consultationId', authenticateUser, authorizeDoctor, async (req, res) => {
  try {
      const { consultationId } = req.params;
      const { email } = req.body;

      const prescription = await Prescription.findOne({ consultation: consultationId });
      if (!prescription) {
          return res.status(404).json({ message: 'Prescription not found' });
      }

      const pdfPath = prescription.prescriptionPDF;

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD
          }
      });

      const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Updated Prescription',
          text: 'Please find your updated prescription attached.',
          attachments: [
              {
                  filename: `prescription-${consultationId}.pdf`,
                  path: pdfPath
              }
          ]
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: 'Updated prescription sent successfully.' });

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// above for pdf

router.get('/:consultationId', authenticateUser, authorizeDoctor, async (req, res) => {
  try {
      const { consultationId } = req.params;
      const prescription = await Prescription.findOne({ consultation: consultationId });

      if (!prescription) {
          return res.status(404).json({ message: 'Prescription not found' });
      }

      res.json(prescription);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



// router.put('/:consultationId', authenticateUser, authorizeDoctor, async (req, res) => {
//   try {
//     const { consultationId } = req.params;
//     const { careInstructions, medicines } = req.body;

//     const prescription = await Prescription.findOneAndUpdate(
//       { consultation: consultationId },
//       { careInstructions, medicines },
//       { new: true }
//     );

//     if (!prescription) {
//       return res.status(404).json({ message: 'Prescription not found' });
//     }

//     res.json({ message: 'Prescription updated successfully', prescription });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.get('/:consultationId', async (req, res) => {
  const { consultationId } = req.params;
  const prescription = await Prescription.findOne({ consultationId });

  if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
  }

  res.json(prescription);
});

router.get('/:doctorId/:patientId', authenticateUser, async (req, res) => {
  const { doctorId, patientId } = req.params;

  try {
      const prescription = await Prescription.findOne({
          'consultation.doctor': doctorId,
          'consultation.patient': patientId
      });

      if (!prescription) {
          return res.status(404).json({ message: 'Prescription not found' });
      }

      res.status(200).json(prescription);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
});




export default router;