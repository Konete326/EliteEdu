const Exam = require('../models/Exam');
const ExamMark = require('../models/ExamMark');
const DigitalSignature = require('../models/DigitalSignature');

const getExamPrintData = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const [exam, marks, signature, stamp] = await Promise.all([
      Exam.findOne({ _id: req.params.id, school_id: schoolId })
        .populate('campus_id')
        .populate('grading_policy_id')
        .lean(),
      ExamMark.find({ exam_id: req.params.id, school_id: schoolId })
        .populate('student_id', 'name father_name gr_number roll_number')
        .lean(),
      DigitalSignature.findOne({ school_id: schoolId, is_stamp: false, is_default: true }).lean(),
      DigitalSignature.findOne({ school_id: schoolId, is_stamp: true, is_default: true }).lean()
    ]);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.status(200).json({ success: true, exam, marks, signature, stamp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getExamPrintData };
