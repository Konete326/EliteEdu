const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getSchoolMeta } = require('../utils/schoolMeta');
const { extractClientIp } = require('../utils/uaParser');
const { isIpBlocked, createLoginSession, ensureActiveSession } = require('./authSessionHelper');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.is_active || user.status === 'Inactive') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const clientIp = extractClientIp(req);
    const blocked = await isIpBlocked(user.school_id, clientIp);
    if (blocked) {
      return res.status(403).json({ message: 'Access from this IP address has been blocked' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { sessionId, tokenId } = await createLoginSession(user, req);
    const meta = await getSchoolMeta(user.school_id);

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        school_id: user.school_id,
        school_type: meta.school_type,
        school_name: meta.school_name,
        session_id: sessionId,
        jti: tokenId
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
        campus_id: user.campus_id,
        custom_role_id: user.custom_role_id,
        school_type: meta.school_type,
        school_name: meta.school_name,
        school_logo: meta.school_logo,
        school_slogan: meta.school_slogan,
        theme_settings: meta.theme_settings,
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
    if (!user || !user.is_active || user.status === 'Inactive') {
      return res.status(404).json({ message: 'User not found' });
    }

    await ensureActiveSession(user, req, req.user?.session_id);
    const meta = await getSchoolMeta(user.school_id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact_number: user.contact_number || '',
        photo_url: user.photo_url || '',
        school_id: user.school_id,
        campus_id: user.campus_id,
        custom_role_id: user.custom_role_id,
        school_type: meta.school_type,
        school_name: meta.school_name,
        school_logo: meta.school_logo,
        school_slogan: meta.school_slogan,
        theme_settings: meta.theme_settings,
        app_settings: user.app_settings || user.app_permissions || {}
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getMe };
