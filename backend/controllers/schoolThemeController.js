const School = require('../models/School');

const getSchoolTheme = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: 'No school associated with user' });
    }

    const school = await School.findById(schoolId).select('theme_settings name');
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({
      success: true,
      theme_settings: school.theme_settings || {
        mode: 'light',
        placement: 'ltr',
        sidebarBg: 'light',
        headerBg: 'white',
        activeColor: '#0d9488',
        language: 'English'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch theme settings', error: error.message });
  }
};

const updateSchoolTheme = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) {
      return res.status(400).json({ message: 'No school associated with user' });
    }

    const { mode, placement, sidebarBg, headerBg, activeColor, language } = req.body;
    const update = {};

    if (mode && ['light', 'dark'].includes(mode)) {
      update['theme_settings.mode'] = mode;
    }
    if (placement && ['ltr', 'rtl'].includes(placement)) {
      update['theme_settings.placement'] = placement;
    }
    if (sidebarBg && ['light', 'dark'].includes(sidebarBg)) {
      update['theme_settings.sidebarBg'] = sidebarBg;
    }
    if (headerBg && typeof headerBg === 'string') {
      update['theme_settings.headerBg'] = headerBg.trim();
    }
    if (activeColor && typeof activeColor === 'string') {
      update['theme_settings.activeColor'] = activeColor.trim();
    }
    if (language && typeof language === 'string') {
      update['theme_settings.language'] = language.trim();
    }

    const school = await School.findByIdAndUpdate(
      schoolId,
      { $set: update },
      { new: true, runValidators: true }
    ).select('theme_settings');

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Theme settings updated',
      theme_settings: school.theme_settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theme settings', error: error.message });
  }
};

module.exports = { getSchoolTheme, updateSchoolTheme };
