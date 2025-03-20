import jwt from 'jsonwebtoken';


export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Includes isDoctor flag
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeDoctor = (req, res, next) => {
  if (!req.user || !req.user.isDoctor) {
    return res.status(403).json({ message: 'Access denied. Only doctors can perform this action.' });
  }
  next();
};

export const authorizePatient = (req, res, next) => {
  if (!req.user || req.user.isDoctor) {
    return res.status(403).json({ message: 'Access denied. Patient role required.' });
  }
  next();
};
