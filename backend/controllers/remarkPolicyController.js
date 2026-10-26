const RemarkPolicy = require('../models/RemarkPolicy');

const DEFAULT_REMARKS = [
  { type: 'Teacher', remark: 'Excellent academic performance and consistency.', from_percent: 80, to_percent: 100, apply_to_all_classes: true, target_grades: [] },
  { type: 'Teacher', remark: 'Good effort, keep striving for higher excellence.', from_percent: 60, to_percent: 79, apply_to_all_classes: true, target_grades: [] },
  { type: 'Teacher', remark: 'Satisfactory, needs focused study in weak areas.', from_percent: 40, to_percent: 59, apply_to_all_classes: true, target_grades: [] },
  { type: 'Teacher', remark: 'Requires urgent revision and dedicated guidance.', from_percent: 0, to_percent: 39, apply_to_all_classes: true, target_grades: [] },
  { type: 'Principal', remark: 'Passed with high distinction. Keep shining!', from_percent: 80, to_percent: 100, apply_to_all_classes: true, target_grades: [] },
  { type: 'Principal', remark: 'Good standing. Regular attendance required.', from_percent: 50, to_percent: 79, apply_to_all_classes: true, target_grades: [] },
  { type: 'Principal', remark: 'Academic warning. Parent meeting recommended.', from_percent: 0, to_percent: 49, apply_to_all_classes: true, target_grades: [] }
];

const getRemarkPolicies = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    let policies = await RemarkPolicy.find({ school_id }).populate('target_grades', 'name').sort({ type: 1, from_percent: -1 }).lean();
    if (policies.length === 0) {
      policies = await RemarkPolicy.insertMany(DEFAULT_REMARKS.map(r => ({ ...r, school_id })));
    }
    res.json({ success: true, policies });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch remarks policy', error: error.message });
  }
};

const saveRemarkPolicies = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { policies } = req.body;
    if (!Array.isArray(policies) || policies.length === 0) {
      return res.status(400).json({ message: 'Policies array cannot be empty' });
    }
    for (const p of policies) {
      if (!p.remark?.trim()) return res.status(400).json({ message: 'Remark text is required' });
      if (p.from_percent === undefined || p.to_percent === undefined) {
        return res.status(400).json({ message: 'From and To percentages are required' });
      }
    }
    await RemarkPolicy.deleteMany({ school_id });
    const saved = await RemarkPolicy.insertMany(policies.map(p => ({
      school_id, type: p.type || 'Teacher', remark: p.remark.trim(),
      from_percent: Number(p.from_percent), to_percent: Number(p.to_percent),
      apply_to_all_classes: p.apply_to_all_classes !== false,
      target_grades: Array.isArray(p.target_grades) ? p.target_grades : []
    })));
    res.json({ success: true, message: 'Remarks policy saved successfully', policies: saved });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save remarks policy', error: error.message });
  }
};

const deleteRemarkPolicy = async (req, res) => {
  try {
    await RemarkPolicy.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Policy removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete policy', error: error.message });
  }
};

module.exports = { getRemarkPolicies, saveRemarkPolicies, deleteRemarkPolicy };
