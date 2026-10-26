const mongoose = require('mongoose');
const Grade = require('../models/Grade');
const Campus = require('../models/Campus');

const { DEFAULT_CLASSES } = require('../utils/curriculumDefaults');

const bulkSeedGrades = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id } = req.body;
    let campusRef = null;
    if (campus_id && mongoose.Types.ObjectId.isValid(campus_id)) {
      const campus = await Campus.findOne({ _id: campus_id, school_id: schoolId }).select('_id').lean();
      if (campus) campusRef = campus._id;
    }

    const existing = await Grade.find({ school_id: schoolId, campus_id: campusRef }).select('name').lean();
    const existingNames = new Set(existing.map((g) => g.name.toLowerCase()));

    const toInsert = DEFAULT_CLASSES
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name, index) => ({
        school_id: schoolId,
        campus_id: campusRef,
        name,
        sections: ['A', 'B'],
        status: 'Active',
        order: existing.length + index + 1
      }));

    if (toInsert.length > 0) {
      await Grade.insertMany(toInsert);
    }

    res.status(200).json({ success: true, count: toInsert.length, message: `Added ${toInsert.length} standard grades` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed grades', error: error.message });
  }
};

const toggleGradeStatus = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { status } = req.body;
    const grade = await Grade.findOne({ _id: id, school_id: schoolId });
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    grade.status = status !== undefined ? status : grade.status === 'Active' ? 'Inactive' : 'Active';
    await grade.save();
    res.status(200).json({ success: true, grade });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update grade status', error: error.message });
  }
};

const reorderGrades = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ message: 'orderedIds array required' });
    }
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, school_id: schoolId },
        update: { $set: { order: index + 1 } }
      }
    }));
    await Grade.bulkWrite(bulkOps);
    res.status(200).json({ success: true, message: 'Grades order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder grades', error: error.message });
  }
};

module.exports = { bulkSeedGrades, toggleGradeStatus, reorderGrades };
