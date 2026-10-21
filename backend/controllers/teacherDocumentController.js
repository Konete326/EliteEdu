const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

const uploadTeacherDocument = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const teacherId = req.params.id || req.user.id;
    const { title, file_url, file_base64, file_name } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Document title is required' });
    }

    let finalUrl = file_url || '';
    if (file_base64) {
      finalUrl = await uploadToCloudinary(file_base64, 'eliteedu/teachers/docs');
    }

    if (!finalUrl) {
      return res.status(400).json({ message: 'Valid document file or URL is required' });
    }

    const docObj = {
      title: title.trim(),
      file_url: finalUrl,
      file_name: file_name?.trim() || title.trim(),
      uploaded_at: new Date()
    };

    const teacher = await User.findOneAndUpdate(
      { _id: teacherId, school_id: schoolId },
      { $push: { documents: docObj } },
      { new: true }
    ).select('documents');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ success: true, documents: teacher.documents, newDocument: docObj });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};

const deleteTeacherDocument = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const teacherId = req.params.id || req.user.id;
    const { docId } = req.params;

    const teacher = await User.findOneAndUpdate(
      { _id: teacherId, school_id: schoolId },
      { $pull: { documents: { _id: docId } } },
      { new: true }
    ).select('documents');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ success: true, documents: teacher.documents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};

const updateTeacherSelfProfile = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const teacherId = req.user.id;
    const b = req.body;
    const allowedUpdates = {};

    ['father_name', 'spouse_name', 'contact_number', 'whatsapp_number', 'photo_url',
     'qualification', 'specialization', 'current_address', 'permanent_address', 'city',
     'blood_group', 'emergency_contact', 'bank_details'].forEach((field) => {
      if (b[field] !== undefined) allowedUpdates[field] = b[field];
    });

    const teacher = await User.findOneAndUpdate(
      { _id: teacherId, school_id: schoolId },
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

module.exports = {
  uploadTeacherDocument,
  deleteTeacherDocument,
  updateTeacherSelfProfile
};
