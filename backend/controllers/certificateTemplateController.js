const CertificateTemplate = require('../models/CertificateTemplate');
const { ensureDefaultTemplates } = require('../utils/certificateSeedHelper');

const getTemplates = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    await ensureDefaultTemplates(schoolId);
    const { recipient_type } = req.query;
    const filter = { school_id: schoolId };
    if (recipient_type && recipient_type !== 'all') {
      filter.$or = [{ recipient_type }, { recipient_type: 'Both' }];
    }
    const templates = await CertificateTemplate.find(filter).sort({ is_default: -1, createdAt: -1 });
    res.status(200).json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch certificate templates', error: err.message });
  }
};

const createTemplate = async (req, res) => {
  try {
    const { name, recipient_type, heading, sub_heading, body_template, design_style, accent_color } = req.body;
    if (!name || !heading || !body_template) {
      return res.status(400).json({ success: false, message: 'Template name, heading, and body are required' });
    }
    const template = await CertificateTemplate.create({
      school_id: req.user.school_id,
      name: name.trim(),
      recipient_type: recipient_type || 'Student',
      heading: heading.trim(),
      sub_heading: sub_heading ? sub_heading.trim() : 'THIS IS TO CERTIFY THAT',
      body_template: body_template.trim(),
      design_style: design_style || 'royal_gold',
      accent_color: accent_color || '#0d9488'
    });
    res.status(201).json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create certificate template', error: err.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await CertificateTemplate.findOneAndUpdate(
      { _id: id, school_id: req.user.school_id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update certificate template', error: err.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await CertificateTemplate.findOneAndDelete({ _id: id, school_id: req.user.school_id });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete template', error: err.message });
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
