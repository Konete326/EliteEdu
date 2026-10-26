const Exam = require('../models/Exam');
const { syncMarkSheetsForExam, notifyStaffForExam } = require('./datesheetSyncHelper');
const { sanitizeExamPayload } = require('../utils/examPayloadSanitizer');

const getDatesheets = async (req, res) => {
  try {
    const school_id = req.user.school_id || req.schoolId;
    const { grade_id, status, session } = req.query;
    const query = { school_id };
    if (grade_id) query.grade_id = grade_id;
    if (status) query.status = status;
    if (session) query.academic_session = session;

    const datesheets = await Exam.find(query)
      .populate('grade_id', 'name')
      .populate('exam_category_id', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = datesheets.map((d) => ({
      _id: d._id,
      session: d.academic_session || '2026-2027',
      class_name: d.grade_id?.name || d.target_classes?.[0]?.grade_name || 'All Classes',
      section: d.section || d.target_classes?.[0]?.section || 'All',
      status: d.status || 'Draft',
      exam_type: d.exam_category_id?.name || d.term_type || 'Exam',
      exam_dates: d.start_date && d.end_date ? `${new Date(d.start_date).toLocaleDateString()} - ${new Date(d.end_date).toLocaleDateString()}` : 'TBD',
      papers_count: d.papers?.length || 0,
      last_updated: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : 'Just now',
      raw: d
    }));

    res.json({ success: true, datesheets: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch datesheets', error: error.message });
  }
};

const getDatesheetById = async (req, res) => {
  try {
    const datesheet = await Exam.findOne({ _id: req.params.id, school_id: req.user.school_id || req.schoolId })
      .populate('grade_id', 'name')
      .populate('exam_category_id', 'name')
      .populate('papers.subject_id', 'name code')
      .populate('papers.examiner_id', 'name')
      .populate('papers.invigilator_id', 'name')
      .lean();
    if (!datesheet) return res.status(404).json({ message: 'Datesheet not found' });
    res.json({ success: true, datesheet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch datesheet', error: error.message });
  }
};

const createDatesheet = async (req, res) => {
  try {
    const school_id = req.user.school_id || req.schoolId;
    const sanitized = sanitizeExamPayload(req.body);
    const title = sanitized.title || `${sanitized.academic_session} ${sanitized.term_type || 'Exam'} ${sanitized.status || 'Datesheet'}`.trim();
    const exam = await Exam.create({
      ...sanitized,
      school_id,
      title,
      created_by: req.user._id || req.user.id
    });
    await syncMarkSheetsForExam(exam, school_id, req.user._id || req.user.id);
    await notifyStaffForExam(exam, school_id, req.user._id || req.user.id);
    res.status(201).json({ success: true, datesheet: exam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create datesheet', error: error.message });
  }
};

const updateDatesheet = async (req, res) => {
  try {
    const school_id = req.user.school_id || req.schoolId;
    const sanitized = sanitizeExamPayload(req.body);
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, school_id },
      { $set: sanitized },
      { new: true }
    );
    if (!exam) return res.status(404).json({ message: 'Datesheet not found' });
    await syncMarkSheetsForExam(exam, school_id, req.user._id || req.user.id);
    await notifyStaffForExam(exam, school_id, req.user._id || req.user.id);
    res.json({ success: true, datesheet: exam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update datesheet', error: error.message });
  }
};

const deleteDatesheet = async (req, res) => {
  try {
    await Exam.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id || req.schoolId });
    res.json({ success: true, message: 'Datesheet removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete datesheet', error: error.message });
  }
};

module.exports = { getDatesheets, getDatesheetById, createDatesheet, updateDatesheet, deleteDatesheet };
