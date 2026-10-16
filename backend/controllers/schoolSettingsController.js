const School = require('../models/School');

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
  currency: school.currency || 'PKR',
  is_active: school.is_active
});

const getSchoolGeneralSettings = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ message: 'No school associated with user' });

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });

    res.status(200).json({ success: true, school: formatSchool(school) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch school settings', error: error.message });
  }
};

const updateSchoolGeneralSettings = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ message: 'No school associated with user' });

    const fields = [
      'name', 'board', 'address', 'contact_number', 'email', 'logo_url',
      'slogan', 'website', 'affiliation_number', 'established_year',
      'principal_name', 'principal_signature_url', 'currency'
    ];

    if (req.body.name !== undefined && !req.body.name.trim()) {
      return res.status(400).json({ message: 'School name cannot be empty' });
    }

    const updateFields = {};
    fields.forEach((k) => {
      if (req.body[k] !== undefined) {
        updateFields[k] = k === 'email' ? req.body[k].trim().toLowerCase() : req.body[k].trim();
      }
    });

    const school = await School.findByIdAndUpdate(
      schoolId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!school) return res.status(404).json({ message: 'School not found' });

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
