const ZoomIntegration = require('../models/ZoomIntegration');
const { getZoomAccessToken } = require('../utils/zoomApiClient');

const getZoomSettings = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    let integration = await ZoomIntegration.findOne({ school_id: schoolId }).lean();
    if (!integration) {
      const created = await ZoomIntegration.create({
        school_id: schoolId,
        webhook_url: `${req.protocol}://${req.get('host')}/api/zoom/webhook`
      });
      integration = created.toObject();
    }
    const safeData = { ...integration };
    if (safeData.client_secret) {
      safeData.client_secret = '••••••••';
    }
    res.status(200).json({ success: true, data: safeData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch Zoom settings', error: error.message });
  }
};

const updateZoomSettings = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const { client_id, client_secret, account_id, bot_jid, verification_token, webhook_url, is_active } = req.body;

    let integration = await ZoomIntegration.findOne({ school_id: schoolId });
    if (!integration) {
      integration = new ZoomIntegration({ school_id: schoolId });
    }

    if (client_id !== undefined) integration.client_id = client_id;
    if (client_secret && !client_secret.includes('••••')) integration.client_secret = client_secret;
    if (account_id !== undefined) integration.account_id = account_id;
    if (bot_jid !== undefined) integration.bot_jid = bot_jid;
    if (verification_token !== undefined) integration.verification_token = verification_token;
    if (webhook_url !== undefined) integration.webhook_url = webhook_url;
    if (is_active !== undefined) integration.is_active = is_active;

    await integration.save();
    res.status(200).json({ success: true, message: 'Zoom settings updated successfully', data: integration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update Zoom settings', error: error.message });
  }
};

const testZoomConnection = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const integration = await ZoomIntegration.findOne({ school_id: schoolId });
    if (!integration || !integration.client_id || !integration.client_secret || !integration.account_id) {
      return res.status(400).json({ success: false, message: 'Client ID, Secret, and Account ID are required' });
    }

    await getZoomAccessToken(integration);
    integration.last_verified_at = new Date();
    integration.last_error = '';
    await integration.save();

    res.status(200).json({ success: true, message: 'Successfully connected to Zoom Team Chat API!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Zoom connection test failed' });
  }
};

module.exports = {
  getZoomSettings,
  updateZoomSettings,
  testZoomConnection
};
