export const validateDoctorSignup = (data) => {
    const { name, specialty, email, phoneNumber, yearsOfExperience, profilePic } = data;
  
    if (!name || !specialty || !email || !phoneNumber || !yearsOfExperience) {
      return { valid: false, message: 'All fields are required.' };
    }
  
    if (typeof yearsOfExperience !== 'number' || yearsOfExperience <= 0) {
      return { valid: false, message: 'Years of experience must be a positive number.' };
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return { valid: false, message: 'Invalid email format.' };
    }
  
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return { valid: false, message: 'Invalid phone number format.' };
    }
  
    return { valid: true };
  };
  
  export const validatePatientSignup = (data) => {
    const { name, age, email, phoneNumber, historyOfSurgery, historyOfIllness, profilePic } = data;
  
    if (!name || !age || !email || !phoneNumber) {
      return { valid: false, message: 'All fields are required.' };
    }
  
    if (typeof age !== 'number' || age <= 0) {
      return { valid: false, message: 'Age must be a positive number.' };
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return { valid: false, message: 'Invalid email format.' };
    }
  
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return { valid: false, message: 'Invalid phone number format.' };
    }
  
    return { valid: true };
  };