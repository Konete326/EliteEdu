const School = require('../models/School');

const getSchoolMeta = async (schoolId) => {
  if (!schoolId) {
    return {
      school_type: null,
      school_name: null,
      theme_settings: null,
      school_logo: null,
      school_slogan: null
    };
  }
  const school = await School.findById(schoolId).select('name school_type theme_settings logo_url slogan');
  return {
    school_type: school?.school_type || null,
    school_name: school?.name || null,
    theme_settings: school?.theme_settings || null,
    school_logo: school?.logo_url || null,
    school_slogan: school?.slogan || null
  };
};

module.exports = { getSchoolMeta };
