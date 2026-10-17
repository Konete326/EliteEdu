const RemarkTemplate = require('../models/RemarkTemplate');

const getRemarkTemplates = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    let templates = await RemarkTemplate.find({ school_id }).populate('subjects', 'name code').sort({ createdAt: -1 });
    if (templates.length === 0) {
      const defaults = [
        { name: 'Consistent High Achiever', text: 'Demonstrates exceptional understanding, analytical skills, and consistent preparation.' },
        { name: 'Active Participant', text: 'Actively participates in class discussions and completes assignments diligently.' },
        { name: 'Needs Conceptual Revision', text: 'Struggles with basic concepts and requires regular revision and practice at home.' }
      ];
      templates = await RemarkTemplate.insertMany(defaults.map(d => ({ ...d, school_id, subjects: [] })));
    }
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch remarks', error: error.message });
  }
};

const createRemarkTemplate = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { name, text, subjects } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Remark name is required' });
    const template = await RemarkTemplate.create({
      school_id, name: name.trim(), text: text || '', subjects: Array.isArray(subjects) ? subjects : []
    });
    const populated = await RemarkTemplate.findById(template._id).populate('subjects', 'name code');
    res.status(201).json({ success: true, template: populated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create remark template', error: error.message });
  }
};

const updateRemarkTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await RemarkTemplate.findOneAndUpdate(
      { _id: id, school_id: req.user.school_id },
      req.body,
      { new: true }
    ).populate('subjects', 'name code');
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update template', error: error.message });
  }
};

const deleteRemarkTemplate = async (req, res) => {
  try {
    await RemarkTemplate.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Template removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete template', error: error.message });
  }
};

module.exports = { getRemarkTemplates, createRemarkTemplate, updateRemarkTemplate, deleteRemarkTemplate };
