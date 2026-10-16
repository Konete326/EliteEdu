const User = require('../models/User');
const { generateTeacherCardsPdf } = require('../utils/pdf/generateTeacherCardsPdf');

const exportTeacherCardsPdfHandler = async (req, res, next) => {
  try {
    const schoolId = req.user.school_id;
    const { campus_id, sideMode = 'both', style = 'GovtSindh', teacherIds } = { ...req.query, ...req.body };

    const query = { school_id: schoolId, role: 'Teacher' };
    if (campus_id && campus_id !== 'all') {
      query.campus_id = campus_id;
    }
    if (teacherIds) {
      const ids = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
      if (ids.length > 0) query._id = { $in: ids };
    }

    const teachers = await User.find(query)
      .populate('campus_id', 'name address contact_number semis_code')
      .populate('school_id', 'name school_type logo_url slogan')
      .sort({ name: 1 })
      .lean();

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'No staff members found matching criteria' });
    }

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const baseUrl = `${protocol}://${host}`;

    const pdfBuffer = await generateTeacherCardsPdf(teachers, { sideMode, style, baseUrl });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Staff_Service_Cards_A4_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = { exportTeacherCardsPdfHandler };
