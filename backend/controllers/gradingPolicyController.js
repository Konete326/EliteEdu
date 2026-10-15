const mongoose = require('mongoose');
const { GradingPolicy, DEFAULT_SCALE, DEFAULT_FAIL_CRITERIA } = require('../models/GradingPolicy');
const Campus = require('../models/Campus');

const resolveCampusRef = async (campusId, schoolId) => {
  if (!campusId || campusId === 'all' || !mongoose.Types.ObjectId.isValid(campusId)) return null;
  const campus = await Campus.findOne({ _id: campusId, school_id: schoolId });
  return campus ? campus._id : null;
};

const getGradingPolicy = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ message: 'School ID required' });
    const campusRef = await resolveCampusRef(req.query.campus_id, schoolId);

    let policy = await GradingPolicy.findOne({ school_id: schoolId, campus_id: campusRef });
    if (!policy) {
      policy = await GradingPolicy.create({
        school_id: schoolId,
        campus_id: campusRef,
        grading_scale: DEFAULT_SCALE,
        fail_criteria: DEFAULT_FAIL_CRITERIA
      });
    }

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grading policy', error: error.message });
  }
};

const saveGradingScale = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ message: 'School ID required' });
    const { campus_id, grading_scale } = req.body;

    if (!Array.isArray(grading_scale) || grading_scale.length === 0) {
      return res.status(400).json({ message: 'Grading scale cannot be empty' });
    }

    for (const item of grading_scale) {
      if (!item.grade?.trim()) return res.status(400).json({ message: 'Grade name is required for all rows' });
      const from = Number(item.percent_from);
      const upto = Number(item.percent_upto);
      if (isNaN(from) || isNaN(upto) || from < 0 || upto > 100 || from > upto) {
        return res.status(400).json({ message: `Invalid percentage range for grade ${item.grade}` });
      }
      if (!['PASS', 'FAIL'].includes(item.status)) {
        return res.status(400).json({ message: `Status must be PASS or FAIL for grade ${item.grade}` });
      }
    }

    const campusRef = await resolveCampusRef(campus_id, schoolId);
    const policy = await GradingPolicy.findOneAndUpdate(
      { school_id: schoolId, campus_id: campusRef },
      { grading_scale },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Grading scale saved successfully', policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save grading scale', error: error.message });
  }
};

const saveFailCriteria = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ message: 'School ID required' });
    const { campus_id, overall_percentage, subject_percentage, min_failed_subjects } = req.body;

    const op = Number(overall_percentage);
    const sp = Number(subject_percentage);
    const ms = Number(min_failed_subjects);

    if (isNaN(op) || op < 0 || op > 100) return res.status(400).json({ message: 'Overall percentage must be 0-100' });
    if (isNaN(sp) || sp < 0 || sp > 100) return res.status(400).json({ message: 'Subject percentage must be 0-100' });
    if (isNaN(ms) || ms < 1) return res.status(400).json({ message: 'Minimum failed subjects must be at least 1' });

    const campusRef = await resolveCampusRef(campus_id, schoolId);
    const policy = await GradingPolicy.findOneAndUpdate(
      { school_id: schoolId, campus_id: campusRef },
      { fail_criteria: { overall_percentage: op, subject_percentage: sp, min_failed_subjects: ms } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Fail criteria saved successfully', policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save fail criteria', error: error.message });
  }
};

const resetDefaultScale = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ message: 'School ID required' });
    const campusRef = await resolveCampusRef(req.body.campus_id, schoolId);

    const policy = await GradingPolicy.findOneAndUpdate(
      { school_id: schoolId, campus_id: campusRef },
      { grading_scale: DEFAULT_SCALE, fail_criteria: DEFAULT_FAIL_CRITERIA },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Standard scale reset successfully', policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset standard scale', error: error.message });
  }
};

module.exports = {
  getGradingPolicy,
  saveGradingScale,
  saveFailCriteria,
  resetDefaultScale
};
