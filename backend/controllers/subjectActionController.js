const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Campus = require('../models/Campus');
const { DEFAULT_SUBJECTS } = require('../utils/subjectPresets');

const bulkSeedSubjects = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id } = req.body;
    let campusRef = null;
    if (campus_id && mongoose.Types.ObjectId.isValid(campus_id)) {
      const campus = await Campus.findOne({ _id: campus_id, school_id: schoolId });
      if (campus) campusRef = campus._id;
    }

    const existing = await Subject.find({ school_id: schoolId, campus_id: campusRef });
    const existingNames = new Set(existing.map((s) => s.name.toLowerCase()));

    const toInsert = DEFAULT_SUBJECTS
      .filter((s) => !existingNames.has(s.name.toLowerCase()))
      .map((s) => ({
        school_id: schoolId,
        campus_id: campusRef,
        name: s.name,
        code: s.code,
        status: 'Active',
        mandatory: s.mandatory
      }));

    if (toInsert.length > 0) {
      await Subject.insertMany(toInsert);
    }

    res.status(200).json({ success: true, count: toInsert.length, message: `Added ${toInsert.length} standard subjects` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed standard subjects', error: error.message });
  }
};

const toggleSubjectField = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { field, value } = req.body;

    const subject = await Subject.findOne({ _id: id, school_id: schoolId });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (field === 'status') {
      subject.status = value !== undefined ? value : subject.status === 'Active' ? 'Inactive' : 'Active';
    } else if (field === 'mandatory') {
      subject.mandatory = value !== undefined ? Boolean(value) : !subject.mandatory;
    } else {
      return res.status(400).json({ message: 'Invalid toggle field' });
    }

    await subject.save();
    res.status(200).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle field', error: error.message });
  }
};

module.exports = { bulkSeedSubjects, toggleSubjectField };
