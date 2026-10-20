const crypto = require('crypto');

const verifyZoomSignature = ({ timestamp, signature, verificationToken, rawBody }) => {
  if (!timestamp || !signature || !verificationToken) return false;
  const message = `v0:${timestamp}:${rawBody}`;
  const hash = crypto.createHmac('sha256', verificationToken).update(message).digest('hex');
  const expected = `v0=${hash}`;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

const generateHandshakeResponse = (plainToken, verificationToken) => {
  const hash = crypto.createHmac('sha256', verificationToken).update(plainToken).digest('hex');
  return { plainToken, encryptedToken: hash };
};

const getZoomAccessToken = async (integration) => {
  if (integration.access_token && integration.token_expires_at && new Date(integration.token_expires_at) > new Date(Date.now() + 60000)) {
    return integration.access_token;
  }
  const auth = Buffer.from(`${integration.client_id}:${integration.client_secret}`).toString('base64');
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${integration.account_id}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.reason || 'Failed to acquire Zoom access token');
  }
  integration.access_token = data.access_token;
  integration.token_expires_at = new Date(Date.now() + ((data.expires_in || 3600) - 120) * 1000);
  integration.last_verified_at = new Date();
  await integration.save();
  return data.access_token;
};

const sendZoomChatMessage = async (integration, { toJid, accountId, title = 'EliteEdu Bot', text = '' }) => {
  const token = await getZoomAccessToken(integration);
  const response = await fetch('https://api.zoom.us/v2/im/chat/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      robot_jid: integration.bot_jid,
      to_jid: toJid,
      account_id: accountId || integration.account_id,
      content: {
        head: {
          text: title,
          sub_head: { text: 'EliteEdu School Management' }
        },
        body: [{ type: 'message', text }]
      }
    })
  });
  return response.json();
};

module.exports = {
  verifyZoomSignature,
  generateHandshakeResponse,
  getZoomAccessToken,
  sendZoomChatMessage
};
