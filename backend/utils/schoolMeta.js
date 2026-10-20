const School = require('../models/School');

const metaCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

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
  const cacheKey = String(schoolId);
  const cached = metaCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  const school = await School.findById(schoolId).select('name school_type theme_settings logo_url slogan').lean();
  const data = {
    school_type: school?.school_type || null,
    school_name: school?.name || null,
    theme_settings: school?.theme_settings || null,
    school_logo: school?.logo_url || null,
    school_slogan: school?.slogan || null
  };
  metaCache.set(cacheKey, { timestamp: Date.now(), data });
  return data;
};

const invalidateSchoolMetaCache = (schoolId) => {
  if (schoolId) metaCache.delete(String(schoolId));
  else metaCache.clear();
};

module.exports = { getSchoolMeta, invalidateSchoolMetaCache };
