const Student = require('../models/Student');
const School = require('../models/School');
const { generateStudentCardsPdf } = require('../utils/pdf/studentCardPdfRenderer');

const exportStudentCardsPdfHandler = async (req, res, next) => {
  try {
    const schoolId = req.user.school_id;
    const school = await School.findById(schoolId).select('name logo_url slogan contact_number address website affiliation_number').lean();
    const { campus_id, grade_id, studentIds } = { ...req.query, ...req.body };

    const query = { school_id: schoolId };
    if (campus_id && campus_id !== 'all') {
      query.campus_id = campus_id;
    }
    if (grade_id && grade_id !== 'all') {
      query.current_grade = grade_id;
    }
    if (studentIds) {
      const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
      if (ids.length > 0) query._id = { $in: ids };
    }

    const students = await Student.find(query)
      .populate('campus_id', 'name address contact_number')
      .populate('current_grade', 'name')
      .sort({ name: 1 })
      .lean();

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No student records found matching criteria' });
    }

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const baseUrl = `${protocol}://${host}`;

    const pdfBuffer = await generateStudentCardsPdf(students, { baseUrl, school });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Student_ID_Cards_A4_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = { exportStudentCardsPdfHandler };
