const mongoose = require('mongoose');
const Campus = require('../models/Campus');
const User = require('../models/User');

const verifyAssociations = async (schoolId, campusId, teacherId) => {
  if (campusId) {
    if (!mongoose.Types.ObjectId.isValid(campusId)) return 'Invalid campus ID format';
    const campus = await Campus.findOne({ _id: campusId, school_id: schoolId });
    if (!campus) return 'Selected campus does not belong to your school';
  }
  if (teacherId) {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) return 'Invalid teacher ID format';
    const teacher = await User.findOne({ _id: teacherId, school_id: schoolId, role: 'Teacher' });
    if (!teacher) return 'Selected teacher does not belong to your school';
  }
  return null;
};

const sanitizeSections = (sections) => {
  if (!Array.isArray(sections) || sections.length === 0) return ['A'];
  const cleaned = sections.map((s) => String(s).trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : ['A'];
};

module.exports = { verifyAssociations, sanitizeSections };
