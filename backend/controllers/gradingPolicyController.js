const { GradingPolicy, DEFAULT_SCALE, DEFAULT_POLICIES, DEFAULT_FAIL_CRITERIA } = require('../models/GradingPolicy');
const resolveCampusRef = require('../utils/campusResolver');

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
        policies: DEFAULT_POLICIES,
        grading_scale: DEFAULT_SCALE,
        fail_criteria: DEFAULT_FAIL_CRITERIA
      });
    } else if (!policy.policies || policy.policies.length === 0) {
      policy.policies = DEFAULT_POLICIES;
      await policy.save();
    }

    res.status(200).json({ success: true, policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grading policy', error: error.message });
  }
};

const savePolicies = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, policies } = req.body;
    if (!Array.isArray(policies) || policies.length === 0) {
      return res.status(400).json({ message: 'Policies array cannot be empty' });
    }

    const legacyScale = policies.map(p => ({
      grade: p.letter_grade,
      percent_from: Number(p.from_percent),
      percent_upto: Number(p.to_percent),
      status: Number(p.from_percent) >= 33 ? 'PASS' : 'FAIL',
      remarks: p.status || ''
    }));

    const campusRef = await resolveCampusRef(campus_id, schoolId);
    const policy = await GradingPolicy.findOneAndUpdate(
      { school_id: schoolId, campus_id: campusRef },
      { policies, grading_scale: legacyScale },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Policies saved successfully', policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save policies', error: error.message });
  }
};

const saveFailCriteria = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, overall_percentage, subject_percentage, min_failed_subjects } = req.body;
    const campusRef = await resolveCampusRef(campus_id, schoolId);
    const policy = await GradingPolicy.findOneAndUpdate(
      { school_id: schoolId, campus_id: campusRef },
      { fail_criteria: { overall_percentage, subject_percentage, min_failed_subjects } },
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
    const campusRef = await resolveCampusRef(req.body.campus_id, schoolId);
    const policy = await GradingPolicy.findOneAndUpdate(
      { school_id: schoolId, campus_id: campusRef },
      { policies: DEFAULT_POLICIES, grading_scale: DEFAULT_SCALE, fail_criteria: DEFAULT_FAIL_CRITERIA },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, message: 'Standard policies reset successfully', policy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset standard scale', error: error.message });
  }
};

module.exports = { getGradingPolicy, savePolicies, saveFailCriteria, resetDefaultScale, saveGradingScale: savePolicies };
