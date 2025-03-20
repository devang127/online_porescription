import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    illnessHistory: { type: String, required: true },
    recentSurgery: { type: String, required: true },
    diabetics: { type: String, required: false },
    allergies: { type: String, required: false },
    others: { type: String, required: false },
    transactionId: { type: String, required: false }
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
