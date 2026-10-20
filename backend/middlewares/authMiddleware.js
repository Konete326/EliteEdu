const jwt = require('jsonwebtoken');
const { verifySession } = require('../controllers/authSessionHelper');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : req.query?.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.session_id) {
      const { valid } = await verifySession(decoded.session_id);
      if (!valid) {
        return res.status(401).json({ message: 'Session revoked or expired. Please sign in again.' });
      }
    }

    let userSchoolId = decoded.school_id || req.headers['x-school-id'] || null;
    if (!userSchoolId && (decoded.role === 'SuperAdmin' || !decoded.school_id)) {
      const School = require('../models/School');
      const defaultSchool = await School.findOne().sort({ createdAt: 1 }).select('_id').lean();
      userSchoolId = defaultSchool?._id || null;
    }

    req.user = {
      id: decoded.id,
      _id: decoded.id,
      student_id: decoded.student_id || (decoded.role === 'Student' ? decoded.id : null),
      name: decoded.name || 'User',
      role: decoded.role,
      custom_role_id: decoded.custom_role_id || null,
      school_id: userSchoolId,
      campus_id: decoded.campus_id || req.headers['x-campus-id'] || null,
      school_name: decoded.school_name || 'Global / System',
      session_id: decoded.session_id || null
    };
    req.schoolId = userSchoolId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

authMiddleware.protect = authMiddleware;
module.exports = authMiddleware;
module.exports.protect = authMiddleware;
