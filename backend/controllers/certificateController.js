const IssuedCertificate = require('../models/IssuedCertificate');
const CertificateTemplate = require('../models/CertificateTemplate');
const School = require('../models/School');
const Notification = require('../models/Notification');
const { resolvePlaceholders, resolveRecipient, getNextCertificateNumber } = require('../utils/certificatePlaceholderResolver');

const getIssuedCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', recipient_type = '' } = req.query;
    const filter = { school_id: req.user.school_id };
    if (recipient_type && recipient_type !== 'all') filter.recipient_type = recipient_type;
    if (search) {
      const s = search.trim();
      filter.$or = [
        { certificate_no: new RegExp(s, 'i') },
        { recipient_name: new RegExp(s, 'i') },
        { template_name: new RegExp(s, 'i') }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [certificates, total] = await Promise.all([
      IssuedCertificate.find(filter)
        .populate('student_id', 'photo_url gr_number current_section')
        .populate('staff_id', 'photo_url employee_code designation')
        .populate('campus_id', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      IssuedCertificate.countDocuments(filter)
    ]);
    res.status(200).json({ success: true, certificates, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch issued certificates', error: err.message });
  }
};

const generateCertificate = async (req, res) => {
  try {
    const { template_id, recipient_type, recipient_id, custom_text = '', custom_heading = '', custom_body = '', design_style, orientation, accent_color, issue_date } = req.body;
    const schoolId = req.user.school_id;
    const [template, school] = await Promise.all([
      CertificateTemplate.findById(template_id),
      School.findById(schoolId)
    ]);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    const rec = await resolveRecipient(schoolId, recipient_type, recipient_id);
    if (!rec) return res.status(404).json({ success: false, message: `${recipient_type} not found` });

    const resolvedBody = custom_body && custom_body.trim()
      ? custom_body.trim()
      : resolvePlaceholders(template.body_template, rec.entity, recipient_type, custom_text, school?.name);
    const heading = custom_heading && custom_heading.trim() ? custom_heading.trim() : template.heading;
    const certNo = await getNextCertificateNumber(schoolId);

    const certificate = await IssuedCertificate.create({
      school_id: schoolId,
      campus_id: rec.campusId,
      certificate_no: certNo,
      template_id: template._id,
      template_name: template.name,
      heading,
      design_style: design_style || template.design_style || 'academic_gold_hatch',
      orientation: orientation || template.orientation || 'landscape',
      accent_color: accent_color || template.accent_color || '#b59449',
      recipient_type,
      student_id: recipient_type === 'Student' ? rec.entity._id : null,
      staff_id: recipient_type === 'Staff' ? rec.entity._id : null,
      recipient_name: rec.entity.name,
      father_name: rec.entity.father_name || '',
      identifier_code: rec.identifierCode,
      class_or_designation: rec.classOrDesig,
      custom_text,
      resolved_body: resolvedBody,
      issue_date: issue_date ? new Date(issue_date) : new Date(),
      issued_by: req.user._id
    });

    await Notification.create({
      school_id: schoolId,
      recipient_id: req.user._id,
      title: 'Certificate Generated',
      message: `Certificate ${certNo} (${template.name}) was generated for ${rec.entity.name}.`,
      type: 'general',
      module: 'certificates'
    }).catch(() => {});

    res.status(201).json({ success: true, certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate certificate', error: err.message });
  }
};

const deleteIssuedCertificate = async (req, res) => {
  try {
    const certificate = await IssuedCertificate.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete certificate', error: err.message });
  }
};

module.exports = {
  getIssuedCertificates,
  generateCertificate,
  deleteIssuedCertificate
};
