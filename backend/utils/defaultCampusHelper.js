const Campus = require('../models/Campus');
const School = require('../models/School');

const ensureDefaultCampus = async (schoolId) => {
  if (!schoolId) return null;
  const existing = await Campus.findOne({ school_id: schoolId }).sort({ createdAt: 1 });
  if (existing) return existing;

  const school = await School.findById(schoolId).lean();
  const campus = await Campus.create({
    school_id: schoolId,
    name: 'Main Branch',
    email: school?.email || '',
    website: school?.website || '',
    address: school?.address || 'Main Branch',
    contact_number: school?.contact_number || '',
    image_url: school?.logo_url || '',
    status: 'Active'
  });

  return campus;
};

module.exports = { ensureDefaultCampus };
