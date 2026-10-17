const ClassTest = require('../models/ClassTest');
const Student = require('../models/Student');
const { buildTeacherFilter } = require('../utils/classTestGuard');
const { computeStudentAggregate, computeSubjectAverages } = require('../utils/classTestAnalyticsHelper');

const getAnalytics = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const { mode = 'class_wise', grade_id, section, subject_id, student_id, from_date, to_date } = req.query;
    const baseQuery = { school_id: schoolId, ...buildTeacherFilter(req.user) };

    if (mode === 'class_wise') {
      if (!grade_id) return res.status(400).json({ success: false, message: 'grade_id is required' });
      const testQ = { ...baseQuery, grade_id };
      if (section && section !== 'All') testQ.section = section;
      const studentQ = { school_id: schoolId, current_grade: grade_id, status: 'Active' };
      if (section && section !== 'All') studentQ.current_section = section;

      const [tests, students] = await Promise.all([
        ClassTest.find(testQ).populate('subject_id', 'name code').lean(),
        Student.find(studentQ).select('name father_name gr_number roll_number photo_url').lean()
      ]);

      const aggregates = computeStudentAggregate(students, tests);
      const passedCount = aggregates.filter((a) => a.pass_status === 'PASS').length;
      const classAvg = aggregates.length > 0 ? Math.round(aggregates.reduce((acc, c) => acc + c.percentage, 0) / aggregates.length) : 0;

      return res.status(200).json({
        success: true, mode, total_tests: tests.length, total_students: students.length,
        class_average: classAvg, passed_students: passedCount, failed_students: aggregates.length - passedCount,
        results: aggregates, tests
      });
    }

    if (mode === 'class_subject') {
      if (!grade_id || !subject_id) return res.status(400).json({ success: false, message: 'grade_id and subject_id required' });
      const testQ = { ...baseQuery, grade_id, subject_id };
      if (section && section !== 'All') testQ.section = section;
      const [tests, students] = await Promise.all([
        ClassTest.find(testQ).sort({ test_date: 1 }).lean(),
        Student.find({ school_id: schoolId, current_grade: grade_id, ...(section && section !== 'All' ? { current_section: section } : {}), status: 'Active' }).select('name father_name gr_number roll_number').lean()
      ]);
      const aggregates = computeStudentAggregate(students, tests);
      return res.status(200).json({ success: true, mode, tests, students, results: aggregates });
    }

    if (mode === 'student_subject') {
      if (!student_id) return res.status(400).json({ success: false, message: 'student_id is required' });
      const student = await Student.findOne({ _id: student_id, school_id: schoolId }).populate('current_grade', 'name').lean();
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      const testQ = { ...baseQuery, grade_id: student.current_grade?._id || student.current_grade, 'marks.student_id': student._id };
      if (subject_id) testQ.subject_id = subject_id;

      const tests = await ClassTest.find(testQ).populate('subject_id', 'name code').populate('teacher_id', 'name').sort({ test_date: -1 }).lean();
      const testDetails = tests.map((t) => {
        const m = (t.marks || []).find((mk) => String(mk.student_id) === String(student._id)) || {};
        return { test_id: t._id, title: t.title, test_date: t.test_date, subject_name: t.subject_id?.name || 'General', total_marks: t.total_marks, passing_marks: t.passing_marks, obtained_marks: m.obtained_marks || 0, percentage: m.percentage || 0, grade_letter: m.grade_letter || 'F', pass_status: m.pass_status || 'PASS', remarks: m.remarks || '' };
      });
      return res.status(200).json({ success: true, mode, student, tests: testDetails });
    }

    if (mode === 'date_range') {
      const testQ = { ...baseQuery };
      if (from_date || to_date) {
        testQ.test_date = {};
        if (from_date) testQ.test_date.$gte = new Date(from_date);
        if (to_date) testQ.test_date.$lte = new Date(to_date);
      }
      if (grade_id) testQ.grade_id = grade_id;
      const tests = await ClassTest.find(testQ).populate('grade_id', 'name').populate('subject_id', 'name').populate('teacher_id', 'name').sort({ test_date: -1 }).lean();
      return res.status(200).json({ success: true, mode, tests });
    }

    if (mode === 'performance') {
      const tests = await ClassTest.find(baseQuery).populate('subject_id', 'name').populate('grade_id', 'name').lean();
      const students = await Student.find({ school_id: schoolId, status: 'Active' }).select('name father_name gr_number current_grade').populate('current_grade', 'name').lean();
      const aggregates = computeStudentAggregate(students, tests);
      const topPerformers = aggregates.slice(0, 10);
      const interventionList = aggregates.filter((a) => a.percentage < 33 || a.pass_status === 'FAIL').slice(0, 20);
      const subjectAverages = computeSubjectAverages(tests);
      return res.status(200).json({ success: true, mode, topPerformers, interventionList, subjectAverages, total_tests: tests.length });
    }

    res.status(400).json({ success: false, message: 'Invalid analytics mode' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAnalytics };
