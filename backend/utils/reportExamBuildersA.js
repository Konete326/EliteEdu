const mongoose = require('mongoose');
const MarkSheet = require('../models/MarkSheet');
const Student = require('../models/Student');

const buildToppersList = async (schoolId, campusId, { exam_id, grade_id, top_n = 10 }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId) };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (exam_id && exam_id !== 'all') query.exam_id = new mongoose.Types.ObjectId(exam_id);
  if (grade_id && grade_id !== 'all') query.grade_id = new mongoose.Types.ObjectId(grade_id);

  const sheets = await MarkSheet.find(query).populate('grade_id', 'name').lean();
  const studentMap = {};

  sheets.forEach((sheet) => {
    const gName = sheet.grade_id?.name || 'Unassigned';
    (sheet.marks || []).forEach((m) => {
      const sId = String(m.student_id);
      if (!studentMap[sId]) {
        studentMap[sId] = { student_id: sId, class_name: gName, total_max: 0, total_obtained: 0, papers_count: 0 };
      }
      studentMap[sId].total_max += Number(sheet.max_marks) || 100;
      studentMap[sId].total_obtained += Number(m.obtained_marks) || 0;
      studentMap[sId].papers_count++;
    });
  });

  const studentIds = Object.keys(studentMap);
  const students = await Student.find({ _id: { $in: studentIds } }).select('name gr_number current_section').lean();
  const sInfoMap = {};
  students.forEach((s) => { sInfoMap[String(s._id)] = s; });

  const sorted = Object.values(studentMap).map((item) => {
    const s = sInfoMap[item.student_id] || {};
    const pct = item.total_max > 0 ? ((item.total_obtained / item.total_max) * 100).toFixed(1) : '0.0';
    let grade = 'F';
    const numPct = Number(pct);
    if (numPct >= 90) grade = 'A+';
    else if (numPct >= 80) grade = 'A';
    else if (numPct >= 70) grade = 'B';
    else if (numPct >= 60) grade = 'C';
    else if (numPct >= 50) grade = 'D';
    return {
      id: item.student_id, gr_number: s.gr_number || '—', name: s.name || 'Student',
      class_name: item.class_name, section: s.current_section || 'A', max_marks: item.total_max,
      obtained_marks: item.total_obtained, percentage: `${pct}%`, grade, sortKey: numPct
    };
  }).sort((a, b) => b.sortKey - a.sortKey).slice(0, Number(top_n) || 10);

  const rows = sorted.map((r, idx) => ({ sr: idx + 1, rank: `Top #${idx + 1}`, ...r }));
  const columns = [
    { key: 'rank', label: 'Position', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true }, { key: 'max_marks', label: 'Total Marks', visible: true },
    { key: 'obtained_marks', label: 'Obtained', visible: true }, { key: 'percentage', label: 'Percentage', visible: true },
    { key: 'grade', label: 'Grade', visible: true }
  ];
  return { columns, rows };
};

const buildResultSummary = async (schoolId, campusId, { exam_id, grade_id }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId) };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (exam_id && exam_id !== 'all') query.exam_id = new mongoose.Types.ObjectId(exam_id);
  if (grade_id && grade_id !== 'all') query.grade_id = new mongoose.Types.ObjectId(grade_id);

  const sheets = await MarkSheet.find(query).populate('grade_id', 'name').populate('subject_id', 'name').lean();
  const rows = sheets.map((sh, idx) => {
    const marks = sh.marks || [];
    const appeared = marks.length;
    const passed = marks.filter((m) => !m.is_absent && (m.percentage || 0) >= (sh.passing_marks || 33)).length;
    const failed = appeared - passed;
    const passPct = appeared > 0 ? ((passed / appeared) * 100).toFixed(1) : '0.0';
    return {
      sr: idx + 1, id: sh._id, class_name: sh.grade_id?.name || 'Class', subject: sh.subject_id?.name || 'Subject',
      max_marks: sh.max_marks || 100, passing_marks: sh.passing_marks || 33, appeared, passed, failed, pass_percentage: `${passPct}%`
    };
  });

  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'subject', label: 'Subject', visible: true }, { key: 'max_marks', label: 'Total', visible: true },
    { key: 'passing_marks', label: 'Pass Marks', visible: true }, { key: 'appeared', label: 'Appeared', visible: true },
    { key: 'passed', label: 'Passed', visible: true }, { key: 'failed', label: 'Failed', visible: true },
    { key: 'pass_percentage', label: 'Pass %', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildToppersList, buildResultSummary };
