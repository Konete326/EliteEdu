const School = require('../models/School');
const Campus = require('../models/Campus');

const resolveSchoolId = async (req) => {
  if (req.user?.school_id) return req.user.school_id;
  if (req.body?.school_id) return req.body.school_id;
  if (req.query?.school_id) return req.query.school_id;

  const targetCampusId = req.body?.campus_id || req.query?.campus_id;
  if (targetCampusId) {
    const campus = await Campus.findById(targetCampusId).lean();
    if (campus?.school_id) return campus.school_id;
  }

  const school = await School.findOne().sort({ createdAt: 1 }).lean();
  return school?._id || null;
};

module.exports = resolveSchoolId;
