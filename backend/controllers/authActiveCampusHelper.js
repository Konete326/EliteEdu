const mongoose = require('mongoose');
const User = require('../models/User');

const updateActiveCampus = async (req, res) => {
  try {
    const { campus_id } = req.body;
    const campusRef = (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id))
      ? new mongoose.Types.ObjectId(String(campus_id))
      : null;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { last_active_campus: campusRef } },
      { new: true }
    ).select('last_active_campus');

    res.status(200).json({ success: true, last_active_campus: user?.last_active_campus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update active campus preference' });
  }
};

module.exports = { updateActiveCampus };
