const mongoose = require('mongoose');
const Exam = require('../models/Exam');

const buildExamGeneric = async (schoolId, campusId, { exam_id }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId) };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (exam_id && exam_id !== 'all') query._id = new mongoose.Types.ObjectId(exam_id);

  const exams = await Exam.find(query).populate('campus_id', 'name').lean();
  const rows = [];
  exams.forEach((ex, exIdx) => {
    (ex.papers || []).forEach((p, pIdx) => {
      rows.push({
        sr: rows.length + 1,
        id: `exam-p-${exIdx}-${pIdx}`,
        exam_title: ex.title,
        grade_name: p.grade_name || 'Class',
        section: p.section || 'A',
        subject_name: p.subject_name || 'Subject',
        exam_date: p.exam_date ? new Date(p.exam_date).toISOString().split('T')[0] : '—',
        timing: `${p.start_time || '09:00 AM'} - ${p.end_time || '12:00 PM'}`,
        room_no: p.room_no || 'Hall 1',
        total_marks: p.total_marks || 100
      });
    });
  });

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'exam_title', label: 'Exam', visible: true },
    { key: 'grade_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true },
    { key: 'subject_name', label: 'Subject', visible: true },
    { key: 'exam_date', label: 'Date', visible: true },
    { key: 'timing', label: 'Time Window', visible: true },
    { key: 'room_no', label: 'Hall / Room', visible: true },
    { key: 'total_marks', label: 'Marks', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildExamGeneric };
