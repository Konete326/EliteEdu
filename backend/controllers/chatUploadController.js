const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

const uploadChatMedia = async (req, res) => {
  try {
    const filePayload = req.body?.dataUrl || req.body?.file || req.body?.image;
    const name = req.body?.name || 'media';
    if (!filePayload) {
      return res.status(400).json({ success: false, message: 'No file or data URL provided' });
    }
    const secureUrl = await uploadToCloudinary(filePayload, 'eliteedu/chat');
    return res.status(200).json({
      success: true,
      url: secureUrl,
      name
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload media to Cloudinary',
      error: error.message
    });
  }
};

module.exports = { uploadChatMedia };
