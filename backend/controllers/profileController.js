const User = require('../models/User');
const School = require('../models/School');

const updateProfile = async (req, res) => {
  try {
    const { name, contact_number, photo_url } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    const updateFields = { name: name.trim() };
    if (contact_number !== undefined) updateFields.contact_number = contact_number.trim();
    if (photo_url !== undefined) updateFields.photo_url = photo_url;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let school_type = req.user.school_type || null;
    let school_name = req.user.school_name || null;
    if (user.school_id && (!school_type || !school_name)) {
      const school = await School.findById(user.school_id).select('name school_type');
      if (school) {
        school_type = school.school_type;
        school_name = school.name;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact_number: user.contact_number || '',
        photo_url: user.photo_url || '',
        school_id: user.school_id,
        school_type,
        school_name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

module.exports = { updateProfile };
