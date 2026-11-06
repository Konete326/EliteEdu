const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

const uploadAvatar = async (req, res) => {
  try {
    const filePayload = req.body?.image || req.body?.dataUrl || req.body?.file;
    if (!filePayload) {
      return res.status(400).json({ success: false, message: 'No image provided for upload' });
    }
    const secureUrl = await uploadToCloudinary(filePayload, 'eliteedu/avatars');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { photo_url: secureUrl } },
      { new: true }
    )
      .select('-password')
      .populate('campus_id', 'name code address contact_number')
      .populate('assigned_campuses', 'name code')
      .populate('grades', 'name sections')
      .populate('subjects', 'name code')
      .populate('custom_role_id')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Avatar uploaded and updated successfully',
      photo_url: secureUrl,
      user: updatedUser,
      profile: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload avatar to Cloudinary'
    });
  }
};

module.exports = { uploadAvatar };
