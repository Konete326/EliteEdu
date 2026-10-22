const AdmissionLetterTemplate = require('../models/AdmissionLetterTemplate');

const getTemplates = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    let list = await AdmissionLetterTemplate.find({ school_id: schoolId })
      .populate('campus_id', 'name')
      .sort({ is_default: -1, createdAt: -1 })
      .lean();

    if (!list.length) {
      const seeded = await AdmissionLetterTemplate.create({
        school_id: schoolId,
        title: 'Standard School Admission Letter',
        is_default: true
      });
      list = [seeded];
    }
    res.status(200).json({ success: true, templates: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const template = await AdmissionLetterTemplate.findOne({ _id: req.params.id, school_id: schoolId });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTemplate = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { title, is_default, ...rest } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title is required' });

    if (is_default) {
      await AdmissionLetterTemplate.updateMany({ school_id: schoolId }, { is_default: false });
    }

    const count = await AdmissionLetterTemplate.countDocuments({ school_id: schoolId });
    const template = await AdmissionLetterTemplate.create({
      ...rest,
      title: title.trim(),
      school_id: schoolId,
      is_default: Boolean(is_default || count === 0)
    });
    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { is_default, ...payload } = req.body;

    if (is_default) {
      await AdmissionLetterTemplate.updateMany(
        { school_id: schoolId, _id: { $ne: req.params.id } },
        { is_default: false }
      );
    }

    const template = await AdmissionLetterTemplate.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { ...payload, ...(is_default !== undefined ? { is_default } : {}) },
      { new: true, runValidators: true }
    );
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const total = await AdmissionLetterTemplate.countDocuments({ school_id: schoolId });
    if (total <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only available template' });
    }

    const template = await AdmissionLetterTemplate.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    if (template.is_default) {
      await AdmissionLetterTemplate.findOneAndUpdate({ school_id: schoolId }, { is_default: true });
    }
    res.status(200).json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
