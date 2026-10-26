const ClassTest = require('../models/ClassTest');
const { canTeacherAccessClassTest, buildTeacherFilter } = require('../utils/classTestGuard');
const { notifyTeacherAssignedTest } = require('../utils/classTestAlertDispatcher');

const getClassTests = async (req, res) => {
  try {
    const { grade_id, section, subject_id, teacher_id, status, from_date, to_date, search } = req.query;
    const query = { school_id: req.user.school_id, ...buildTeacherFilter(req.user) };
    if (grade_id) query.grade_id = grade_id;
    if (section && section !== 'All') query.section = section;
    if (subject_id) query.subject_id = subject_id;
    if (teacher_id) query.teacher_id = teacher_id;
    if (status && status !== 'All') query.status = status;
    if (from_date || to_date) {
      query.test_date = {};
      if (from_date) query.test_date.$gte = new Date(from_date);
      if (to_date) query.test_date.$lte = new Date(to_date);
    }
    if (search?.trim()) query.title = new RegExp(search.trim(), 'i');

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [tests, total] = await Promise.all([
      ClassTest.find(query).populate('grade_id', 'name code sections').populate('subject_id', 'name code').populate('teacher_id', 'name employee_code designation').populate('campus_id', 'name code').sort({ test_date: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      ClassTest.countDocuments(query)
    ]);
    res.status(200).json({ success: true, tests, total, page, totalPages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getClassTestById = async (req, res) => {
  try {
    const test = await ClassTest.findOne({ _id: req.params.id, school_id: req.user.school_id }).populate('grade_id', 'name code sections').populate('subject_id', 'name code').populate('teacher_id', 'name employee_code designation').populate('campus_id', 'name code').lean();
    if (!test) return res.status(404).json({ success: false, message: 'Class test not found' });
    if (!canTeacherAccessClassTest(req.user, test.grade_id?._id, test.section, test.subject_id?._id, test.teacher_id?._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied.' });
    }
    res.status(200).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createClassTest = async (req, res) => {
  try {
    const { grade_id, section, subject_id, teacher_id } = req.body;
    if (!canTeacherAccessClassTest(req.user, grade_id, section, subject_id, teacher_id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only create tests for your assigned classes/subjects.' });
    }
    const test = await ClassTest.create({ ...req.body, school_id: req.user.school_id, created_by: req.user._id || req.user.id });
    if (test.teacher_id && String(test.teacher_id) !== String(req.user._id || req.user.id)) {
      notifyTeacherAssignedTest(test, req.user.school_id, req.user._id || req.user.id);
    }
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateClassTest = async (req, res) => {
  try {
    const existing = await ClassTest.findOne({ _id: req.params.id, school_id: req.user.school_id }).select('grade_id section subject_id teacher_id').lean();
    if (!existing) return res.status(404).json({ success: false, message: 'Class test not found' });
    if (!canTeacherAccessClassTest(req.user, existing.grade_id, existing.section, existing.subject_id, existing.teacher_id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Unauthorized update.' });
    }
    const updated = await ClassTest.findOneAndUpdate({ _id: req.params.id, school_id: req.user.school_id }, { $set: req.body }, { new: true, runValidators: true });
    if (updated.teacher_id && String(updated.teacher_id) !== String(existing.teacher_id)) {
      notifyTeacherAssignedTest(updated, req.user.school_id, req.user._id || req.user.id);
    }
    res.status(200).json({ success: true, test: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteClassTest = async (req, res) => {
  try {
    const test = await ClassTest.findOne({ _id: req.params.id, school_id: req.user.school_id }).select('grade_id section subject_id teacher_id').lean();
    if (!test) return res.status(404).json({ success: false, message: 'Class test not found' });
    if (!canTeacherAccessClassTest(req.user, test.grade_id, test.section, test.subject_id, test.teacher_id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Unauthorized delete.' });
    }
    await ClassTest.deleteOne({ _id: test._id });
    res.status(200).json({ success: true, message: 'Class test deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getClassTests, getClassTestById, createClassTest, updateClassTest, deleteClassTest };
