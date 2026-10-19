const mongoose = require('mongoose');
const Student = require('../models/Student');
const User = require('../models/User');
const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const { verifyClassAccess } = require('./attendanceAccessHelper');

const cleanCodeString = (raw) => {
  let clean = String(raw || '').trim();
  if (clean.includes('/verify/student/')) {
    clean = clean.split('/verify/student/')[1].split('?')[0].trim();
  } else if (clean.includes('/verify/staff/')) {
    clean = clean.split('/verify/staff/')[1].split('?')[0].trim();
  }
  return clean;
};

const lookupStudent = async (clean, schoolId, user, date) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(clean);
  const clauses = [{ gr_number: clean }, { serial_no: clean }, { b_form: clean }];
  if (isObjectId) clauses.push({ _id: clean });

  const student = await Student.findOne({ school_id: schoolId, $or: clauses })
    .populate('current_grade', 'name')
    .populate('campus_id', 'name')
    .lean();
  if (!student) return null;

  const todayAtt = await StudentAttendance.findOne({ school_id: schoolId, student_id: student._id, date }).lean();
  const isAdmin = ['Admin', 'SuperAdmin'].includes(user.role);
  let canMark = isAdmin;
  if (!canMark && user.role === 'Teacher') {
    canMark = await verifyClassAccess(user, student.current_grade?._id || student.current_grade);
  }

  return {
    type: 'student',
    canMarkAttendance: Boolean(canMark),
    canViewFullProfile: isAdmin || user.role === 'Teacher',
    record: {
      _id: student._id,
      name: student.name,
      code: student.gr_number || clean,
      photo_url: student.photo_url || '',
      role_or_class: `${student.current_grade?.name || 'Class N/A'} - Section ${student.current_section || 'A'}`,
      campus_name: student.campus_id?.name || 'Main Campus',
      emergency_contact: student.emergency_contact_no || student.contact_number || '',
      father_name: student.father_name || '',
      blood_group: student.blood_group || '',
      status: student.status || 'Active',
      today_attendance: todayAtt?.status || null,
      time_recorded: todayAtt?.scan_time ? new Date(todayAtt.scan_time).toLocaleTimeString() : null
    }
  };
};

const lookupStaff = async (clean, schoolId, user, date) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(clean);
  const clauses = [{ employee_code: clean }, { email: clean }, { cnic: clean }, { phone: clean }];
  if (isObjectId) clauses.push({ _id: clean });

  const staff = await User.findOne({
    school_id: schoolId,
    $or: clauses,
    role: { $in: ['Teacher', 'Staff', 'Admin', 'SuperAdmin'] }
  }).populate('campus_id', 'name').lean();
  if (!staff) return null;

  const todayAtt = await StaffAttendance.findOne({ school_id: schoolId, staff_id: staff._id, date }).lean();
  const isAdmin = ['Admin', 'SuperAdmin'].includes(user.role);

  return {
    type: 'staff',
    canMarkAttendance: isAdmin,
    canViewFullProfile: isAdmin,
    record: {
      _id: staff._id,
      name: staff.name,
      code: staff.employee_code || staff.email || clean,
      photo_url: staff.profile_picture || staff.photo_url || '',
      role_or_class: staff.designation || staff.role || 'Staff',
      campus_name: staff.campus_id?.name || 'Main Campus',
      emergency_contact: staff.emergency_contact || staff.phone || '',
      father_name: staff.father_name || '',
      blood_group: staff.blood_group || '',
      status: staff.status || 'Active',
      today_attendance: todayAtt?.status || null,
      time_recorded: todayAtt?.check_in_time || null
    }
  };
};

const resolveUniversalCode = async (rawCode, user) => {
  const clean = cleanCodeString(rawCode);
  const date = new Date().toISOString().slice(0, 10);
  const studentResult = await lookupStudent(clean, user.school_id, user, date);
  if (studentResult) return studentResult;
  const staffResult = await lookupStaff(clean, user.school_id, user, date);
  if (staffResult) return staffResult;
  return null;
};

module.exports = { resolveUniversalCode };
