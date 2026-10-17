const MarkSheet = require('../models/MarkSheet');
const ExamMark = require('../models/ExamMark');
const { GradingPolicy } = require('../models/GradingPolicy');
const { evaluateGrade } = require('../utils/gradingEvaluator');
const { syncStudentLatestPercentages } = require('../utils/studentExamAggregator');

const saveMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, status } = req.body;
    const schoolId = req.user.school_id;
    const sheet = await MarkSheet.findOne({ _id: id, school_id: schoolId });
    if (!sheet) return res.status(404).json({ message: 'Mark sheet not found' });
    if (sheet.results_locked && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'This mark sheet is locked from edits' });
    }

    const policyDoc = await GradingPolicy.findOne({ school_id: schoolId }).lean();
    const activeScale = policyDoc?.grading_scale || null;
    const policyCards = policyDoc?.policies || [];

    const examOps = [];
    const studentIds = [];

    if (Array.isArray(marks)) {
      sheet.marks = marks.map((m) => {
        const studentId = m.student_id?._id || m.student_id;
        studentIds.push(studentId);
        const obt = Number(m.obtained_marks) || 0;
        const max = sheet.max_marks || 100;
        const pct = Math.round((obt / max) * 100);

        const evaluated = evaluateGrade(pct, activeScale);
        const cardMatch = policyCards.find((c) => c.letter_grade === evaluated.grade_letter);
        const color = cardMatch?.status_color || (pct >= 33 ? '#16A34A' : '#DC2626');
        const isAbsent = Boolean(m.is_absent);

        if (sheet.exam_id) {
          examOps.push({
            updateOne: {
              filter: {
                exam_id: sheet.exam_id,
                grade_id: sheet.grade_id,
                section: sheet.section || 'A',
                subject_id: sheet.subject_id,
                student_id: studentId,
                school_id: schoolId
              },
              update: {
                $set: {
                  theory_obtained: obt,
                  practical_obtained: 0,
                  total_obtained: obt,
                  max_marks: max,
                  percentage: pct,
                  grade_letter: isAbsent ? 'F' : evaluated.grade_letter,
                  status: isAbsent ? 'ABSENT' : (evaluated.status || (pct >= 33 ? 'PASS' : 'FAIL')),
                  remarks: m.teacher_remarks || evaluated.remarks || '',
                  marked_by: req.user._id || req.user.id
                }
              },
              upsert: true
            }
          });
        }

        return {
          student_id: studentId,
          obtained_marks: obt,
          percentage: pct,
          grade: isAbsent ? 'F' : evaluated.grade_letter,
          status_color: isAbsent ? '#6B7280' : color,
          is_absent: isAbsent,
          teacher_remarks: m.teacher_remarks || evaluated.remarks || '',
          principal_remarks: m.principal_remarks || ''
        };
      });
    }

    if (status) sheet.status = status;
    await sheet.save();

    if (examOps.length > 0) {
      await ExamMark.bulkWrite(examOps);
    }
    if (studentIds.length > 0) {
      await syncStudentLatestPercentages(schoolId, studentIds);
    }

    res.json({ success: true, message: 'Marks saved and synced across system', markSheet: sheet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save marks', error: error.message });
  }
};

const toggleLock = async (req, res) => {
  try {
    const sheet = await MarkSheet.findOne({ _id: req.params.id, school_id: req.user.school_id });
    if (!sheet) return res.status(404).json({ message: 'Mark sheet not found' });
    sheet.results_locked = !sheet.results_locked;
    sheet.status = sheet.results_locked ? 'Locked' : 'Submitted';
    await sheet.save();
    res.json({ success: true, locked: sheet.results_locked, message: `Marks sheet ${sheet.results_locked ? 'locked' : 'unlocked'}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle lock', error: error.message });
  }
};

module.exports = { saveMarks, toggleLock };
