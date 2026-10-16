const jwt = require('jsonwebtoken');
const SystemLog = require('../models/SystemLog');

const extractAuthInfo = (req) => {
  let user = req.user || null;
  if (!user && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      user = null;
    }
  }
  return {
    userId: user?.id || null,
    userName: user?.name || req.body.user_name || 'Anonymous',
    userRole: user?.role || req.body.user_role || 'Guest',
    schoolId: user?.school_id || req.body.school_id || null,
    schoolName: user?.school_name || req.body.school_name || 'Global / System'
  };
};

const ingestTelemetry = async (req, res) => {
  try {
    const auth = extractAuthInfo(req);
    const log = await SystemLog.create({
      school_id: auth.schoolId,
      school_name: auth.schoolName,
      user_id: auth.userId,
      user_name: auth.userName,
      user_role: auth.userRole,
      category: req.body.category || 'CONSOLE_ERROR',
      severity: req.body.severity || 'ERROR',
      message: String(req.body.message || 'Unknown Error').slice(0, 2000),
      page_url: req.body.page_url || '',
      last_clicked_element: req.body.last_clicked_element || '',
      endpoint: req.body.endpoint || '',
      method: req.body.method || '',
      status_code: req.body.status_code || null,
      stack_trace: String(req.body.stack_trace || '').slice(0, 5000),
      metadata: req.body.metadata || {}
    });
    return res.status(201).json({ success: true, logId: log._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSingleLog = async (req, res) => {
  try {
    const deleted = await SystemLog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }
    return res.status(200).json({ success: true, message: 'Log deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const clearLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'ALL') {
      filter.category = req.query.category;
    }
    if (req.query.school_id && req.query.school_id !== 'ALL') {
      filter.school_id = req.query.school_id;
    }
    const result = await SystemLog.deleteMany(filter);
    return res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { ingestTelemetry, deleteSingleLog, clearLogs };
