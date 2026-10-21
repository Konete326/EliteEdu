const LmsItem = require('../models/LmsItem');
const Student = require('../models/Student');
const { syncSubmissionsToClassTest } = require('../utils/lmsClassTestSync');

const getItemSubmissions = async (req, res) => {
  try {
    const item = await LmsItem.findOne({ _id: req.params.id, school_id: req.schoolId })
      .populate('grade_id', 'name code')
      .populate('subject_id', 'name code');

    if (!item) return res.status(404).json({ success: false, message: 'LMS item not found' });

    const studentQuery = { school_id: req.schoolId, status: 'Active' };
    if (item.grade_id) studentQuery.current_grade = item.grade_id._id || item.grade_id;
    if (item.section) studentQuery.current_section = item.section;
    if (item.campus_id) studentQuery.campus_id = item.campus_id;

    const students = await Student.find(studentQuery)
      .select('name father_name gr_number current_section photo_url')
      .sort({ name: 1 })
      .lean();

    const existingMap = new Map();
    (item.submissions || []).forEach((s) => existingMap.set(String(s.student_id), s));

    const roster = students.map((std) => {
      const sub = existingMap.get(String(std._id));
      return {
        _id: std._id,
        student_id: std._id,
        name: std.name,
        father_name: std.father_name,
        gr_number: std.gr_number,
        section: std.current_section,
        status: sub ? sub.status : 'Pending',
        obtained_marks: sub && sub.obtained_marks !== undefined ? sub.obtained_marks : null,
        remarks: sub ? sub.remarks : '',
        updated_at: sub ? sub.updated_at : null
      };
    });

    res.status(200).json({ success: true, item, roster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateItemSubmissions = async (req, res) => {
  try {
    const { submissions, sync_to_class_test } = req.body;
    if (!Array.isArray(submissions)) {
      return res.status(400).json({ success: false, message: 'Submissions array is required' });
    }

    const item = await LmsItem.findOne({ _id: req.params.id, school_id: req.schoolId });
    if (!item) return res.status(404).json({ success: false, message: 'LMS item not found' });

    item.submissions = submissions.map((s) => ({
      student_id: s.student_id,
      status: s.status || 'Pending',
      obtained_marks: s.obtained_marks !== undefined && s.obtained_marks !== null ? Number(s.obtained_marks) : null,
      remarks: s.remarks || '',
      updated_at: new Date()
    }));

    await item.save();

    let syncedTest = null;
    if (sync_to_class_test) {
      syncedTest = await syncSubmissionsToClassTest(item, item.submissions, req.schoolId, req.user?.id);
    }

    res.status(200).json({
      success: true,
      message: sync_to_class_test
        ? 'Submissions graded and synced to Class Tests register successfully!'
        : 'Submissions graded and updated successfully',
      item,
      classTest: syncedTest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getItemSubmissions, updateItemSubmissions };
