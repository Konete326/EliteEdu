const User = require('../models/User');
const School = require('../models/School');
const { sanitizeProfileBody, processProfileDocuments, verifyAndHashPassword } = require('../utils/profileUpdateHelper');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('campus_id', 'name code address contact_number')
      .populate('assigned_campuses', 'name code')
      .populate('grades', 'name sections')
      .populate('subjects', 'name code')
      .populate('custom_role_id')
      .lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let schoolMeta = null;
    if (user.school_id) {
      schoolMeta = await School.findById(user.school_id).select('name school_type theme_settings logo slogan').lean();
    }

    res.status(200).json({
      success: true,
      profile: user,
      user,
      school: schoolMeta
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updateFields = sanitizeProfileBody(req.body);
    if (updateFields.name !== undefined && !updateFields.name) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    if (updateFields.photo_url && String(updateFields.photo_url).startsWith('data:image/')) {
      try {
        updateFields.photo_url = await uploadToCloudinary(updateFields.photo_url, 'eliteedu/avatars');
      } catch (err) {}
    }

    if (updateFields.documents) {
      updateFields.documents = await processProfileDocuments(updateFields.documents);
    }

    if (req.body.new_password) {
      updateFields.password = await verifyAndHashPassword(user, req.body.current_password, req.body.new_password);
    }

    if (user.role === 'Teacher') {
      delete updateFields.role;
      delete updateFields.school_id;
      delete updateFields.basic_salary;
      delete updateFields.employee_code;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('campus_id', 'name code address contact_number')
      .populate('assigned_campuses', 'name code')
      .populate('grades', 'name sections')
      .populate('subjects', 'name code')
      .populate('custom_role_id')
      .lean();

    let schoolMeta = null;
    if (updatedUser.school_id) {
      schoolMeta = await School.findById(updatedUser.school_id).select('name school_type theme_settings logo slogan').lean();
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
      profile: updatedUser,
      school: schoolMeta
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || 'Failed to update profile' });
  }
};

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

module.exports = { getProfile, updateProfile, uploadAvatar };
