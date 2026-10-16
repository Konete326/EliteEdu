const BlockedIp = require('../models/BlockedIp');
const UserSession = require('../models/UserSession');

const blockIp = async (req, res) => {
  try {
    const { ip_address, reason = 'Blocked by administrator' } = req.body;
    if (!ip_address) return res.status(400).json({ success: false, message: 'IP address required' });

    const schoolId = req.user.role === 'Admin' ? req.user.school_id : req.body.school_id;
    await BlockedIp.findOneAndUpdate(
      { school_id: schoolId, ip_address },
      { school_id: schoolId, ip_address, reason, blocked_by: req.user.id },
      { upsert: true, new: true }
    );
    await UserSession.updateMany({ ip_address, status: 'Active' }, { status: 'Revoked' });
    res.status(200).json({ success: true, message: `IP ${ip_address} has been blocked and active sessions revoked` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unblockIp = async (req, res) => {
  try {
    const schoolId = req.user.role === 'Admin' ? req.user.school_id : null;
    const filter = { ip_address: req.params.ip };
    if (schoolId) filter.school_id = schoolId;
    await BlockedIp.findOneAndDelete(filter);
    res.status(200).json({ success: true, message: `IP ${req.params.ip} unblocked successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { blockIp, unblockIp };
