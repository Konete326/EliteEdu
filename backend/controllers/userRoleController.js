const UserRole = require('../models/UserRole');
const User = require('../models/User');
const { getDefaultRoleTemplates } = require('../utils/defaultRolesSeed');
const resolveSchoolId = require('../utils/schoolResolver');

const getRoles = async (req, res) => {
  try {
    const schoolId = await resolveSchoolId(req);
    const filter = schoolId ? { school_id: schoolId } : {};
    if (req.query.campus_id) filter.campus_id = req.query.campus_id;

    let roles = await UserRole.find(filter).populate('campus_id', 'name code').sort({ createdAt: 1 }).lean();

    if (roles.length === 0 && schoolId) {
      const templates = getDefaultRoleTemplates().map((t) => ({ ...t, school_id: schoolId }));
      await UserRole.insertMany(templates);
      roles = await UserRole.find(filter).populate('campus_id', 'name code').sort({ createdAt: 1 }).lean();
    }

    const matchUser = schoolId ? { school_id: schoolId, custom_role_id: { $ne: null } } : { custom_role_id: { $ne: null } };
    const counts = await User.aggregate([{ $match: matchUser }, { $group: { _id: '$custom_role_id', count: { $sum: 1 } } }]);
    const countMap = counts.reduce((acc, c) => ({ ...acc, [String(c._id)]: c.count }), {});
    const enriched = roles.map((r) => ({ ...r, user_count: countMap[String(r._id)] || 0 }));
    res.status(200).json({ success: true, roles: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, dashboard_type, permissions = [], campus_id, status = 'Active' } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Role name is required' });
    const schoolId = await resolveSchoolId(req);
    if (!schoolId) return res.status(400).json({ success: false, message: 'School ID is required' });

    const role = await UserRole.create({
      school_id: schoolId, campus_id: campus_id || null, name: name.trim(),
      description: description ? description.trim() : '',
      dashboard_type: dashboard_type || 'TeacherDashboard',
      permissions, status, is_system: false
    });
    res.status(201).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description, dashboard_type, permissions, campus_id, status } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (description !== undefined) update.description = description.trim();
    if (dashboard_type) update.dashboard_type = dashboard_type;
    if (permissions) update.permissions = permissions;
    if (campus_id !== undefined) update.campus_id = campus_id || null;
    if (status) update.status = status;
    const role = await UserRole.findByIdAndUpdate(req.params.id, update, { new: true }).populate('campus_id', 'name code');
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignDashboard = async (req, res) => {
  try {
    const { dashboard_type } = req.body;
    if (!dashboard_type) return res.status(400).json({ success: false, message: 'Dashboard type is required' });
    const role = await UserRole.findByIdAndUpdate(req.params.id, { dashboard_type }, { new: true });
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const copyRoleToCampus = async (req, res) => {
  try {
    const { target_campus_ids = [] } = req.body;
    const src = await UserRole.findById(req.params.id).lean();
    if (!src) return res.status(404).json({ success: false, message: 'Source role not found' });
    const newRoles = target_campus_ids.map((cid) => ({
      school_id: src.school_id, campus_id: cid, name: src.name, description: src.description,
      dashboard_type: src.dashboard_type, permissions: src.permissions, status: 'Active', is_system: false
    }));
    if (newRoles.length > 0) await UserRole.insertMany(newRoles);
    res.status(201).json({ success: true, count: newRoles.length, message: `Role copied to ${newRoles.length} campus(es)` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await UserRole.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    await User.updateMany({ custom_role_id: req.params.id }, { $set: { custom_role_id: null } });
    res.status(200).json({ success: true, message: 'Role deleted and unlinked from users' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRoles, createRole, updateRole, assignDashboard, copyRoleToCampus, deleteRole };
