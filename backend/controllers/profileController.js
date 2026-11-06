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
    const userId = req.user?.id || req.user?._id;
    let user = await User.findById(userId);
    let isStudent = false;
    if (!user) {
      const Student = require('../models/Student');
      user = await Student.findById(userId);
      if (user) isStudent = true;
    }
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

    if (isStudent) {
      const Student = require('../models/Student');
      const stUpdate = {};
      if (updateFields.password) stUpdate.portal_password = updateFields.password;
      if (updateFields.photo_url) stUpdate.photo_url = updateFields.photo_url;
      const updatedStudent = await Student.findByIdAndUpdate(userId, { $set: stUpdate }, { new: true }).lean();
      return res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedStudent, profile: updatedStudent });
    }

    if (user.role === 'Teacher') {
      delete updateFields.role;
      delete updateFields.school_id;
      delete updateFields.basic_salary;
      delete updateFields.employee_code;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    )
      .select('-password')
      .populate('campus_id', 'name code address contact_number')
      .populate('assigned_campuses', 'name code')
      .populate('grades', 'name sections')
      .populate('subjects', 'name code')
      .populate('custom_role_id')
      .lean();

    let schoolMeta = null;
    if (updatedUser?.school_id) {
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

const { uploadAvatar } = require('./profileAvatarController');

module.exports = { getProfile, updateProfile, uploadAvatar };
