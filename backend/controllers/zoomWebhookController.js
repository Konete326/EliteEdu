const ZoomIntegration = require('../models/ZoomIntegration');
const { verifyZoomSignature, generateHandshakeResponse, sendZoomChatMessage } = require('../utils/zoomApiClient');

const handleZoomWebhook = async (req, res) => {
  try {
    const { event, payload = {} } = req.body;
    const integration = await ZoomIntegration.findOne({
      $or: [{ bot_jid: payload.robot_jid }, { account_id: payload.accountId }, { is_active: true }]
    });

    const verificationToken = integration?.verification_token || process.env.ZOOM_VERIFICATION_TOKEN || '';

    if (event === 'endpoint.url_validation') {
      const plainToken = payload.plainToken || '';
      return res.status(200).json(generateHandshakeResponse(plainToken, verificationToken));
    }

    const timestamp = req.headers['x-zm-request-timestamp'];
    const signature = req.headers['x-zm-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (verificationToken && !verifyZoomSignature({ timestamp, signature, verificationToken, rawBody })) {
      return res.status(401).json({ success: false, message: 'Invalid HMAC signature' });
    }

    if (integration) {
      if (event === 'bot_notification') {
        const cmd = payload.cmd || payload.message || '';
        const toJid = payload.toJid || payload.userJid;
        const replyText = cmd.startsWith('/student')
          ? 'EliteEdu Bot: Student lookup command received. Processing report...'
          : cmd.startsWith('/attendance')
          ? 'EliteEdu Bot: Attendance summary synced for today.'
          : `EliteEdu Bot received: "${cmd}". Type /help for available ERP commands.`;

        await sendZoomChatMessage(integration, { toJid, accountId: payload.accountId, title: 'EliteEdu ERP Bot', text: replyText });
      } else if (event === 'app_deauthorized') {
        integration.is_active = false;
        integration.access_token = '';
      }

      integration.webhook_logs.unshift({
        event: event || 'unknown',
        status: 'Success',
        timestamp: new Date(),
        summary: `Processed ${event} for ${payload.userJid || 'system'}`
      });
      if (integration.webhook_logs.length > 50) integration.webhook_logs = integration.webhook_logs.slice(0, 50);
      await integration.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { handleZoomWebhook };
