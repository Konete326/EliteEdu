const mongoose = require('mongoose');
const MarkSheet = require('../models/MarkSheet');
const Student = require('../models/Student');

const buildFailCompartment = async (schoolId, campusId, { exam_id, grade_id }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId) };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (exam_id && exam_id !== 'all') query.exam_id = new mongoose.Types.ObjectId(exam_id);
  if (grade_id && grade_id !== 'all') query.grade_id = new mongoose.Types.ObjectId(grade_id);

  const sheets = await MarkSheet.find(query).populate('grade_id', 'name').populate('subject_id', 'name').lean();
  const failedEntries = [];

  sheets.forEach((sh) => {
    (sh.marks || []).forEach((m) => {
      const passMarks = Number(sh.passing_marks) || 33;
      const obtained = Number(m.obtained_marks) || 0;
      if (m.is_absent || obtained < passMarks || m.grade === 'F') {
        failedEntries.push({
          student_id: m.student_id, class_name: sh.grade_id?.name || 'Class', subject: sh.subject_id?.name || 'Subject',
          max_marks: sh.max_marks || 100, passing_marks: passMarks, obtained_marks: m.is_absent ? 'Absent' : obtained,
          deficiency: m.is_absent ? 'Absent in Exam' : `-${passMarks - obtained} marks`, grade: m.grade || 'F'
        });
      }
    });
  });

  const studentIds = failedEntries.map((e) => e.student_id);
  const students = await Student.find({ _id: { $in: studentIds } }).select('name gr_number current_section').lean();
  const sMap = {};
  students.forEach((s) => { sMap[String(s._id)] = s; });

  const rows = failedEntries.map((f, idx) => {
    const s = sMap[String(f.student_id)] || {};
    return {
      sr: idx + 1, id: `fail-${idx + 1}`, gr_number: s.gr_number || '—', name: s.name || 'Student',
      class_name: f.class_name, section: s.current_section || 'A', subject: f.subject, max_marks: f.max_marks,
      obtained_marks: f.obtained_marks, passing_marks: f.passing_marks, deficiency: f.deficiency, grade: f.grade
    };
  });

  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true }, { key: 'subject', label: 'Failed Subject', visible: true },
    { key: 'max_marks', label: 'Total', visible: true }, { key: 'obtained_marks', label: 'Obtained', visible: true },
    { key: 'passing_marks', label: 'Pass Marks', visible: true }, { key: 'deficiency', label: 'Deficiency', visible: true }
  ];
  return { columns, rows };
};

const buildGradeDistribution = async (schoolId, campusId, { exam_id, grade_id }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId) };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (exam_id && exam_id !== 'all') query.exam_id = new mongoose.Types.ObjectId(exam_id);
  if (grade_id && grade_id !== 'all') query.grade_id = new mongoose.Types.ObjectId(grade_id);

  const sheets = await MarkSheet.find(query).populate('grade_id', 'name').lean();
  const classMap = {};

  sheets.forEach((sh) => {
    const gName = sh.grade_id?.name || 'Class';
    if (!classMap[gName]) classMap[gName] = { class_name: gName, aPlus: 0, a: 0, b: 0, c: 0, d: 0, f: 0, total: 0 };
    (sh.marks || []).forEach((m) => {
      classMap[gName].total++;
      const g = (m.grade || 'F').toUpperCase();
      if (g === 'A+') classMap[gName].aPlus++;
      else if (g === 'A') classMap[gName].a++;
      else if (g === 'B') classMap[gName].b++;
      else if (g === 'C') classMap[gName].c++;
      else if (g === 'D') classMap[gName].d++;
      else classMap[gName].f++;
    });
  });

  const rows = Object.values(classMap).map((c, idx) => ({ sr: idx + 1, id: `grade-dist-${idx + 1}`, ...c }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'aPlus', label: 'A+ (90%+)', visible: true }, { key: 'a', label: 'A (80-89%)', visible: true },
    { key: 'b', label: 'B (70-79%)', visible: true }, { key: 'c', label: 'C (60-69%)', visible: true },
    { key: 'd', label: 'D (50-59%)', visible: true }, { key: 'f', label: 'Fail (<33%)', visible: true },
    { key: 'total', label: 'Total Papers Evaluated', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildFailCompartment, buildGradeDistribution };
