import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    historyOfSurgery: String,
    historyOfIllness: [String],
    profilePic: String,
    password: String,
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
