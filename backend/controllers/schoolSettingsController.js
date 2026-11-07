const School = require('../models/School');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');
const { invalidateSchoolMetaCache } = require('../utils/schoolMeta');

const formatSchool = (school) => ({
  id: school._id,
  name: school.name || '',
  code: school.code || '',
  school_type: school.school_type || 'Private',
  board: school.board || '',
  address: school.address || '',
  contact_number: school.contact_number || '',
  email: school.email || '',
  logo_url: school.logo_url || '',
  slogan: school.slogan || '',
  website: school.website || '',
  affiliation_number: school.affiliation_number || '',
  established_year: school.established_year || '',
  principal_name: school.principal_name || '',
  principal_signature_url: school.principal_signature_url || '',
  teacher_signature_url: school.teacher_signature_url || '',
  currency: school.currency || 'PKR',
  is_active: school.is_active
});

const getSchoolGeneralSettings = async (req, res) => {
  try {
    let schoolId = req.user?.school_id;
    if (!schoolId && req.user?.role === 'SuperAdmin') {
      const defaultSchool = await School.findOne().select('_id').lean();
      schoolId = defaultSchool?._id;
    }
    if (!schoolId) return res.status(400).json({ message: 'No school associated with user' });

    const school = await School.findById(schoolId).lean();
    if (!school) return res.status(404).json({ message: 'School not found' });

    res.status(200).json({ success: true, school: formatSchool(school) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch school settings', error: error.message });
  }
};

const updateSchoolGeneralSettings = async (req, res) => {
  try {
    let schoolId = req.user?.school_id || req.body?.school_id;
    if (!schoolId && req.user?.role === 'SuperAdmin') {
      const defaultSchool = await School.findOne().select('_id').lean();
      schoolId = defaultSchool?._id;
    }
    if (!schoolId) return res.status(400).json({ message: 'No school associated with user' });

    if (req.body.name !== undefined && !req.body.name.trim()) {
      return res.status(400).json({ message: 'School name cannot be empty' });
    }

    const fields = [
      'name', 'board', 'address', 'contact_number', 'email', 'logo_url',
      'slogan', 'website', 'affiliation_number', 'established_year',
      'principal_name', 'principal_signature_url', 'teacher_signature_url', 'currency'
    ];

    const updateFields = {};
    for (const k of fields) {
      if (req.body[k] !== undefined) {
        let val = req.body[k];
        if (typeof val === 'string') {
          val = k === 'email' ? val.trim().toLowerCase() : val.trim();
          if (['logo_url', 'principal_signature_url', 'teacher_signature_url'].includes(k) && val.startsWith('data:image/')) {
            val = await uploadToCloudinary(val, 'eliteedu/school-assets');
          }
        }
        updateFields[k] = val;
      }
    }

    const school = await School.findByIdAndUpdate(
      schoolId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!school) return res.status(404).json({ message: 'School not found' });

    invalidateSchoolMetaCache(schoolId);

    res.status(200).json({
      success: true,
      message: 'School general settings saved successfully',
      school: formatSchool(school)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update school settings', error: error.message });
  }
};

module.exports = { getSchoolGeneralSettings, updateSchoolGeneralSettings };
