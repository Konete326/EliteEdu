const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getSchoolMeta } = require('../utils/schoolMeta');
const { extractClientIp } = require('../utils/uaParser');
const { isIpBlocked, createLoginSession, ensureActiveSession } = require('./authSessionHelper');
const { resolveEffectivePermissions } = require('../utils/permissionResolver');
const { handleStudentLogin, handleStudentGetMe } = require('./authStudentHelper');

const buildUserPayload = (user, meta) => {
  const { effective, appSettings } = resolveEffectivePermissions(user);
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    contact_number: user.contact_number || '',
    photo_url: user.photo_url || '',
    school_id: user.school_id,
    campus_id: user.campus_id,
    last_active_campus: user.last_active_campus || user.campus_id || null,
    assigned_campuses: user.assigned_campuses || [],
    custom_role_id: user.custom_role_id,
    custom_role: user.custom_role_id,
    permissions: user.custom_role_id?.permissions || [],
    effective_permissions: effective,
    dashboard_type: user.custom_role_id?.dashboard_type || (user.role === 'Admin' ? 'AdminDashboard' : 'TeacherDashboard'),
    school_type: meta.school_type,
    school_name: meta.school_name,
    school_logo: meta.school_logo,
    school_slogan: meta.school_slogan,
    theme_settings: meta.theme_settings,
    app_settings: appSettings
  };
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  const identifier = email || req.body.identifier;
  if (!identifier || !password) return res.status(400).json({ message: 'Identifier and password are required' });

  try {
    const cleanId = String(identifier).trim();
    if (role === 'Student') {
      const studentHandled = await handleStudentLogin(cleanId, password, res);
      if (studentHandled) return;
      return res.status(401).json({ message: 'Invalid student credentials or password' });
    }

    const user = await User.findOne({
      $or: [
        { email: cleanId.toLowerCase() },
        { employee_code: cleanId.toUpperCase() },
        { employee_code: cleanId },
        { contact_number: cleanId },
        { phone: cleanId }
      ]
    }).populate('custom_role_id').lean();

    if (!user || user.is_active === false || user.status === 'Inactive') {
      const fallbackHandled = await handleStudentLogin(cleanId, password, res);
      if (fallbackHandled) return;
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const clientIp = extractClientIp(req);
    const [blocked, isMatch] = await Promise.all([
      isIpBlocked(user.school_id, clientIp),
      bcrypt.compare(password, user.password)
    ]);

    if (blocked) return res.status(403).json({ message: 'Access from this IP address has been blocked' });
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const [{ sessionId, tokenId }, meta] = await Promise.all([
      createLoginSession(user, req),
      getSchoolMeta(user.school_id)
    ]);

    const token = jwt.sign(
      {
        id: user._id, name: user.name, role: user.role,
        custom_role_id: user.custom_role_id?._id || user.custom_role_id || null,
        school_id: user.school_id, campus_id: user.campus_id,
        school_type: meta.school_type, school_name: meta.school_name,
        session_id: sessionId, jti: tokenId, token_version: user.token_version || 0
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(200).json({ token, user: buildUserPayload(user, meta) });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    if (req.user?.role === 'Student') {
      return handleStudentGetMe(req.user.student_id || req.user.id, res);
    }
    const user = await User.findById(req.user.id).select('-password').populate('custom_role_id').lean();
    if (!user || user.is_active === false || user.status === 'Inactive') return res.status(404).json({ message: 'User not found' });
    const [, meta] = await Promise.all([
      ensureActiveSession(user, req, req.user?.session_id),
      getSchoolMeta(user.school_id)
    ]);
    res.status(200).json({ user: buildUserPayload(user, meta) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getMe };
