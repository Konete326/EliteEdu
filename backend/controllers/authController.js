const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const School = require('../models/School');

const getSchoolMeta = async (schoolId) => {
  if (!schoolId) return { school_type: null, school_name: null, theme_settings: null };
  const school = await School.findById(schoolId).select('name school_type theme_settings');
  return {
    school_type: school?.school_type || null,
    school_name: school?.name || null,
    theme_settings: school?.theme_settings || null
  };
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { school_type, school_name, theme_settings } = await getSchoolMeta(user.school_id);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        school_id: user.school_id,
        school_type,
        school_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact_number: user.contact_number || '',
        photo_url: user.photo_url || '',
        school_id: user.school_id,
        school_type,
        school_name,
        theme_settings,
        app_settings: user.app_settings || user.app_permissions || {}
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || !user.is_active) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { school_type, school_name, theme_settings } = await getSchoolMeta(user.school_id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact_number: user.contact_number || '',
        photo_url: user.photo_url || '',
        school_id: user.school_id,
        school_type,
        school_name,
        theme_settings,
        app_settings: user.app_settings || user.app_permissions || {}
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getMe };
