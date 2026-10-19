const Exam = require('../models/Exam');
const ExamMark = require('../models/ExamMark');
const MarkSheet = require('../models/MarkSheet');
const { dispatchExaminerAlerts } = require('../utils/examAlertDispatcher');
const { syncMarkSheetsForExam } = require('./datesheetSyncHelper');
const { sanitizeExamPayload } = require('../utils/examPayloadSanitizer');

const getExams = async (req, res) => {
  try {
    const schoolId = req.user.school_id || req.schoolId;
    const query = { school_id: schoolId };

    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.term_type && req.query.term_type !== 'All') query.term_type = req.query.term_type;
    if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
    if (req.query.search && req.query.search.trim()) {
      query.title = new RegExp(req.query.search.trim(), 'i');
    }

    if (req.user.role === 'Teacher' && !req.user.permissions?.exam_management) {
      query['papers.examiner_id'] = req.user._id || req.user.id;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [exams, total] = await Promise.all([
      Exam.find(query)
        .populate('campus_id', 'name code')
        .populate('grading_policy_id', 'grading_scale fail_criteria')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Exam.countDocuments(query)
    ]);

    res.status(200).json({ success: true, exams, total, page, totalPages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const schoolId = req.user.school_id || req.schoolId;
    const exam = await Exam.findOne({ _id: req.params.id, school_id: schoolId })
      .populate('campus_id', 'name code address logo')
      .populate('grading_policy_id');
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.status(200).json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createExam = async (req, res) => {
  try {
    const schoolId = req.user.school_id || req.schoolId;
    const sanitized = sanitizeExamPayload(req.body);
    const title = sanitized.title || `${sanitized.academic_session} ${sanitized.term_type || 'Exam'}`.trim();
    const exam = await Exam.create({
      ...sanitized,
      school_id: schoolId,
      title,
      created_by: req.user._id || req.user.id
    });
    await syncMarkSheetsForExam(exam, schoolId, req.user._id || req.user.id);
    dispatchExaminerAlerts(exam, schoolId, req.user._id || req.user.id);
    res.status(201).json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const schoolId = req.user.school_id || req.schoolId;
    const sanitized = sanitizeExamPayload(req.body);
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { $set: sanitized },
      { new: true }
    );
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    await syncMarkSheetsForExam(exam, schoolId, req.user._id || req.user.id);
    dispatchExaminerAlerts(exam, schoolId, req.user._id || req.user.id);
    res.status(200).json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const schoolId = req.user.school_id || req.schoolId;
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    await Promise.all([
      ExamMark.deleteMany({ exam_id: req.params.id, school_id: schoolId }),
      MarkSheet.deleteMany({ exam_id: req.params.id, school_id: schoolId })
    ]);
    res.status(200).json({ success: true, message: 'Exam removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getExams, getExamById, createExam, updateExam, deleteExam };
