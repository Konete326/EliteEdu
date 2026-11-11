const School = require('../models/School');
const User = require('../models/User');
const Student = require('../models/Student');
const { invalidateSchoolMetaCache } = require('../utils/schoolMeta');

const DEFAULT_THEME = {
  mode: 'light',
  placement: 'ltr',
  sidebarBg: 'white',
  headerBg: 'white',
  activeColor: '#0d9488',
  language: 'English'
};

const getSchoolTheme = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (userId) {
      const Model = req.user?.role === 'Student' ? Student : User;
      const userDoc = await Model.findById(userId).select('theme_settings').lean();
      if (userDoc?.theme_settings?.mode) {
        return res.status(200).json({ success: true, theme_settings: { ...DEFAULT_THEME, ...userDoc.theme_settings } });
      }
    }
    let schoolId = req.user?.school_id;
    if (!schoolId && req.user?.role === 'SuperAdmin') {
      const defaultSchool = await School.findOne().select('_id').lean();
      schoolId = defaultSchool?._id;
    }
    if (!schoolId) {
      return res.status(200).json({ success: true, theme_settings: DEFAULT_THEME });
    }
    const school = await School.findById(schoolId).select('theme_settings').lean();
    res.status(200).json({ success: true, theme_settings: school?.theme_settings || DEFAULT_THEME });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch theme settings', error: error.message });
  }
};

const updateSchoolTheme = async (req, res) => {
  try {
    const { mode, placement, sidebarBg, headerBg, activeColor, language } = req.body;
    const update = {};
    if (mode && ['light', 'dark'].includes(mode)) update['theme_settings.mode'] = mode;
    if (placement && ['ltr', 'rtl'].includes(placement)) update['theme_settings.placement'] = placement;
    if (headerBg && typeof headerBg === 'string') {
      update['theme_settings.headerBg'] = headerBg.trim();
      update['theme_settings.sidebarBg'] = headerBg.trim();
    } else if (sidebarBg && typeof sidebarBg === 'string') {
      update['theme_settings.sidebarBg'] = sidebarBg.trim();
    }
    if (activeColor && typeof activeColor === 'string') update['theme_settings.activeColor'] = activeColor.trim();
    if (language && typeof language === 'string') update['theme_settings.language'] = language.trim();

    let savedTheme = { ...DEFAULT_THEME };
    const userId = req.user?.id || req.user?._id;
    if (userId) {
      const Model = req.user?.role === 'Student' ? Student : User;
      const updatedUser = await Model.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('theme_settings').lean();
      if (updatedUser?.theme_settings) savedTheme = { ...DEFAULT_THEME, ...updatedUser.theme_settings };
    }

    const schoolId = req.user?.school_id || req.body?.school_id;
    if (schoolId && (req.user?.role === 'Admin' || req.user?.role === 'SuperAdmin')) {
      const school = await School.findByIdAndUpdate(schoolId, { $set: update }, { new: true }).select('theme_settings').lean();
      invalidateSchoolMetaCache(schoolId);
      if (school?.theme_settings) savedTheme = { ...DEFAULT_THEME, ...school.theme_settings };
    }

    res.status(200).json({ success: true, message: 'Theme settings updated', theme_settings: savedTheme });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theme settings', error: error.message });
  }
};

module.exports = { getSchoolTheme, updateSchoolTheme };
