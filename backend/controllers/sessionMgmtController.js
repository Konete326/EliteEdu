const UserSession = require('../models/UserSession');
const BlockedIp = require('../models/BlockedIp');
const { ensureActiveSession } = require('./authSessionHelper');
const User = require('../models/User');

const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, ip = '', show_revoked = 'false' } = req.query;
    const schoolId = req.user.role === 'Admin' ? req.user.school_id : req.user.school_id;

    const currentUser = await User.findById(req.user.id);
    if (currentUser) {
      await ensureActiveSession(currentUser, req, req.user.session_id);
    }

    const filter = {};
    if (schoolId) filter.school_id = schoolId;
    if (show_revoked !== 'true') filter.status = 'Active';
    if (ip.trim()) filter.ip_address = new RegExp(ip.trim(), 'i');

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [sessions, total, blockedList] = await Promise.all([
      UserSession.find(filter)
        .populate('user_id', 'name email role status')
        .sort({ last_active: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      UserSession.countDocuments(filter),
      BlockedIp.find(schoolId ? { school_id: schoolId } : {}).lean()
    ]);

    const blockedSet = new Set(blockedList.map((b) => b.ip_address));
    const enriched = sessions.map((s) => ({
      ...s,
      is_blocked: blockedSet.has(s.ip_address)
    }));

    res.status(200).json({
      success: true,
      sessions: enriched,
      blockedIps: blockedList.map((b) => b.ip_address),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const revokeSession = async (req, res) => {
  try {
    const session = await UserSession.findByIdAndUpdate(req.params.id, { status: 'Revoked' }, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, message: 'Session revoked successfully', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const revokeUserSessions = async (req, res) => {
  try {
    const result = await UserSession.updateMany({ user_id: req.params.userId, status: 'Active' }, { status: 'Revoked' });
    res.status(200).json({ success: true, message: `Revoked ${result.modifiedCount} active session(s) for user` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const revokeAllSessions = async (req, res) => {
  try {
    const schoolId = req.user.role === 'Admin' ? req.user.school_id : req.body.school_id;
    const filter = { status: 'Active' };
    if (schoolId) filter.school_id = schoolId;
    if (req.user.session_id) filter._id = { $ne: req.user.session_id };

    const result = await UserSession.updateMany(filter, { status: 'Revoked' });
    res.status(200).json({ success: true, message: `All active sessions revoked (${result.modifiedCount} sessions)` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSessions, revokeSession, revokeUserSessions, revokeAllSessions };
