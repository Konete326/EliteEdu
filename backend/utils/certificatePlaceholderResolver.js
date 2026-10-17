const IssuedCertificate = require('../models/IssuedCertificate');
const Student = require('../models/Student');
const User = require('../models/User');

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(d);
  }
};

const resolvePlaceholders = (templateStr, entity = {}, recipientType = 'Student', customText = '', schoolName = '') => {
  if (!templateStr) return '';
  const isStudent = recipientType === 'Student';
  const map = {
    '{{name}}': (entity.name || 'Recipient').toUpperCase(),
    '{{father_name}}': entity.father_name || '—',
    '{{gr_number}}': entity.gr_number || '—',
    '{{class_name}}': isStudent ? (entity.current_grade?.name || entity.grade_name || 'Class') : '',
    '{{section}}': isStudent ? (entity.current_section || 'A') : '',
    '{{dob}}': formatDate(entity.dob),
    '{{admission_date}}': formatDate(entity.admission_date),
    '{{custom_text}}': customText || 'outstanding performance',
    '{{designation}}': !isStudent ? (entity.designation || 'Staff') : '',
    '{{bps_grade}}': !isStudent ? (entity.bps_grade ? `BPS-${entity.bps_grade}` : '') : '',
    '{{employee_code}}': !isStudent ? (entity.employee_code || entity.personal_id || '—') : '',
    '{{date}}': formatDate(new Date()),
    '{{school_name}}': schoolName || 'Our Institution'
  };

  let resolved = templateStr;
  Object.entries(map).forEach(([token, val]) => {
    resolved = resolved.split(token).join(val);
  });
  return resolved;
};

const resolveRecipient = async (schoolId, recipientType, recipientId) => {
  if (recipientType === 'Student') {
    const student = await Student.findOne({ _id: recipientId, school_id: schoolId }).populate('current_grade', 'name');
    if (!student) return null;
    return {
      entity: student,
      identifierCode: student.gr_number || '',
      classOrDesig: `${student.current_grade?.name || ''} (${student.current_section || 'A'})`,
      campusId: student.campus_id
    };
  }
  const staff = await User.findOne({ _id: recipientId, school_id: schoolId });
  if (!staff) return null;
  return {
    entity: staff,
    identifierCode: staff.employee_code || staff.personal_id || '',
    classOrDesig: staff.designation || 'Staff',
    campusId: staff.campus_id
  };
};

const getNextCertificateNumber = async (schoolId) => {
  const year = new Date().getFullYear();
  const prefix = `CERT-${year}-`;
  const count = await IssuedCertificate.countDocuments({
    school_id: schoolId,
    certificate_no: new RegExp(`^${prefix}`)
  });
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
};

module.exports = {
  resolvePlaceholders,
  resolveRecipient,
  getNextCertificateNumber,
  formatDate
};
