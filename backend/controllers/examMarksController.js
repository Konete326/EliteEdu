const Exam = require('../models/Exam');
const ExamMark = require('../models/ExamMark');
const Student = require('../models/Student');
const { syncStudentLatestPercentages } = require('../utils/studentExamAggregator');
const { createSystemNotification } = require('../utils/notificationDispatcher');
const { buildMarksUpsertOp } = require('../utils/marksRecordBuilder');

const getMarksSheet = async (req, res) => {
  try {
    const { grade_id, section = 'A', subject_id } = req.query;
    const schoolId = req.user.school_id;
    const exam = await Exam.findOne({ _id: req.params.id, school_id: schoolId }).populate('grading_policy_id').lean();
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const paper = (exam.papers || []).find((p) => String(p.grade_id) === String(grade_id) && String(p.section) === String(section) && String(p.subject_id) === String(subject_id));

    const [students, existingMarks] = await Promise.all([
      Student.find({ school_id: schoolId, current_grade: grade_id, current_section: section, status: 'Active' })
        .select('name father_name gr_number roll_number photo_url')
        .sort({ roll_number: 1, gr_number: 1, name: 1 })
        .lean(),
      ExamMark.find({ exam_id: exam._id, grade_id, section, subject_id, school_id: schoolId }).lean()
    ]);

    const marksMap = new Map(existingMarks.map((m) => [String(m.student_id), m]));
    const rows = students.map((s) => {
      const ex = marksMap.get(String(s._id)) || {};
      return {
        student_id: s._id,
        name: s.name,
        father_name: s.father_name,
        gr_number: s.gr_number,
        roll_number: s.roll_number,
        photo_url: s.photo_url,
        theory_obtained: ex.theory_obtained ?? '',
        practical_obtained: ex.practical_obtained ?? '',
        total_obtained: ex.total_obtained ?? 0,
        percentage: ex.percentage ?? 0,
        grade_letter: ex.grade_letter || 'F',
        status: ex.status || 'PASS',
        remarks: ex.remarks || ''
      };
    });

    res.status(200).json({ success: true, exam, paper, rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const saveMarksSheet = async (req, res) => {
  try {
    const { grade_id, section = 'A', subject_id, records = [] } = req.body;
    const schoolId = req.user.school_id;
    const exam = await Exam.findOne({ _id: req.params.id, school_id: schoolId }).populate('grading_policy_id');
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const paper = (exam.papers || []).find((p) => String(p.grade_id) === String(grade_id) && String(p.section) === String(section) && String(p.subject_id) === String(subject_id));
    const targetPaper = paper || { grade_id, section, subject_id };

    const studentIds = records.map((r) => r.student_id);
    const ops = records.map((r) => buildMarksUpsertOp(r, exam, targetPaper, schoolId, req.user._id || req.user.id));

    if (ops.length > 0) await ExamMark.bulkWrite(ops);

    if (paper) {
      paper.marks_submitted = true;
      await exam.save();
    }

    await syncStudentLatestPercentages(schoolId, studentIds);

    if (req.user.role === 'Teacher') {
      createSystemNotification({
        school_id: schoolId,
        title: 'Exam Marks Submitted',
        message: `${req.user.name || 'Teacher'} submitted marks for ${paper?.subject_name || 'Subject'} (${paper?.grade_name || 'Class'}).`,
        type: 'Academic',
        target_audience: 'Admins',
        action_url: `/admin/exam-management/exams`,
        created_by: req.user._id || req.user.id
      });
    }

    res.status(200).json({ success: true, count: ops.length, message: 'Marks sheet saved and student records updated!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMarksSheet, saveMarksSheet };
