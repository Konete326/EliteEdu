const mongoose = require('mongoose');
const StudentAttendance = require('../models/StudentAttendance');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const LeaveRequest = require('../models/LeaveRequest');

const buildDailyClassSummary = async (schoolId, campusId, { date = new Date().toISOString().split('T')[0], grade_id }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId), date };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (grade_id && grade_id !== 'all') query.grade_id = new mongoose.Types.ObjectId(grade_id);

  const records = await StudentAttendance.find(query).populate('grade_id', 'name').lean();
  const classMap = {};

  records.forEach((r) => {
    const key = `${r.grade_id?.name || 'Class'}__${r.section || 'A'}`;
    if (!classMap[key]) {
      classMap[key] = { class_name: r.grade_id?.name || 'Class', section: r.section || 'A', present: 0, absent: 0, leave: 0, late: 0, total: 0 };
    }
    classMap[key].total++;
    const s = r.status || 'P';
    if (s === 'P') classMap[key].present++;
    else if (s === 'A') classMap[key].absent++;
    else if (s === 'L') classMap[key].leave++;
    else if (s === 'LT') classMap[key].late++;
  });

  const rows = Object.values(classMap).map((c, idx) => {
    const pct = c.total > 0 ? (((c.present + c.late) / c.total) * 100).toFixed(1) : '0.0';
    return { sr: idx + 1, id: `att-sum-${idx + 1}`, ...c, attendance_rate: `${pct}%` };
  });

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true },
    { key: 'total', label: 'Total Enrolled', visible: true },
    { key: 'present', label: 'Present', visible: true },
    { key: 'absent', label: 'Absent', visible: true },
    { key: 'leave', label: 'On Leave', visible: true },
    { key: 'late', label: 'Late', visible: true },
    { key: 'attendance_rate', label: 'Rate (%)', visible: true }
  ];
  return { columns, rows };
};

const buildAbsentLateStudents = async (schoolId, campusId, { date = new Date().toISOString().split('T')[0], grade_id, status_target = 'A' }) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId), date, status: status_target };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (grade_id && grade_id !== 'all') query.grade_id = new mongoose.Types.ObjectId(grade_id);

  const records = await StudentAttendance.find(query).populate('grade_id', 'name').populate('student_id', 'name gr_number contact_number father_name').lean();
  const rows = records.map((r, idx) => ({
    sr: idx + 1,
    id: r._id,
    gr_number: r.student_id?.gr_number || '—',
    name: r.student_id?.name || 'Student',
    father_name: r.student_id?.father_name || '—',
    class_name: r.grade_id?.name || 'Class',
    section: r.section || 'A',
    date: r.date,
    status: r.status === 'A' ? 'Absent' : 'Late Comers',
    phone: r.student_id?.contact_number || '—',
    remarks: r.remarks || '—'
  }));

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true },
    { key: 'father_name', label: 'Father Name', visible: true },
    { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'phone', label: 'Parent Phone', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true }
  ];
  return { columns, rows };
};

const buildApprovedLeaves = async (schoolId, campusId) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId), applicant_type: 'Student', status: 'Approved' };
  if (campusId && campusId !== 'all') query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];

  const leaves = await LeaveRequest.find(query).populate('student_id', 'name gr_number contact_number').populate('grade_id', 'name').sort({ from_date: -1 }).lean();
  const rows = leaves.map((l, idx) => ({
    sr: idx + 1,
    id: l._id,
    gr_number: l.student_id?.gr_number || '—',
    name: l.student_id?.name || 'Student',
    class_name: l.grade_id?.name || 'Class',
    section: l.section || 'A',
    leave_type: l.leave_type || 'Sick Leave',
    from_date: l.from_date,
    to_date: l.to_date,
    total_days: l.total_days || 1,
    reason: l.reason || '—'
  }));

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true },
    { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true },
    { key: 'leave_type', label: 'Leave Type', visible: true },
    { key: 'from_date', label: 'From', visible: true },
    { key: 'to_date', label: 'To', visible: true },
    { key: 'total_days', label: 'Days', visible: true },
    { key: 'reason', label: 'Approved Reason', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildDailyClassSummary, buildAbsentLateStudents, buildApprovedLeaves };
