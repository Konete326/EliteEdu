const MarkSheet = require('../models/MarkSheet');
const Student = require('../models/Student');
const { saveMarks, toggleLock } = require('./markSheetOperationsController');

const getMarkSheets = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, status } = req.query;
    const query = { school_id };
    if (grade_id) query.grade_id = grade_id;
    if (subject_id) query.subject_id = subject_id;
    if (status) query.status = status;

    const sheets = await MarkSheet.find(query)
      .populate('grade_id', 'name')
      .populate('subject_id', 'name code')
      .populate('exam_category_id', 'name')
      .populate('question_paper_id', 'title total_marks')
      .sort({ createdAt: -1 });

    res.json({ success: true, markSheets: sheets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mark sheets', error: error.message });
  }
};

const getMarkSheetById = async (req, res) => {
  try {
    const sheet = await MarkSheet.findOne({ _id: req.params.id, school_id: req.user.school_id })
      .populate('grade_id', 'name')
      .populate('subject_id', 'name code')
      .populate('exam_category_id', 'name')
      .populate('question_paper_id', 'title total_marks sections')
      .populate('marks.student_id', 'first_name last_name name roll_number gender');

    if (!sheet) return res.status(404).json({ message: 'Mark sheet not found' });

    if (!sheet.marks || sheet.marks.length === 0) {
      const students = await Student.find({
        school_id: req.user.school_id,
        grade_id: sheet.grade_id?._id || sheet.grade_id,
        is_active: true
      }).sort({ roll_number: 1, name: 1 });

      sheet.marks = students.map(s => ({
        student_id: s,
        obtained_marks: 0,
        percentage: 0,
        grade: 'F',
        status_color: '#DC2626',
        is_absent: false,
        teacher_remarks: '',
        principal_remarks: ''
      }));
    }

    res.json({ success: true, markSheet: sheet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mark sheet details', error: error.message });
  }
};

const createMarkSheet = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, exam_category_id, exam_date, max_marks, passing_marks, question_paper_id } = req.body;
    if (!grade_id || !subject_id) return res.status(400).json({ message: 'Grade and Subject are required' });

    const sheet = await MarkSheet.create({
      school_id, grade_id, subject_id,
      exam_category_id: exam_category_id || null,
      exam_date: exam_date || new Date(),
      max_marks: Number(max_marks) || 100,
      passing_marks: Number(passing_marks) || 33,
      question_paper_id: question_paper_id || null,
      status: 'Draft',
      created_by: req.user._id
    });

    const populated = await MarkSheet.findById(sheet._id)
      .populate('grade_id', 'name')
      .populate('subject_id', 'name code')
      .populate('exam_category_id', 'name');

    res.status(201).json({ success: true, markSheet: populated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create mark sheet', error: error.message });
  }
};

const deleteMarkSheet = async (req, res) => {
  try {
    await MarkSheet.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Mark sheet removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete mark sheet', error: error.message });
  }
};

module.exports = { getMarkSheets, getMarkSheetById, createMarkSheet, saveMarks, toggleLock, deleteMarkSheet };
