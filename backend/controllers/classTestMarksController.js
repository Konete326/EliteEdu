const ClassTest = require('../models/ClassTest');
const Student = require('../models/Student');
const GradingPolicy = require('../models/GradingPolicy');
const { evaluateGrade } = require('../utils/gradingEvaluator');
const { canTeacherAccessClassTest } = require('../utils/classTestGuard');
const { notifyAdminMarksSubmitted } = require('../utils/classTestAlertDispatcher');

const getClassTestSheet = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const test = await ClassTest.findOne({ _id: req.params.id, school_id: schoolId })
      .populate('grade_id', 'name code sections')
      .populate('subject_id', 'name code')
      .populate('teacher_id', 'name employee_code')
      .lean();
    if (!test) return res.status(404).json({ success: false, message: 'Class test not found' });

    if (!canTeacherAccessClassTest(req.user, test.grade_id?._id, test.section, test.subject_id?._id, test.teacher_id?._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this test sheet.' });
    }

    const [students, policy] = await Promise.all([
      Student.find({ school_id: schoolId, current_grade: test.grade_id?._id, current_section: test.section, status: 'Active' })
        .select('name father_name gr_number roll_number photo_url')
        .sort({ roll_number: 1, gr_number: 1, name: 1 })
        .lean(),
      GradingPolicy.findOne({ school_id: schoolId }).lean()
    ]);

    const marksMap = new Map((test.marks || []).map((m) => [String(m.student_id), m]));
    const rows = students.map((s) => {
      const ex = marksMap.get(String(s._id)) || {};
      return {
        student_id: s._id,
        name: s.name,
        father_name: s.father_name,
        gr_number: s.gr_number,
        roll_number: s.roll_number,
        photo_url: s.photo_url,
        obtained_marks: ex.obtained_marks ?? '',
        is_absent: Boolean(ex.is_absent),
        percentage: ex.percentage ?? 0,
        grade_letter: ex.grade_letter || 'F',
        pass_status: ex.pass_status || 'PASS',
        remarks: ex.remarks || ''
      };
    });

    res.status(200).json({ success: true, test, rows, policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const saveClassTestMarks = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const { marks = [] } = req.body;
    const test = await ClassTest.findOne({ _id: req.params.id, school_id: schoolId });
    if (!test) return res.status(404).json({ success: false, message: 'Class test not found' });

    if (!canTeacherAccessClassTest(req.user, test.grade_id, test.section, test.subject_id, test.teacher_id)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot enter marks for this class/subject.' });
    }

    const policy = await GradingPolicy.findOne({ school_id: schoolId }).lean();
    const scale = policy?.grading_scale;
    const totalMax = test.total_marks || 25;
    const passMarks = test.passing_marks ?? Math.round(totalMax * 0.33);

    const compiledMarks = marks.map((r) => {
      const isAbsent = Boolean(r.is_absent);
      const obtained = isAbsent ? 0 : Math.min(totalMax, Math.max(0, Number(r.obtained_marks) || 0));
      const pct = totalMax > 0 ? Math.round((obtained / totalMax) * 100) : 0;
      const evaluated = isAbsent ? { grade_letter: 'F', status: 'ABSENT' } : evaluateGrade(pct, scale);
      const passStatus = isAbsent ? 'ABSENT' : (obtained >= passMarks ? 'PASS' : 'FAIL');

      return {
        student_id: r.student_id,
        obtained_marks: obtained,
        is_absent: isAbsent,
        percentage: pct,
        grade_letter: evaluated.grade_letter || 'F',
        pass_status: passStatus,
        remarks: r.remarks || ''
      };
    });

    test.marks = compiledMarks;
    test.status = 'Published';
    await test.save();

    if (req.user.role === 'Teacher') {
      notifyAdminMarksSubmitted(test, schoolId, req.user);
    }

    res.status(200).json({ success: true, message: 'Test marks successfully published!', count: compiledMarks.length, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getClassTestSheet, saveClassTestMarks };
