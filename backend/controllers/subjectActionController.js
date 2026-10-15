const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Campus = require('../models/Campus');
const { DEFAULT_SUBJECTS } = require('../utils/curriculumDefaults');

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
    const existingMap = new Map(existing.map((s) => [s.name.toLowerCase().trim(), s]));

    const toInsert = [];
    const updatePromises = [];

    for (const s of DEFAULT_SUBJECTS) {
      const key = s.name.toLowerCase().trim();
      const match = existingMap.get(key);
      if (!match) {
        toInsert.push({
          school_id: schoolId,
          campus_id: campusRef,
          name: s.name,
          code: s.code,
          status: 'Active',
          mandatory: s.mandatory,
          classes: s.classes || []
        });
      } else if (!match.classes || match.classes.length === 0) {
        updatePromises.push(
          Subject.updateOne({ _id: match._id }, { $set: { classes: s.classes || [] } })
        );
      }
    }

    if (toInsert.length > 0) {
      await Subject.insertMany(toInsert);
    }
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    res.status(200).json({
      success: true,
      count: toInsert.length,
      updated: updatePromises.length,
      message: `Standard curriculum subjects loaded successfully (${toInsert.length} added, ${updatePromises.length} synced)`
    });
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
