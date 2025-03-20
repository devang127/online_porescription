import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
    careInstructions: String,
    medicines: String,
    prescriptionPDF: String
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
