const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const { getSchoolMeta } = require('../utils/schoolMeta');

const findStudentForLogin = async (identifier) => {
  if (!identifier) return null;
  const cleanId = String(identifier).trim();
  return Student.findOne({
    $or: [
      { gr_number: cleanId },
      { email: cleanId.toLowerCase() },
      { contact_number: cleanId },
      { 'father_details.mobile': cleanId },
      { portal_username: cleanId }
    ]
  }).populate('school_id').populate('campus_id').populate('current_grade').lean();
};

const verifyStudentPassword = async (student, password) => {
  if (!student || !password) return false;
  const p = String(password).trim();
  const gr = String(student.gr_number || '').trim();
  if (gr && gr.toLowerCase() === p.toLowerCase()) return true;
  if (student.portal_temp_password && student.portal_temp_password === p) return true;
  if (student.portal_password) {
    if (student.portal_password.startsWith('$2a$') || student.portal_password.startsWith('$2b$')) {
      const match = await bcrypt.compare(p, student.portal_password);
      if (match) return true;
    } else if (student.portal_password === p) {
      return true;
    }
  }
  return false;
};

const buildStudentUserPayload = (student, meta = {}) => ({
  id: student._id,
  student_id: student._id,
  name: student.name,
  email: student.email || `${student.gr_number}@student.local`,
  role: 'Student',
  school_id: student.school_id?._id || student.school_id,
  campus_id: student.campus_id?._id || student.campus_id,
  grade_name: student.current_grade?.name || 'Class',
  section: student.current_section || 'A',
  gr_number: student.gr_number,
  contact_number: student.contact_number || '',
  photo_url: student.photo_url || '',
  dashboard_type: 'StudentDashboard',
  school_type: meta.school_type || 'Private',
  school_name: meta.school_name || 'Elite Educational System',
  school_logo: meta.school_logo || '',
  theme_settings: meta.theme_settings || {},
  first_login: student.first_login !== undefined ? student.first_login : !student.onboarding_completed,
  onboarding_completed: Boolean(student.onboarding_completed),
  app_settings: student.app_settings || {}
});

const handleStudentLogin = async (identifier, password, res) => {
  const student = await findStudentForLogin(identifier);
  if (!student || student.status !== 'Active') return false;
  const isMatch = await verifyStudentPassword(student, password);
  if (!isMatch) return false;
  const meta = await getSchoolMeta(student.school_id?._id || student.school_id);
  const token = jwt.sign(
    {
      id: student._id,
      student_id: student._id,
      name: student.name,
      role: 'Student',
      school_id: student.school_id?._id || student.school_id,
      campus_id: student.campus_id?._id || student.campus_id,
      school_type: meta.school_type,
      school_name: meta.school_name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.status(200).json({ token, user: buildStudentUserPayload(student, meta) });
  return true;
};

const handleStudentGetMe = async (studentId, res) => {
  const student = await Student.findById(studentId).populate('school_id').populate('campus_id').populate('current_grade').lean();
  if (!student || student.status !== 'Active') return res.status(404).json({ message: 'Student profile not found' });
  const meta = await getSchoolMeta(student.school_id?._id || student.school_id);
  return res.status(200).json({ user: buildStudentUserPayload(student, meta) });
};

module.exports = { findStudentForLogin, verifyStudentPassword, buildStudentUserPayload, handleStudentLogin, handleStudentGetMe };
