const crypto = require('crypto');
const UserSession = require('../models/UserSession');
const BlockedIp = require('../models/BlockedIp');
const { parseUserAgent, extractClientIp } = require('../utils/uaParser');

const isIpBlocked = async (schoolId, ipAddress) => {
  if (!ipAddress) return false;
  const filter = { ip_address: ipAddress };
  if (schoolId) filter.school_id = schoolId;
  const blocked = await BlockedIp.findOne(filter).select('_id').lean();
  return Boolean(blocked);
};

const createLoginSession = async (user, req) => {
  const ipAddress = extractClientIp(req);
  const device = parseUserAgent(req.headers['user-agent']);
  const tokenId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const prevSession = await UserSession.findOne({ user_id: user._id })
    .sort({ createdAt: -1 })
    .select('ip_address')
    .lean();

  let isSuspicious = false;
  if (prevSession && prevSession.ip_address && ipAddress) {
    const isLocal = ['127.0.0.1', '::1', 'localhost', '10.0.0.2'].includes(ipAddress);
    if (!isLocal && prevSession.ip_address !== ipAddress) {
      isSuspicious = true;
    }
  }

  const session = await UserSession.create({
    school_id: user.school_id || null,
    user_id: user._id,
    token_id: tokenId,
    ip_address: ipAddress,
    device,
    is_suspicious: isSuspicious,
    last_active: new Date(),
    expires_at: expiresAt,
    status: 'Active'
  });

  return { sessionId: session._id, tokenId };
};

const verifySession = async (sessionId, tokenVersion) => {
  if (!sessionId) return { valid: true };
  const session = await UserSession.findById(sessionId).populate('user_id', 'token_version status is_active').lean();
  if (!session) return { valid: false, reason: 'Session expired or revoked' };
  if (session.status !== 'Active') return { valid: false, reason: 'Session revoked' };
  if (session.expires_at && new Date() > session.expires_at) {
    return { valid: false, reason: 'Session expired' };
  }
  if (session.user_id) {
    const usr = session.user_id;
    if (usr.is_active === false || usr.status === 'Inactive') {
      return { valid: false, reason: 'Account deactivated' };
    }
    if (tokenVersion !== undefined && (usr.token_version || 0) > tokenVersion) {
      return { valid: false, reason: 'Session revoked' };
    }
  }
  UserSession.findByIdAndUpdate(sessionId, { last_active: new Date() }).exec();
  return { valid: true, session };
};

const ensureActiveSession = async (user, req, currentSessionId) => {
  const ipAddress = extractClientIp(req);
  const blocked = await isIpBlocked(user.school_id, ipAddress);
  if (blocked) return null;

  if (currentSessionId) {
    const existing = await UserSession.findById(currentSessionId).lean();
    if (existing && existing.status === 'Active') {
      await UserSession.findByIdAndUpdate(currentSessionId, { last_active: new Date() });
      return existing;
    }
  }
  const device = parseUserAgent(req.headers['user-agent']);
  return UserSession.findOneAndUpdate(
    { user_id: user._id, status: 'Active' },
    {
      school_id: user.school_id || null,
      user_id: user._id,
      token_id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'),
      ip_address: ipAddress,
      device,
      last_active: new Date(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Active'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = {
  isIpBlocked,
  createLoginSession,
  verifySession,
  ensureActiveSession
};
