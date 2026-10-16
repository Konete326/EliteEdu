const crypto = require('crypto');

const SECRET_KEY = process.env.JWT_SECRET || 'eliteedu_secure_offline_key_2026';

const generateOfflineSignature = (payload) => {
  const jsonStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', SECRET_KEY).update(jsonStr).digest('hex').slice(0, 16);
};

const createSignedOfflinePayload = (data) => {
  const json = JSON.stringify(data);
  const sig = generateOfflineSignature(json);
  const combined = JSON.stringify({ d: data, s: sig });
  return Buffer.from(combined, 'utf8').toString('base64url');
};

const verifyAndDecodeOfflinePayload = (encoded) => {
  try {
    if (!encoded) return null;
    const jsonStr = Buffer.from(encoded, 'base64url').toString('utf8');
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.d || !parsed.s) return null;
    const expectedSig = generateOfflineSignature(JSON.stringify(parsed.d));
    if (expectedSig !== parsed.s) return null;
    return parsed.d;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateOfflineSignature,
  createSignedOfflinePayload,
  verifyAndDecodeOfflinePayload
};
