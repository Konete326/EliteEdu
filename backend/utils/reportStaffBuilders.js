const mongoose = require('mongoose');
const User = require('../models/User');
const StaffApplicant = require('../models/StaffApplicant');

const buildStaffDirectory = async (schoolId, campusId, options = {}) => {
  const { department, status } = options;
  const query = { school_id: new mongoose.Types.ObjectId(schoolId), role: { $ne: 'Student' } };
  if (campusId && campusId !== 'all' && mongoose.Types.ObjectId.isValid(campusId)) {
    query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }, { campus_id: { $exists: false } }];
  }
  if (department && department !== 'all') query.department = new RegExp('^' + department.trim() + '$', 'i');
  if (status && status !== 'all') query.status = new RegExp('^' + status.trim() + '$', 'i');

  const staff = await User.find(query).populate('campus_id', 'name').sort({ name: 1 }).lean();
  const rows = staff.map((u, idx) => ({
    sr: idx + 1,
    id: u._id,
    emp_code: u.employee_code || `EMP-${idx + 101}`,
    name: u.name,
    designation: u.designation || u.role,
    department: u.department || 'Academics',
    bps_grade: u.bps_grade || 'BPS-14',
    qualification: u.qualification || 'Masters',
    contact: u.contact_number || u.phone || '—',
    joining_date: u.joining_date ? new Date(u.joining_date).toISOString().split('T')[0] : '—',
    status: u.status || 'Active'
  }));

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'emp_code', label: 'Code', visible: true },
    { key: 'name', label: 'Staff Name', visible: true },
    { key: 'designation', label: 'Designation', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'bps_grade', label: 'BPS Scale', visible: true },
    { key: 'qualification', label: 'Degree', visible: true },
    { key: 'contact', label: 'Phone', visible: true },
    { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

const buildDeptBpsSummary = async (schoolId, campusId) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId), role: { $ne: 'Student' } };
  if (campusId && campusId !== 'all' && mongoose.Types.ObjectId.isValid(campusId)) {
    query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }, { campus_id: { $exists: false } }];
  }

  const staff = await User.find(query).lean();
  const map = {};
  staff.forEach((u) => {
    const key = `${u.department || 'Academics'}__${u.bps_grade || 'Standard'}`;
    if (!map[key]) {
      map[key] = { department: u.department || 'Academics', bps_grade: u.bps_grade || 'Standard', total: 0, active: 0 };
    }
    map[key].total++;
    if ((u.status || 'Active').toLowerCase() === 'active') map[key].active++;
  });

  const rows = Object.values(map).map((m, idx) => ({ sr: idx + 1, id: `dept-bps-${idx + 1}`, ...m }));
  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'bps_grade', label: 'BPS Scale', visible: true },
    { key: 'total', label: 'Total Personnel', visible: true },
    { key: 'active', label: 'Active Staff', visible: true }
  ];
  return { columns, rows };
};

const buildStaffApplicantsReport = async (schoolId, campusId) => {
  const query = { school_id: new mongoose.Types.ObjectId(schoolId) };
  if (campusId && campusId !== 'all' && mongoose.Types.ObjectId.isValid(campusId)) {
    query.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }, { campus_id: { $exists: false } }];
  }

  const applicants = await StaffApplicant.find(query).sort({ applied_on: -1, createdAt: -1 }).lean();
  const rows = applicants.map((a, idx) => ({
    sr: idx + 1,
    id: a._id,
    name: a.name,
    department: a.department || 'General',
    designation: a.designation || 'Teacher',
    qualification: a.qualification || '—',
    experience_years: `${a.experience_years || 0} yrs`,
    contact: a.contact_number || '—',
    status: a.status || 'Pending Verification',
    applied_on: a.applied_on ? new Date(a.applied_on).toISOString().split('T')[0] : 'Recent'
  }));

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'name', label: 'Candidate Name', visible: true },
    { key: 'department', label: 'Applied Dept', visible: true },
    { key: 'designation', label: 'Post', visible: true },
    { key: 'qualification', label: 'Education', visible: true },
    { key: 'experience_years', label: 'Exp', visible: true },
    { key: 'contact', label: 'Contact', visible: true },
    { key: 'status', label: 'Hiring Stage', visible: true },
    { key: 'applied_on', label: 'Applied Date', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildStaffDirectory, buildDeptBpsSummary, buildStaffApplicantsReport };
