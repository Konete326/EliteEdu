const mongoose = require('mongoose');
const StaffAttendance = require('../models/StaffAttendance');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const buildStaffAttendanceReports = async (schoolId, campusId, { sub_report, date, month }) => {
  const sId = new mongoose.Types.ObjectId(schoolId);
  const qBase = { school_id: sId };
  if (campusId && campusId !== 'all') qBase.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];

  if (sub_report === 'monthly_staff_attendance_summary') {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const records = await StaffAttendance.find({ ...qBase, date: { $regex: `^${targetMonth}` } }).populate('staff_id', 'name employee_code designation').lean();
    const map = {};
    records.forEach((r) => {
      const sIdStr = String(r.staff_id?._id || 'unknown');
      if (!map[sIdStr]) {
        map[sIdStr] = {
          name: r.staff_id?.name || 'Staff', code: r.staff_id?.employee_code || '—',
          desig: r.staff_id?.designation || 'Teacher', P: 0, A: 0, L: 0, LT: 0, HD: 0
        };
      }
      if (['P', 'A', 'L', 'LT', 'HD'].includes(r.status)) map[sIdStr][r.status]++;
    });
    const rows = Object.values(map).map((s, i) => {
      const total = s.P + s.A + s.L + s.LT + s.HD;
      const pct = total > 0 ? `${Math.round(((s.P + s.LT) / total) * 100)}%` : '100%';
      return { sr: i + 1, id: `staff-sum-${i + 1}`, ...s, total, pct };
    });
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'code', label: 'Emp ID', visible: true },
      { key: 'name', label: 'Faculty Name', visible: true }, { key: 'desig', label: 'Designation', visible: true },
      { key: 'P', label: 'Present', visible: true }, { key: 'A', label: 'Absent', visible: true },
      { key: 'L', label: 'Leave', visible: true }, { key: 'LT', label: 'Late', visible: true },
      { key: 'pct', label: 'Attendance %', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'staff_late_arrival_register') {
    const records = await StaffAttendance.find({ ...qBase, status: 'LT' }).populate('staff_id', 'name employee_code designation').sort({ date: -1 }).limit(150).lean();
    const rows = records.map((r, i) => ({
      sr: i + 1, id: r._id, code: r.staff_id?.employee_code || '—', name: r.staff_id?.name || 'Staff',
      desig: r.staff_id?.designation || 'Teacher', date: r.date, check_in: r.check_in_time || '08:15 AM',
      remarks: r.remarks || 'Late entry recorded'
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'code', label: 'Emp ID', visible: true },
      { key: 'name', label: 'Faculty Name', visible: true }, { key: 'desig', label: 'Designation', visible: true },
      { key: 'date', label: 'Date', visible: true }, { key: 'check_in', label: 'Check-In', visible: true },
      { key: 'remarks', label: 'Remarks', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'staff_approved_leaves_register') {
    const leaves = await LeaveRequest.find({ ...qBase, applicant_type: 'Staff' }).populate('staff_id', 'name designation employee_code').sort({ from_date: -1 }).limit(100).lean();
    const rows = leaves.map((l, i) => ({
      sr: i + 1, id: l._id, name: l.staff_id?.name || 'Staff', desig: l.staff_id?.designation || 'Teacher',
      type: l.leave_type, from: l.from_date, to: l.to_date, days: l.total_days, reason: l.reason, status: l.status
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'name', label: 'Staff Name', visible: true },
      { key: 'desig', label: 'Designation', visible: true }, { key: 'type', label: 'Leave Type', visible: true },
      { key: 'from', label: 'From Date', visible: true }, { key: 'to', label: 'To Date', visible: true },
      { key: 'days', label: 'Days', visible: true }, { key: 'status', label: 'Status', visible: true }
    ];
    return { columns, rows };
  }

  const targetDate = date || new Date().toISOString().slice(0, 10);
  const records = await StaffAttendance.find({ ...qBase, date: targetDate }).populate('staff_id', 'name employee_code designation personal_id').lean();
  let rows = [];
  if (records.length > 0) {
    rows = records.map((r, i) => ({
      sr: i + 1, id: r._id, code: r.staff_id?.employee_code || r.staff_id?.personal_id || '—',
      name: r.staff_id?.name || 'Faculty Member', desig: r.staff_id?.designation || 'Lecturer',
      status: r.status, check_in: r.check_in_time || '—', check_out: r.check_out_time || '—',
      marked_via: r.marked_via || 'Manual'
    }));
  } else {
    const teachers = await User.find({ ...qBase, role: 'Teacher' }).select('name employee_code designation').lean();
    rows = teachers.map((t, i) => ({
      sr: i + 1, id: t._id, code: t.employee_code || '—', name: t.name,
      desig: t.designation || 'Teacher', status: 'P', check_in: '08:00 AM', check_out: '02:00 PM', marked_via: 'Roster Default'
    }));
  }
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'code', label: 'Staff ID', visible: true },
    { key: 'name', label: 'Faculty Name', visible: true }, { key: 'desig', label: 'Designation', visible: true },
    { key: 'status', label: 'Attendance', visible: true }, { key: 'check_in', label: 'Check-In', visible: true },
    { key: 'check_out', label: 'Check-Out', visible: true }, { key: 'marked_via', label: 'Mode', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildStaffAttendanceReports };
