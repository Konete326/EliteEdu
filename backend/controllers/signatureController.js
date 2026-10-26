const DigitalSignature = require('../models/DigitalSignature');

const getSignatures = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const filter = { school_id: schoolId };
    if (req.query.is_stamp !== undefined) {
      filter.is_stamp = req.query.is_stamp === 'true';
    }
    if (req.user.role === 'Teacher') {
      const uId = req.user._id || req.user.id;
      filter.$or = [
        { user_id: uId },
        { is_stamp: true }
      ];
    }
    const items = await DigitalSignature.find(filter)
      .populate('user_id', 'name email role')
      .sort({ is_default: -1, createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const createSignature = async (req, res) => {
  try {
    const { label, type, image_url, is_default, is_stamp } = req.body;
    if (!label || !image_url) {
      return res.status(400).json({ success: false, message: 'Label and signature image are required' });
    }
    const schoolId = req.user.school_id;
    const userId = req.user?._id || req.user?.id || req.body?.user_id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User identifier is required' });
    }
    if (is_default) {
      await DigitalSignature.updateMany(
        { school_id: schoolId, is_stamp: Boolean(is_stamp) },
        { $set: { is_default: false } }
      );
    }
    const signature = await DigitalSignature.create({
      school_id: schoolId,
      user_id: userId,
      label: label.trim(),
      type: type || 'Upload',
      image_url,
      is_default: Boolean(is_default),
      is_stamp: Boolean(is_stamp)
    });
    res.status(201).json({ success: true, data: signature });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const setDefaultSignature = async (req, res) => {
  try {
    const signature = await DigitalSignature.findOne({
      _id: req.params.id,
      school_id: req.user.school_id
    });
    if (!signature) {
      return res.status(404).json({ success: false, message: 'Signature not found' });
    }
    await DigitalSignature.updateMany(
      { school_id: req.user.school_id, is_stamp: signature.is_stamp },
      { $set: { is_default: false } }
    );
    signature.is_default = true;
    await signature.save();
    res.status(200).json({ success: true, data: signature });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSignature = async (req, res) => {
  try {
    const signature = await DigitalSignature.findOneAndDelete({
      _id: req.params.id,
      school_id: req.user.school_id
    });
    if (!signature) {
      return res.status(404).json({ success: false, message: 'Signature not found' });
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getSignatures,
  createSignature,
  setDefaultSignature,
  deleteSignature
};
