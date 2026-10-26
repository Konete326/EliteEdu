const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const { syncUserPermissions } = require('../utils/permissionResolver');

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', campus_id, role, status } = req.query;
    const filter = {};
    if (req.user.role === 'Admin') filter.school_id = req.user.school_id;
    else if (req.query.school_id) filter.school_id = req.query.school_id;

    if (campus_id) filter.campus_id = campus_id;
    if (role) filter.role = role;
    if (status) { filter.status = status; filter.is_active = status === 'Active'; }

    if (search.trim()) {
      const reg = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: reg }, { email: reg }, { contact_number: reg }, { employee_code: reg }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password')
        .populate('campus_id', 'name code city address')
        .populate('assigned_campuses', 'name code')
        .populate('custom_role_id', 'name dashboard_type status')
        .sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      User.countDocuments(filter)
    ]);

    res.status(200).json({ success: true, users, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'Teacher', campus_id, custom_role_id, contact_number } = req.body;
    if (!name || !password) return res.status(400).json({ success: false, message: 'Name and password required' });

    const schoolId = req.user.role === 'Admin' ? req.user.school_id : req.body.school_id;
    const cleanEmail = email ? email.toLowerCase().trim() : null;

    if (cleanEmail) {
      const existing = await User.findOne({ email: cleanEmail }).select('_id').lean();
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const roleDoc = custom_role_id ? await UserRole.findById(custom_role_id).lean() : null;
    const synced = syncUserPermissions({ custom_role_id: roleDoc });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(), email: cleanEmail, password: hashedPassword, role,
      school_id: schoolId, campus_id: campus_id || null,
      assigned_campuses: campus_id ? [campus_id] : [], custom_role_id: custom_role_id || null,
      contact_number: contact_number || '', status: 'Active', is_active: true,
      app_settings: synced.app_settings, app_permissions: synced.app_permissions
    });

    const populated = await User.findById(user._id).select('-password')
      .populate('campus_id', 'name code').populate('assigned_campuses', 'name code')
      .populate('custom_role_id', 'name dashboard_type')
      .lean();

    res.status(201).json({ success: true, user: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, campus_id, custom_role_id, contact_number } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (role) update.role = role;
    if (contact_number !== undefined) update.contact_number = contact_number.trim();
    if (campus_id !== undefined) update.campus_id = campus_id || null;
    if (custom_role_id !== undefined) {
      update.custom_role_id = custom_role_id || null;
      const roleDoc = custom_role_id ? await UserRole.findById(custom_role_id).lean() : null;
      const synced = syncUserPermissions({ custom_role_id: roleDoc });
      update.app_settings = synced.app_settings;
      update.app_permissions = synced.app_permissions;
    }

    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: cleanEmail, _id: { $ne: req.params.id } }).select('_id').lean();
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
      update.email = cleanEmail;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('-password')
      .populate('campus_id', 'name code')
      .populate('assigned_campuses', 'name code')
      .populate('custom_role_id', 'name dashboard_type')
      .lean();

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser };
