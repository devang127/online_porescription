import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    experience: Number,
    profilePic: String,
    password: String,
    isDoctor: { type: Boolean, default: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
