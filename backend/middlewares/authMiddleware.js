const jwt = require('jsonwebtoken');
const { verifySession } = require('../controllers/authSessionHelper');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.session_id) {
      const { valid } = await verifySession(decoded.session_id);
      if (!valid) {
        return res.status(401).json({ message: 'Session revoked or expired. Please sign in again.' });
      }
    }

    req.user = {
      id: decoded.id,
      _id: decoded.id,
      student_id: decoded.student_id || (decoded.role === 'Student' ? decoded.id : null),
      name: decoded.name || 'User',
      role: decoded.role,
      custom_role_id: decoded.custom_role_id || null,
      school_id: decoded.school_id,
      campus_id: decoded.campus_id || null,
      school_name: decoded.school_name || 'Global / System',
      session_id: decoded.session_id || null
    };
    req.schoolId = decoded.school_id || null;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

authMiddleware.protect = authMiddleware;
module.exports = authMiddleware;
module.exports.protect = authMiddleware;
