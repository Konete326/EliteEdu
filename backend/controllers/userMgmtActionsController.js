const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

const toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const targetStatus = status === 'Active' ? 'Active' : 'Inactive';
    const isActive = targetStatus === 'Active';

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: targetStatus, is_active: isActive },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!isActive) {
      await UserSession.updateMany({ user_id: user._id, status: 'Active' }, { status: 'Revoked' });
    }
    res.status(200).json({ success: true, user, message: `User status updated to ${targetStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await UserSession.updateMany({ user_id: user._id, status: 'Active' }, { status: 'Revoked' });
    res.status(200).json({ success: true, message: 'Password reset successfully. Active sessions revoked.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignUserCampuses = async (req, res) => {
  try {
    const { campus_id, assigned_campuses = [] } = req.body;
    const campusesArray = Array.from(new Set([...(campus_id ? [campus_id] : []), ...assigned_campuses]));

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { campus_id: campus_id || (campusesArray[0] || null), assigned_campuses: campusesArray },
      { new: true }
    ).select('-password').populate('campus_id', 'name code').populate('assigned_campuses', 'name code');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await UserSession.deleteMany({ user_id: req.params.id });
    res.status(200).json({ success: true, message: 'User and sessions removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { toggleUserStatus, resetUserPassword, assignUserCampuses, deleteUser };
