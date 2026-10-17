const School = require('../models/School');
const Campus = require('../models/Campus');
const { getTeacherAllowedGradeIds } = require('./attendanceAccessHelper');

const calculateAge = (dob) => {
  if (!dob) return '';
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return '';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
  return years >= 0 ? `${years} yrs` : '';
};

const resolveTeacherGrades = async (user) => {
  if (!user || user.role === 'Admin' || user.role === 'SuperAdmin') return null;
  const grades = await getTeacherAllowedGradeIds(user);
  return grades.map((g) => g._id);
};

const getInstitutionHeader = async (schoolId, campusId) => {
  const school = await School.findById(schoolId).lean();
  let campus = null;
  if (campusId && campusId !== 'all') {
    campus = await Campus.findOne({ _id: campusId, school_id: schoolId }).lean();
  }
  return {
    schoolName: school?.name || 'Elite Educational System',
    campusName: campus?.name || 'Main Campus',
    campusPhone: campus?.contact_number || school?.contact_number || '',
    campusAddress: campus?.address || school?.address || '',
    logoUrl: school?.logo_url || '',
    slogan: school?.slogan || ''
  };
};

module.exports = {
  calculateAge,
  resolveTeacherGrades,
  getInstitutionHeader
};
