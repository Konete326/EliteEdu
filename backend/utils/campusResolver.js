const mongoose = require('mongoose');
const Campus = require('../models/Campus');

const resolveCampusRef = async (campusId, schoolId) => {
  if (!campusId || campusId === 'all' || !mongoose.Types.ObjectId.isValid(campusId)) return null;
  const campus = await Campus.findOne({ _id: campusId, school_id: schoolId });
  return campus ? campus._id : null;
};

module.exports = resolveCampusRef;
