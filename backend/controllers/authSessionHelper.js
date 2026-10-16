const crypto = require('crypto');
const UserSession = require('../models/UserSession');
const BlockedIp = require('../models/BlockedIp');
const { parseUserAgent, extractClientIp } = require('../utils/uaParser');

const isIpBlocked = async (schoolId, ipAddress) => {
  if (!ipAddress) return false;
  const filter = { ip_address: ipAddress };
  if (schoolId) filter.school_id = schoolId;
  const blocked = await BlockedIp.findOne(filter);
  return Boolean(blocked);
};

const createLoginSession = async (user, req) => {
  const ipAddress = extractClientIp(req);
  const device = parseUserAgent(req.headers['user-agent']);
  const tokenId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await UserSession.create({
    school_id: user.school_id || null,
    user_id: user._id,
    token_id: tokenId,
    ip_address: ipAddress,
    device,
    last_active: new Date(),
    expires_at: expiresAt,
    status: 'Active'
  });

  return { sessionId: session._id, tokenId };
};

const verifySession = async (sessionId) => {
  if (!sessionId) return { valid: true };
  const session = await UserSession.findById(sessionId);
  if (!session) return { valid: true };
  if (session.status === 'Revoked') return { valid: false, reason: 'Session revoked' };
  if (session.expires_at && new Date() > session.expires_at) {
    return { valid: false, reason: 'Session expired' };
  }
  UserSession.findByIdAndUpdate(sessionId, { last_active: new Date() }).exec();
  return { valid: true, session };
};

const ensureActiveSession = async (user, req, currentSessionId) => {
  if (currentSessionId) {
    const existing = await UserSession.findById(currentSessionId);
    if (existing && existing.status === 'Active') {
      await UserSession.findByIdAndUpdate(currentSessionId, { last_active: new Date() });
      return existing;
    }
  }
  const ipAddress = extractClientIp(req);
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
