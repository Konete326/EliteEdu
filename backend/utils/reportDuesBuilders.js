const mongoose = require('mongoose');
const Student = require('../models/Student');
const FeeInvoice = require('../models/FeeInvoice');

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const buildDuesReports = async (schoolId, campusId, { sub_report, grade_id }) => {
  const sId = new mongoose.Types.ObjectId(schoolId);
  const qBase = { school_id: sId };
  if (campusId && campusId !== 'all') qBase.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];
  if (grade_id && grade_id !== 'all') qBase.current_grade = new mongoose.Types.ObjectId(grade_id);

  if (sub_report === 'class_wise_dues_summary') {
    const students = await Student.find(qBase).populate('current_grade', 'name').lean();
    const map = {};
    students.forEach((s) => {
      const gName = s.current_grade?.name || 'Unassigned';
      if (!map[gName]) map[gName] = { class_name: gName, count: 0, arrears: 0, current: 0 };
      const mFee = Math.max(0, (Number(s.monthly_fee) || 0) - (Number(s.discount) || 0));
      const arr = Number(s.arrears_balance || 0);
      if (mFee > 0 || arr > 0) {
        map[gName].count++;
        map[gName].arrears += arr;
        map[gName].current += mFee;
      }
    });
    const rows = Object.values(map).map((m, i) => ({
      sr: i + 1, id: `dues-${i + 1}`, class_name: m.class_name, count: m.count,
      arrears: m.arrears, current: m.current, total: m.arrears + m.current
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'count', label: 'Defaulters', visible: true }, { key: 'arrears', label: 'Arrears (Old)', visible: true },
      { key: 'current', label: 'Current Dues', visible: true }, { key: 'total', label: 'Total Outstanding', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'aging_dues_report') {
    const students = await Student.find(qBase).populate('current_grade', 'name').lean();
    const rows = students.filter((s) => (Number(s.monthly_fee) || 0) > 0 || (Number(s.arrears_balance) || 0) > 0).slice(0, 150).map((s, i) => {
      const fee = Math.max(0, (Number(s.monthly_fee) || 0) - (Number(s.discount) || 0));
      const arr = Number(s.arrears_balance) || 0;
      const m1 = fee;
      const m2 = arr > fee ? fee : arr;
      const m3 = Math.max(0, arr - m2);
      return {
        sr: i + 1, id: s._id, gr_number: s.gr_number || '—', student_name: s.name,
        class_name: s.current_grade?.name || 'Class', m1, m2, m3, total: m1 + arr
      };
    });
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
      { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'm1', label: '1 Mo Due', visible: true }, { key: 'm2', label: '2 Mo Due', visible: true },
      { key: 'm3', label: '3+ Mo Overdue', visible: true }, { key: 'total', label: 'Total Dues', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'left_students_pending_dues') {
    const leftQ = { ...qBase, status: { $in: ['Left', 'Inactive'] } };
    const students = await Student.find(leftQ).populate('current_grade', 'name').lean();
    const rows = students.map((s, i) => ({
      sr: i + 1, id: s._id, gr_number: s.gr_number || '—', student_name: s.name,
      left_date: fmtDate(s.left_date || s.updatedAt), class_name: s.current_grade?.name || 'Class',
      unpaid_amount: Number(s.arrears_balance || s.monthly_fee || 0), phone: s.parent_phone || s.guardian_phone || '—'
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
      { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'left_date', label: 'Left Date', visible: true }, { key: 'unpaid_amount', label: 'Unpaid Dues', visible: true },
      { key: 'phone', label: 'Contact', visible: true }
    ];
    return { columns, rows };
  }

  const students = await Student.find(qBase).populate('current_grade', 'name').lean();
  const rows = students
    .map((s) => {
      const fee = Math.max(0, (Number(s.monthly_fee) || 0) - (Number(s.discount) || 0));
      const arr = Number(s.arrears_balance) || 0;
      return {
        id: s._id, gr_number: s.gr_number || '—', student_name: s.name,
        class_name: s.current_grade?.name || 'Class', section: s.current_section || 'A',
        phone: s.parent_phone || '—', monthly_fee: fee, arrears: arr, total_due: fee + arr,
        status: (fee + arr) > 0 ? 'Due' : 'Paid'
      };
    })
    .filter((s) => s.total_due > 0)
    .sort((a, b) => b.total_due - a.total_due)
    .map((r, i) => ({ sr: i + 1, ...r }));

  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Sec', visible: true }, { key: 'phone', label: 'Phone', visible: true },
    { key: 'monthly_fee', label: 'Monthly Fee', visible: true }, { key: 'arrears', label: 'Arrears', visible: true },
    { key: 'total_due', label: 'Total Due', visible: true }, { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildDuesReports };
